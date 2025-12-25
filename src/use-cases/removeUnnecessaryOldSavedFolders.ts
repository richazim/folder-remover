import { UrlPersistenceService } from "../services/UrlPersistenceService";
import * as vscode from 'vscode';
import { UnnecessaryFolderService } from '../services/UnnecessaryFolderService';

export async function removeUnnecessaryOldSavedFolders(context: vscode.ExtensionContext) {
  const urlPersistenceService = UrlPersistenceService.init(context);
  const unnecessaryFolderService = UnnecessaryFolderService.getInstance(context);
  
  const folders = urlPersistenceService.getUrls();
  if(folders.length) { 
    console.log("old folders", folders);
    folders.forEach(folder => {
      urlPersistenceService.removeUrl(folder);
      unnecessaryFolderService.removeFolder(folder); 
    });
  }
}