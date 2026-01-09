// services/ShellDeletionService.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import { FolderDeletion } from '../interfaces/FolderDeletion';
import * as vscode from 'vscode';

const execAsync = promisify(exec);

export class ShellDeletionService implements FolderDeletion {
  async deleteFolder(uri: vscode.Uri): Promise<void> {
    const path = uri.path;
    const command =
      process.platform === 'win32'
        ? `rmdir /s /q "${path}"`
        : `rm -rf "${path}"`;

    await execAsync(command);
  }
}
