// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { saveNewUnnecessaryFolders } from './use-cases/saveNewUnnecessaryFolders';
import { removeUnnecessaryOldPersistedFolders } from './use-cases/removeUnnecessaryOldPersistedFolders';
import fs from "fs/promises";
import { configJsonUri, UnnecessaryFolderService } from './services/UnnecessaryFolderService';
import { STORAGE_KEY, UrlPersistenceService } from './services/UrlPersistenceService';

let globalContext: vscode.ExtensionContext | null = null; // Temporary: After, We will find another way to get uris to delete directly in deactivate func.

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
  const urlPersistenceService = UrlPersistenceService.getInstance(context);
  
  vscode.window.showInformationMessage('Auto Folder Remover: Extension activated!!!!!!!!!!!!!');

  removeUnnecessaryOldPersistedFolders(context);

  globalContext = context;

  // Save already present unwanted files.
  setTimeout(() => {
    saveNewUnnecessaryFolders(context);
    globalContext = context;
  }, 3000);

  // Create a file system watcher that watches for all file/folder creations in the workspace
  // The glob pattern "**" matches everything in the workspace.
  // The arguments (ignoreChangeEvents, ignoreDeleteEvents, ignoreCreateEvents) are all set to false.
  const watcher = vscode.workspace.createFileSystemWatcher('**', false, false, false);
  // Subscribe to the onDidCreate event
  watcher.onDidCreate(async (uri: vscode.Uri) => {
    saveNewUnnecessaryFolders(context); // track and save new created unwanted folders
    globalContext = context;
  });

  const scanCmd = vscode.commands.registerCommand("folderremover.scan", async () => {
    saveNewUnnecessaryFolders(context);
    const uris = UrlPersistenceService.getInstance(context).getUrlsAsFullpaths();
    if(uris.length > 0) {
      vscode.window.showInformationMessage(`
        Auto Folder Remover: (Scan Finished). \n
        ${uris.length} unnecessary folders have been found: \n
        ${JSON.stringify(uris, null, 2)}`
      );
    } else {
      vscode.window.showInformationMessage(`
        Auto Folder Remover: (Scan Finished). \n
        No unnecessary folders have been found.`
      );
    }
  });

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const removeNowCmd = vscode.commands.registerCommand('folderremover.removeNow', async (context) => {
    removeUnnecessaryOldPersistedFolders(context);
    saveNewUnnecessaryFolders(context);
    globalContext = context;
	});

  const configureExcludedFoldersCmd = vscode.commands.registerCommand('folderremover.configureExcludedFolders', async (context) => {
    await vscode.commands.executeCommand("vscode.open", configJsonUri);
  });

  const authorCmd = vscode.commands.registerCommand('folderremover.author', async (context) => {
    vscode.window.showInformationMessage(`
         Auto Folder Remover:\n
         Author: Azim SAÏBOU\n
         GitHub: https://github.com/richazim\n
         Linkedin: https://www.linkedin.com/in/azimsaibou/
      `);
  });


	context.subscriptions.push(scanCmd, removeNowCmd, configureExcludedFoldersCmd, authorCmd);

  // to dispose of the file creation watcher when the extension is deactivated
  context.subscriptions.push(watcher);
}

// This method is called when your extension is deactivated
export async function deactivate() {
  if(globalContext) {
    let unnecessaryUris: string[] = [];
    let uris: vscode.Uri[] = globalContext.globalState.get(STORAGE_KEY) || [];
    
    uris.forEach((element: vscode.Uri) => {
      if(!unnecessaryUris.includes(element.path)){
        unnecessaryUris.push(element.path);
      }
    });

    for(let i = 0; i < unnecessaryUris.length; i++) {
       await fs.rm(unnecessaryUris[i], {
          recursive: true,
          force: true,
        });
    }    
  }
}

