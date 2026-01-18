// services/FileDeletionService.ts
import * as vscode from 'vscode';
import { retry } from '../utils/retry';
import { FolderDeletion } from '../interfaces/FolderDeletion';

export class VscodeDeletionService implements FolderDeletion {
  public async deleteFolder(uri: vscode.Uri): Promise<boolean> {
    await retry(async () => {
      await vscode.workspace.fs.delete(uri, {
        recursive: true,
        useTrash: false, // CRUCIAL
      });
    }, 3, 500);

    const exists = await this.exists(uri);

    if (exists) {
      return true;
    }
    return false;
  }

  public async exists(uri: vscode.Uri): Promise<boolean> {
    try {
      await vscode.workspace.fs.stat(uri);
      return true;
    } catch {
      return false;
    }
  }
}
