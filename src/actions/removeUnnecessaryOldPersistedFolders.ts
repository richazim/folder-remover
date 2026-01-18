import { UrlPersistenceService } from "../services/UrlPersistenceService";
import * as vscode from 'vscode';
import { UnnecessaryFolderService } from '../services/UnnecessaryFolderService';
import PrettyError from "pretty-error";
import { removeFolder } from "./removeFolder";

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