// commands/removeNodeModules.command.ts
import * as vscode from 'vscode';
import { ShellDeletionService } from '../services/ShellDeletionService';
import { VscodeDeletionService } from '../services/VscodeDeletionService';

export async function removeFolder(
  uri: vscode.Uri
): Promise<void> {
  const vsService = new VscodeDeletionService();
  const shellService = new ShellDeletionService();

  // 1️⃣ Stop TS Server (libère des locks)
  await vscode.commands.executeCommand('typescript.restartTsServer');

  // 2️⃣ Tentative propre via VS Code FS
  try {
    await vsService.deleteFolder(uri);

    if (!(await vsService.exists(uri))) {
      return;
    }
  } catch {
    // ignore → fallback
  }

  // 3️⃣ Fallback shell (dernier recours)
  try {
    await shellService.deleteFolder(uri);
  } catch (err) {
    vscode.window.showErrorMessage(
      'Impossible de supprimer node_modules'
    );
    console.error(err);
  }
}
