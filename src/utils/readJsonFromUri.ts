import * as vscode from "vscode";

export async function readJsonFromUri<T = unknown>(
  uri: vscode.Uri
): Promise<T | null> {
  try {
    const bytes = await vscode.workspace.fs.readFile(uri);
    const content = Buffer.from(bytes).toString("utf8");
    return JSON.parse(content) as T;
  } catch (error) {
    return null;
  }
}
