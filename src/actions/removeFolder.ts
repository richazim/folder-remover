// commands/removeNodeModules.command.ts
import * as vscode from 'vscode';
import { ShellDeletionService } from '../services/ShellDeletionService';
import { VscodeDeletionService } from '../services/VscodeDeletionService';
import { prettyPrintError } from '../utils/prettyPrintError';

export async function removeFolder(
  uri: vscode.Uri
): Promise<boolean> {
  const vsService = new VscodeDeletionService();
  const shellService = new ShellDeletionService();

  // Stop TS Server (libère des locks)
  await vscode.commands.executeCommand('typescript.restartTsServer');

  // Tentative propre via VS Code FS
  // const isDeleted = await vsService.deleteFolder(uri);

  // if(isDeleted) {
  //   return true;
  // }
  try{
    return await vsService.deleteFolder(uri);
  }catch(e) {
    prettyPrintError(e);
  }

  // Fallback shell (dernier recours)
  return await shellService.deleteFolder(uri);
}
