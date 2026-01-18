import * as vscode from 'vscode';
export interface FolderDeletion {
  deleteFolder(uri: vscode.Uri): Promise<boolean>;
  exists(uri: vscode.Uri): Promise<boolean>;
}