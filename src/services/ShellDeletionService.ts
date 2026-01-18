// services/ShellDeletionService.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import { FolderDeletion } from '../interfaces/FolderDeletion';
import * as vscode from 'vscode';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

export class ShellDeletionService implements FolderDeletion {
  async deleteFolder(uri: vscode.Uri): Promise<boolean> {
    const path = uri.path;
    const command =
      process.platform === 'win32'
        ? `rmdir /s /q "${path}"`
        : `rm -rf "${path}"`;

    await execAsync(command);
    
    try{
      return !await this.exists(uri);
    }catch (error) {
      return false;
    }
  }

  async exists(uri: vscode.Uri): Promise<boolean> {
    try {
      await fs.access(uri.path);
      return true;
    } catch {
      return false;
    }
  }
}
