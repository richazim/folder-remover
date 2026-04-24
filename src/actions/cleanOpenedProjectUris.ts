import * as vscode from 'vscode';
import { OpenedProjectUriService } from '../services/opened-project-uri.service';
import { OpenedProjectUriStorage } from '../storage/opened-project-uri.storage';
import { AppendOnlyStore } from '../storage/shared-store.storage';
export async function cleanOpenedProjectUris(
  context: vscode.ExtensionContext,
  uris: string[]
): Promise<void> {
  if (!uris?.length) return;

  const openedProjectUriService = new OpenedProjectUriService(new AppendOnlyStore(context));

  const promises = uris.map((uri) =>
    openedProjectUriService.removeUriFromGlobalFileStoreIfUriIsMarkedForDeletion(uri)
  );

  await Promise.all(promises);
}