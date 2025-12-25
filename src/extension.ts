// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { UrlPersistenceService } from './services/UrlPersistenceService';
import { UnnecessaryFolderService } from './services/UnnecessaryFolderService';
import { saveNewUnnecessaryFolders } from './use-cases/saveNewUnnecessaryFolders';
import { removeUnnecessaryOldSavedFolders } from './use-cases/removeUnnecessaryOldSavedFolders';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
  
	console.log('Folder Remover Extension activated!!!!!!!!!!!!!');

  removeUnnecessaryOldSavedFolders(context);

  // Save already present unwanted files.
  setTimeout((context) => saveNewUnnecessaryFolders(context), 3000);

  // Create a file system watcher that watches for all file/folder creations in the workspace
  // The glob pattern "**" matches everything in the workspace.
  // The arguments (ignoreChangeEvents, ignoreDeleteEvents, ignoreCreateEvents) are all set to false.
  const watcher = vscode.workspace.createFileSystemWatcher('**', false, false, false);
  // Subscribe to the onDidCreate event
  watcher.onDidCreate(async (uri: vscode.Uri) => {
    saveNewUnnecessaryFolders(context); // track and save new created unwanted folders
  });

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('folderremover.folderRemover', async (context) => {
    saveNewUnnecessaryFolders(context);
	});
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export async function deactivate() {
  
}

