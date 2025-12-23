import * as vscode from "vscode";
import { UrlStore } from "./UrlStore";

// export async function getWorkspaceFilesAndFolders(): Promise<vscode.Uri[]> {
//   const folders = vscode.workspace.workspaceFolders;
//   if (!folders) return [];

//   const result: vscode.Uri[] = [];

//   for (const folder of folders) {
//     await walk(folder.uri, result);
//   }

//   return result;
// }

// async function walk(dir: vscode.Uri, result: vscode.Uri[]) {
//   const entries = await vscode.workspace.fs.readDirectory(dir);

//   for (const [name, type] of entries) {
//     if (name === "node_modules" || name.startsWith(".")) continue;

//     const uri = vscode.Uri.joinPath(dir, name);
//     result.push(uri); // 👈 files AND folders

//     if (type === vscode.FileType.Directory) {
//       await walk(uri, result);
//     }
//   }
// }

const v: string[] = ["node_modules", "dist", ".next"]

export async function getFolders(): Promise<vscode.Uri[]> {
  const files = await vscode.workspace.fs.readDirectory(vscode.workspace.workspaceFolders![0].uri);

  const foldersToRemove = files.filter(([name, type]) => {
    return v.includes(name) && type === vscode.FileType.Directory;
  });

  if (!foldersToRemove.length) {
    return [];
  }

  const foldersToRemoveAsSimpleArray = foldersToRemove.map(([name]) => {
    return vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, name);
  });

  return foldersToRemoveAsSimpleArray;
}

// export async function folderExists(uri: vscode.Uri): Promise<boolean> {
//   try {
//     const stat = await vscode.workspace.fs.stat(uri);
//     return stat.type === vscode.FileType.Directory;
//   } catch {
//     return false;
//   }
// }

export async function deleteFolder(uri: vscode.Uri) {
  await vscode.workspace.fs.delete(uri, {
    recursive: true,
    useTrash: true, // 👈 important (undo-friendly)
  });
}



// export async function removeUnnecessaryFolders() {
//   const dirs = await findFolders();

//   if (!dirs.length) {
//     console.log("Folder Remover Extension", "No folders to remove found.");
//     return;
//   }

//   for (const dir of dirs) {
//     await deleteNodeModules(dir);
//   }

//   console.log("Folder Remover Extension", "Unnecessary folders removed successfully.");
// }

