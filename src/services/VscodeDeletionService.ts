// services/FileDeletionService.ts
import * as vscode from 'vscode';
import { retry } from '../utils/retry';
import { FolderDeletion } from '../interfaces/FolderDeletion';

export class VscodeDeletionService implements FolderDeletion {
  async deleteFolder(uri: vscode.Uri): Promise<void> {
    await retry(async () => {
      await vscode.workspace.fs.delete(uri, {
        recursive: true,
        useTrash: false, // CRUCIAL
      });
    }, 3, 500);
  }

  async exists(uri: vscode.Uri): Promise<boolean> {
    try {
      await vscode.workspace.fs.stat(uri);
      return true;
    } catch {
      return false;
    }
  }
}
