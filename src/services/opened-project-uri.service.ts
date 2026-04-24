import { open } from "fs";
import { OpenedProjectUriStorage } from "../storage/opened-project-uri.storage";
import * as vscode from "vscode";
import { AppendOnlyStore } from "../storage/shared-store.storage";
export class OpenedProjectUriService {
  constructor(private storage: AppendOnlyStore) {}

  getAll(): string[] {
    return this.storage.readAll();
  }

  async add(uri: vscode.Uri) {
    // const current = this.storage.readAll();
    // const updated = Array.from(new Set([...current, uri.path]));

    await this.storage.append(uri.path);
  }

  async prepareDeletion(uri: vscode.Uri) {
    // const current = this.storage.get();
    // const updated = Array.from(new Set([...current, uri.path + ":deleted"]));

    await this.storage.append(uri.path + ":deleted");
  }

  // async remove(uri: vscode.Uri) {
  //   const uris = this.storage.get();
  //   uris.splice(uris.indexOf(uri.path), 1);
  //   await this.storage.set(uris);
  // }

  /**
   * Remove a URI from the global opened projects list
   */
  async remove(openedProjectUri?: string): Promise<void> {
    if (!openedProjectUri) return;

    // Récupération sécurisée
    const uris = this.storage.readAll();

    // Filtrage (immutable)
    const updatedUris = uris.filter(
      (uri) =>
        uri !== openedProjectUri /* ||
        !uri.startsWith(openedProjectUri + ":deleted") */
    );

    // Update seulement si changement (optimisation)
    if (updatedUris.length !== uris.length) {
      this.storage.clear();
      this.storage.appendMany(updatedUris);
    }
  }

  async isMarkedForDeletion(uri: string): Promise<boolean> {
    return this.storage.readAll().some((v) => v.endsWith(uri + ":deleted"));
  }

  async refreshOpenedProjectUris(context: vscode.ExtensionContext) {
    const uris = this.storage.readAll();

    uris.forEach((uri) => {
      const isUriPreparedToBeDeleted = uris.some((v) =>
        v.startsWith(uri + ":deleted")
      );

      if (isUriPreparedToBeDeleted) {
        this.remove(uri);
      }
    });
  }

  /**
   * Remove URI from storage only if it's marked as deleted.
   */
  async removeUriFromGlobalFileStoreIfUriIsMarkedForDeletion(
    uriToCheck?: string
  ): Promise<void> {
    if (!uriToCheck) return;

    if (await this.isMarkedForDeletion(uriToCheck)) {
      await this.remove(uriToCheck);
    }
  }
}
