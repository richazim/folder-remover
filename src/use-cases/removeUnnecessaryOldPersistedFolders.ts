import { UrlPersistenceService } from "../services/UrlPersistenceService";
import * as vscode from 'vscode';
import { UnnecessaryFolderService } from '../services/UnnecessaryFolderService';
import PrettyError from "pretty-error";

export async function removeUnnecessaryOldPersistedFolders(context: vscode.ExtensionContext) {
  const urlPersistenceService = UrlPersistenceService.getInstance(context);
  const unnecessaryFolderService = await UnnecessaryFolderService.getInstance(context);
  
  try{
    const folders = urlPersistenceService.getUrls();
    if(folders.length) { 
      folders.forEach(folder => {
        urlPersistenceService.removeUrl(folder);
        unnecessaryFolderService.removeFolder(folder); 
      });
    }
  }catch(error: any){
    console.log(new PrettyError().render(error));
  }
}