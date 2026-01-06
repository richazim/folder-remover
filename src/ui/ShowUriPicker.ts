import * as vscode from "vscode";
import { UrlPersistenceService } from "../services/UrlPersistenceService";
import { UnnecessaryFolderService } from '../services/UnnecessaryFolderService';
import { prettyPrintError } from "../utils/prettyPrintError";

export async function showUriPicker(uris: vscode.Uri[], context: vscode.ExtensionContext) {
  const items: vscode.QuickPickItem[] = uris.map(uri => ({
    label: vscode.workspace.asRelativePath(uri),
    description: uri.path,
  }));

  if(items.length === 0) {
    vscode.window.showInformationMessage("Auto Folder Remover: No tracked uri(s) found");
    return;
  }

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: "Select uri(s) to untrack and click 'OK' to confirm, or just click 'OK' to cancel.",
    canPickMany: true,
  });

  if (!selected) {
    return;
  }

  console.log("selected.....", selected, uris);

  // const selectedUris = uris.filter(
  //   (u, i) => (selected[i]) ? u.path === selected[i].description : false
  // );
  const selectedUris = selected.map((selectedItem) => vscode.Uri.parse(selectedItem.description as string));

  console.log("selectedUris.....", selectedUris);

  if (selectedUris.length > 0) {
    // await vscode.window.showTextDocument(uri);
    const urlPersistenceService = UrlPersistenceService.getInstance(context);
    // const unnecessaryFolderService = await UnnecessaryFolderService.getInstance(context);

    selectedUris.forEach(async (uri) => {
      // try{
      //   await unnecessaryFolderService.removeFolder(uri);
      // } catch (error: any){
      //   prettyPrintError(error);
      // }

      try{
        await urlPersistenceService.removeUrl(uri);
      }catch(error: any){
        prettyPrintError(error);
      }
    });

    vscode.window.showInformationMessage(`
      Auto Folder Remover: ${selectedUris.length} uri(s) untracked successfully.
    `);
  }
}
