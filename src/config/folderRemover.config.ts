import * as vscode from "vscode";

export const defaultFoldersToTrack = ["node_modules", "dist", ".next"];

export class FolderRemoverConfig {
  private static foldersToTrack: string[] = [];

  static init() {
    this.reload();

    // Event listener to reloads the foldersToTrack each time user changes it in vscode setting.json
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration("folderremover.foldersToTrack")) {
        this.reload();
      }
    });
  }

  static getFoldersToTrack(): string[] {
    return this.foldersToTrack;
  }

  private static reload() {
    const raw = vscode.workspace
      .getConfiguration("folderremover")
      .get<string[]>("foldersToTrack", defaultFoldersToTrack);

    this.foldersToTrack = Array.isArray(raw)
      ? raw.filter(v => typeof v === "string")
      : [];
  }
}
