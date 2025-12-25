import * as vscode from 'vscode';
export class UnnecessaryFolderService {
  private static unnecessaryFolderServiceInstance: UnnecessaryFolderService;
  private readonly context: vscode.ExtensionContext;
  private excludedFolderNames: string[];

  private constructor(context: vscode.ExtensionContext, excludedFolderNames: string[] = []) {
    this.context = context;
    this.excludedFolderNames = excludedFolderNames;
  }

  /**
   * Gets the instance of UnnecessaryFolderService.
   * If the instance has not been created before, it creates a new instance
   * with the given context and default excluded folder names.
   * @param context The extension context.
   * @returns The instance of UnnecessaryFolderService.
   */
  public static getInstance(context: vscode.ExtensionContext): UnnecessaryFolderService {
    if(!UnnecessaryFolderService.unnecessaryFolderServiceInstance) {
      const excludedFolderNames = ["node_modules", "dist", ".next"];
      UnnecessaryFolderService.unnecessaryFolderServiceInstance = new UnnecessaryFolderService(context, excludedFolderNames);
    }
    return UnnecessaryFolderService.unnecessaryFolderServiceInstance;
  }

  public async findUnnecessaryFolders(): Promise<vscode.Uri[]> {
    const actualWorkspaceUri = vscode.workspace.workspaceFolders![0].uri;
    const allEntries = await vscode.workspace.fs.readDirectory(actualWorkspaceUri);
    const unnecessaryFolders = allEntries.filter(([name, type]) => {
      return this.excludedFolderNames.includes(name) && type === vscode.FileType.Directory;
    });
    return unnecessaryFolders.map(([name]) => {
      return vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, name);
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
  public async removeFolder(uri: vscode.Uri): Promise<void> {
    await vscode.workspace.fs.delete(uri, {
      recursive: true,
      useTrash: true,
    });
  }
}