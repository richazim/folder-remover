import * as vscode from 'vscode';
import { readJsonFromUri } from '../utils/readJsonFromUri';
import { prettyPrintError } from '../utils/prettyPrintError';
import { fileExists } from '../utils/fileExist';
import { UrlPersistenceService } from './UrlPersistenceService';

export class UnnecessaryFolderService {
  private static unnecessaryFolderServiceInstance: UnnecessaryFolderService;

  private constructor() {
  }

  /**
   * Gets the instance of UnnecessaryFolderService.
   * If the instance has not been created before, it creates a new instance
   * with the given context and default excluded folder names.
   * @param context The extension context.
   * @returns The instance of UnnecessaryFolderService.
   */
  public static async getInstance(context: vscode.ExtensionContext): Promise<UnnecessaryFolderService> {
    if(!UnnecessaryFolderService.unnecessaryFolderServiceInstance) {
      // const t = await readJsonFromUri<{excludedFolders: string[]}>(configJsonUri);
      // const excludedFolderNames = t?.excludedFolders;
      UnnecessaryFolderService.unnecessaryFolderServiceInstance = new UnnecessaryFolderService();
    }
    return UnnecessaryFolderService.unnecessaryFolderServiceInstance;
  }

  public async findUnnecessaryFolders(foldersToTrack: string[]): Promise<vscode.Uri[]> {
    const actualWorkspaceUri = vscode.workspace.workspaceFolders![0].uri;

    const allEntries = await vscode.workspace.fs.readDirectory(actualWorkspaceUri);

    const unnecessaryFolders = allEntries.filter(([name, type]) => {
      return foldersToTrack.includes(name) && 
              type === vscode.FileType.Directory;
    });

    return unnecessaryFolders.map(([name]) => {
      const folderUri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, name);
      return folderUri;
    });
  }

  /**
   * Deletes the folder at the given uri.
   * The deletion is recursive, i.e. all files and subfolders
   * will be deleted.
   * The useTrash option is set to true, which means that the
   * deleted files will be moved to the system's trash can.
   * @param uri The uri of the folder to be deleted.
   */
  // public async removeFolder(uri: vscode.Uri): Promise<void> {
  //   try{
  //     if(await fileExists(uri)) {
  //       await vscode.workspace.fs.delete(uri, {
  //         recursive: true,
  //         useTrash: true,
  //       });
  //     }
  //   }catch(error) {
  //     prettyPrintError(error);
  //   }
  // }
}