// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { saveNewUnnecessaryFolders } from "./actions/saveNewUnnecessaryFolders";
import { removeAllExcludingUrisFromOpenedProjects, removeUnnecessaryOldPersistedFolders } from "./actions/removeUnnecessaryOldPersistedFolders";
import fs from "fs/promises";
import {
  UnnecessaryFolderService,
} from "./services/UnnecessaryFolderService";
import {
  STORAGE_KEY,
  UrlPersistenceService,
} from "./services/UrlPersistenceService";
import { showUriPicker } from "./ui/ShowUriPicker";
import { FolderRemoverConfig } from "./config/folderRemover.config";
import { OpenedProjectUriService } from "./services/opened-project-uri.service";
import { OpenedProjectUriStorage } from "./storage/opened-project-uri.storage";
import { cleanOpenedProjectUris } from "./actions/cleanOpenedProjectUris";
import { prettyPrintError } from "./utils/prettyPrintError";
import { open } from "fs";
import { AppendOnlyStore } from "./storage/shared-store.storage";

let globalContext: vscode.ExtensionContext | null = null; // Temporary: After, We will find another way to get uris to delete directly in deactivate func.

/**
 * This variable will contain the current opened vscode project uri.
 */
let currentOpenedProjectUri: vscode.Uri | null = null;

let openedProjectUriService: OpenedProjectUriService;
let store: AppendOnlyStore;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  const urlPersistenceService = UrlPersistenceService.getInstance(context);
  const unnecessaryFolderService = await UnnecessaryFolderService.getInstance(context);

  openedProjectUriService = new OpenedProjectUriService(new AppendOnlyStore(context));
  store = new AppendOnlyStore(context);

  vscode.window.showInformationMessage(
    "Auto Folder Remover: Extension activated!"
  );

  /**
   * Clean closed vscode project from opened vscode project uris
   */
  cleanOpenedProjectUris(context, openedProjectUriService.getAll());

  /**
   * Opened Project Uri
   */
  currentOpenedProjectUri = vscode.workspace.workspaceFolders![0].uri || null;
  openedProjectUriService.add(currentOpenedProjectUri);

  
  // removeUnnecessaryOldPersistedFolders(context); // We use this given vscode context to be able to use the vscode persistance storer (globalState).
  removeAllExcludingUrisFromOpenedProjects(context);
  globalContext = context; // because the context is modified by removeUnnecessaryOldPersistedFolders but I want the new context so I can use it in deactivate method.

  FolderRemoverConfig.init(); // Initialize the foldersToTrack

  // Save already present unwanted files.
  setTimeout(() => {
    saveNewUnnecessaryFolders(context);
    globalContext = context;
  }, 3000);

  // Create a file system watcher that watches for all file/folder creations in the workspace
  // The glob pattern "**" matches everything in the workspace.
  // The arguments (ignoreChangeEvents, ignoreDeleteEvents, ignoreCreateEvents) are all set to false.
  const watcher = vscode.workspace.createFileSystemWatcher(
    "**",
    false,
    false,
    false
  );
  // Subscribe to the onDidCreate event
  watcher.onDidCreate(async (uri: vscode.Uri) => {
    let drapeau = false;
    FolderRemoverConfig.getFoldersToTrack().forEach((excludedFolderName) => {
      const excludedFolderNamePath = vscode.workspace.workspaceFolders![0].uri.path + `/${excludedFolderName}`;
      if (
        uri.path === excludedFolderNamePath || 
        uri.path === excludedFolderNamePath + "/"
        // !uri.path.startsWith(excludedFolderNamePath + "/")
      ) {
        // drapeau = true;
        urlPersistenceService.addUrl(uri);
        globalContext = context;
      }
    });
    // if (drapeau) {
    //   setTimeout(() => {
    //     saveNewUnnecessaryFolders(context);
    //     globalContext = context;
    //   }, 1000);
    // }
  });

  const scanCmd = vscode.commands.registerCommand(
    "folderremover.trackUntracked",
    async () => {
      // saveNewUnnecessaryFolders(context);

      const alreadyPersistedUris = urlPersistenceService.getUrls();
      
      const urisToPersist = await unnecessaryFolderService.findUnnecessaryFolders(FolderRemoverConfig.getFoldersToTrack());

      if (urisToPersist.length > 0) {
        urlPersistenceService.changePersistedUris(urisToPersist);
        vscode.window.showInformationMessage(`
        Auto Folder Remover: ${urisToPersist.length - alreadyPersistedUris.length} unnecessary folder(s) is newly tracked.
        `);
      } else {
        vscode.window.showInformationMessage(`
        Auto Folder Remover: 0 unnecessary folder(s) is newly tracked.`);
      }
    }
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const removeNowCmd = vscode.commands.registerCommand(
    "folderremover.removeAllTrackedFolders",
    async (context) => {
      saveNewUnnecessaryFolders(context);
      removeUnnecessaryOldPersistedFolders(context);
      globalContext = context;
    }
  );

  const configureExcludedFoldersCmd = vscode.commands.registerCommand(
    "folderremover.configureFolderToTrack",
    async (context) => {
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "folderremover.foldersToTrack"
      );
    }
  );

  const untrackAllCmd = vscode.commands.registerCommand(
    "folderremover.untrackAll",
    async (context) => {
      await urlPersistenceService.clearStore();
      vscode.window.showInformationMessage(
        "Auto Folder Remover: Persisted URLs have been cleared from the storage."
      );
    }
  );

  const authorCmd = vscode.commands.registerCommand(
    "folderremover.author",
    async (context) => {
      vscode.window.showInformationMessage(`
         Auto Folder Remover:\n
         Author: Azim SAÏBOU\n
         GitHub: https://github.com/richazim\n
         Linkedin: https://www.linkedin.com/in/azimsaibou/\n
      `, { modal: true });

      // await store.append("project://my-folder");
    }
  );

  const untrackCmd = vscode.commands.registerCommand(
    "folderremover.trackedList",
    async (context) => {
      const uris =
        urlPersistenceService.getUrls();
      
        if(uris.length > 0) {
          showUriPicker(uris, context);
        }else{
          vscode.window.showInformationMessage("Auto Folder Remover: No tracked unnecessary folder found in this project.");
        }
    }
  );

  const currentOpenedProjectCmd = vscode.commands.registerCommand(
    "folderremover.currentOpenedProjects",
    async (context) => {
      const uris = await openedProjectUriService.getAll();

      const items: vscode.QuickPickItem[] = uris.map(uri => ({
          label: vscode.workspace.asRelativePath(uri),
          description: uri,
        }));
      
        if(items.length > 0) {
            await vscode.window.showQuickPick(items, {
              placeHolder: "",
              canPickMany: true,
            });
        }else{
          vscode.window.showInformationMessage("Auto Folder Remover: No tracked unnecessary folder found in this project.");
        }
    }
  );
  
  // écouter les changement dans le append store file.
  store.onDidAppend((line: string) => {
    if(line.endsWith(":deleted")){
      console.log("Suppression prête pour:", line);
    } else {
      console.log("Ligne ajoutée:", line);
    }
  });


  context.subscriptions.push(
    scanCmd,
    removeNowCmd,
    configureExcludedFoldersCmd,
    authorCmd,
    untrackAllCmd,
    untrackCmd,
    currentOpenedProjectCmd
  );

  // to dispose of the file creation watcher when the extension is deactivated
  context.subscriptions.push(watcher);
}

// This method is called when your extension is deactivated
export async function deactivate() {
  if (!globalContext || !currentOpenedProjectUri) return;

  if (openedProjectUriService) {
    openedProjectUriService.remove(currentOpenedProjectUri.path);
  }

  const uris: vscode.Uri[] =
    globalContext.globalState.get(STORAGE_KEY) || [];

  // Filtrer directement les dossiers à supprimer
  const unnecessaryUris = uris.filter((uri) =>
    uri.path.startsWith(currentOpenedProjectUri!.path)
  );

  // Suppression robuste séquentielle (évite les conflits système)
  for (const uri of unnecessaryUris) {
    try {
      await fs.rm(uri.path, {
        recursive: true,
        force: true,
        maxRetries: 10,
        retryDelay: 100,
      });
    } catch (error) {
      prettyPrintError(error);
    }
  }
}