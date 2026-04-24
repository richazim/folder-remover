import { UrlPersistenceService } from "../services/UrlPersistenceService";
import * as vscode from 'vscode';
import { UnnecessaryFolderService } from '../services/UnnecessaryFolderService';
import PrettyError from "pretty-error";
import { removeFolder } from "./removeFolder";
import { OpenedProjectUriService } from '../services/opened-project-uri.service';
import { OpenedProjectUriStorage } from "../storage/opened-project-uri.storage";
import { prettyPrintError } from "../utils/prettyPrintError";
import { AppendOnlyStore } from "../storage/shared-store.storage";

export async function removeUnnecessaryOldPersistedFolders(context: vscode.ExtensionContext) {
  const urlPersistenceService = UrlPersistenceService.getInstance(context);
  
  const folders = urlPersistenceService.getUrls();
  if(folders.length) { 
    // Traitement parallèle
    const promesses = folders.map(async (uri) => {
      const isRemoved = await removeFolder(uri);
      if(isRemoved) {
        urlPersistenceService.removeUrl(uri);
      }
    });
    await Promise.all(promesses);
  }
}

export async function removeAllExcludingUrisFromOpenedProjects(
  context: vscode.ExtensionContext
): Promise<void> {
  const urlPersistenceService = UrlPersistenceService.getInstance(context);

  const openedProjectUriService = new OpenedProjectUriService(
    new AppendOnlyStore(context)
  );

  const openedProjectsUris = openedProjectUriService.getAll() ?? [];
  const folders = urlPersistenceService.getUrls();

  try{
    if (!folders.length) return;
  
    const foldersToRemove = folders.filter(
      (folder) =>
        !isFolderPartOfOpenedProjectsUris(folder.path, openedProjectsUris)
    );
  
    const promises = foldersToRemove.map(async (uri) => {
      const isRemoved = await removeFolder(uri);
      if (isRemoved) {
        urlPersistenceService.removeUrl(uri);
      }
    });
  
    await Promise.all(promises);
  }catch(e) {
    prettyPrintError(e);
  }

}


/**
 * 
 * @param uriToCheck exemple Uri: /Users/azimsaibou/Desktop/developer/1-Projects/Module/Vscode Extensions/folder-remover
 * @param uris exemple openedProjectsUris: [/Users/azimsaibou/Desktop/developer/1-Projects/Module/Vscode Extensions]
 */
function isFolderPartOfOpenedProjectsUris(
  folder: string,
  uris: string[]
): boolean {
  return uris.some(uri => folder.startsWith(uri));
}