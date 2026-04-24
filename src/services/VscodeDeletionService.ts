// services/FileDeletionService.ts
import * as vscode from 'vscode';
import { retry } from '../utils/retry';
import { FolderDeletion } from '../interfaces/FolderDeletion';

export class VscodeDeletionService implements FolderDeletion {
  public async deleteFolder(uri: vscode.Uri): Promise<boolean> {
    // await retry(async () => {
    //   await vscode.workspace.fs.delete(uri, {
    //     recursive: true,
    //     useTrash: false, // CRUCIAL
    //   });
    // }, 1, 500);

    await vscode.workspace.fs.delete(uri, {
        recursive: true,
        useTrash: false, // CRUCIAL
    });

    const exists = await this.exists(uri);

    // I want to force deletion by anyway. 
    // deleteFolder must always returns true.
    if (exists) {
      return this.deleteFolder(uri);
    }
    return true;
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
