import * as vscode from 'vscode';
export class OpenedProjectUriStorage {
  private KEY = "folderremover.openedProjectUris";

  constructor(private context: vscode.ExtensionContext) {}

  get(): string[] {
    return this.context.globalState.get<string[]>(this.KEY, []);
  }

  async set(uris: string[]) {
    /**
     * This array will contains every opened vscode project uris.
     */
    await this.context.globalState.update(this.KEY, uris);
  }

  async add(uri: string) {
    const uris = this.get();
    uris.push(uri);
    await this.set(uris);
  }

  async remove(uri: string) {
    const uris = this.get();
    uris.splice(uris.indexOf(uri), 1);
    await this.set(uris);
  }
}