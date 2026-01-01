import * as vscode from 'vscode';
import { UnnecessaryFolderService } from '../services/UnnecessaryFolderService';
import { UrlPersistenceService } from '../services/UrlPersistenceService';

export async function saveNewUnnecessaryFolders(context: vscode.ExtensionContext) {
  const urlPersistenceService = UrlPersistenceService.getInstance(context);
  const unnecessaryFolderService = await UnnecessaryFolderService.getInstance(context);

  const folders = await unnecessaryFolderService.findUnnecessaryFolders();

  if (folders.length) {
    await urlPersistenceService.addUrls(folders);
  }
}