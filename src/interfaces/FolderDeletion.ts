import * as vscode from 'vscode';
export interface FolderDeletion {
  deleteFolder(uri: vscode.Uri): Promise<void>;
}