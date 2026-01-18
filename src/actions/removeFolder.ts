// commands/removeNodeModules.command.ts
import * as vscode from 'vscode';
import { ShellDeletionService } from '../services/ShellDeletionService';
import { VscodeDeletionService } from '../services/VscodeDeletionService';

export async function removeFolder(
  uri: vscode.Uri
): Promise<boolean> {
  const vsService = new VscodeDeletionService();
  const shellService = new ShellDeletionService();

  // 1️⃣ Stop TS Server (libère des locks)
  await vscode.commands.executeCommand('typescript.restartTsServer');

  // 2️⃣ Tentative propre via VS Code FS
  const isDeleted = await vsService.deleteFolder(uri);

  if(isDeleted) {
    return true;
  }

  // 3️⃣ Fallback shell (dernier recours)
  return await shellService.deleteFolder(uri);
}
