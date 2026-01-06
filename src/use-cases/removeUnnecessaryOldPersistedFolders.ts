import { UrlPersistenceService } from "../services/UrlPersistenceService";
import * as vscode from 'vscode';
import { UnnecessaryFolderService } from '../services/UnnecessaryFolderService';
import PrettyError from "pretty-error";

export async function removeUnnecessaryOldPersistedFolders(context: vscode.ExtensionContext) {
  const urlPersistenceService = UrlPersistenceService.getInstance(context);
  const unnecessaryFolderService = await UnnecessaryFolderService.getInstance(context);
  
  const folders = urlPersistenceService.getUrls();
  if(folders.length) { 
    folders.forEach(folder => {
      urlPersistenceService.removeUrl(folder);
      unnecessaryFolderService.removeFolder(folder); 
    });
  }
}