import * as vscode from 'vscode';
import { UnnecessaryFolderService } from '../services/UnnecessaryFolderService';
import { UrlPersistenceService } from '../services/UrlPersistenceService';
import { FolderRemoverConfig } from '../config/folderRemover.config';

export async function saveNewUnnecessaryFolders(context: vscode.ExtensionContext) {
  const urlPersistenceService = UrlPersistenceService.getInstance(context);
  const unnecessaryFolderService = await UnnecessaryFolderService.getInstance(context);

  const folders = await unnecessaryFolderService.findUnnecessaryFolders(FolderRemoverConfig.getFoldersToTrack());

  if (folders.length) {
    await urlPersistenceService.changePersistedUris(folders);
  }
}