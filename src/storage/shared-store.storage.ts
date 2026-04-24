import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class AppendOnlyStore {
  static filename = "global_store.json";
  private filePath: string;
  private listeners: ((line: string) => void)[] = [];

  private lastSize = 0;

  constructor(private context: vscode.ExtensionContext) {
    const dir = context.globalStorageUri.fsPath;

    // 🔥 ensure dir
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.filePath = path.join(dir, AppendOnlyStore.filename);

    // 🔥 ensure file
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, "");
    }

    // 🔥 watch changes (multi fenêtres)
    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(
        context.globalStorageUri,
        AppendOnlyStore.filename
      )
    );

    watcher.onDidChange(() => this.handleChange());
  }

  append(line: string) {
    // 🔥 append = rapide + safe
    fs.appendFileSync(this.filePath, line + "\n");
  }

  appendMany(lines: string[]) {
    if (!lines.length) return;

    const payload = lines
      .map((l) => l.replace(/\n/g, "")) // 🔥 sécurité
      .map((l) => l + "\n")
      .join("");

    fs.appendFileSync(this.filePath, payload);
  }

  readAll(): string[] {
    const content = fs.readFileSync(this.filePath, "utf-8");

    return content.split("\n").filter(Boolean).reverse(); // 🔥 latest first
  }

  onDidAppend(listener: (line: string) => void) {
    this.listeners.push(listener);
  }

  // private handleChange() {
  //   const lines = this.readAll();

  //   // 🔥 on envoie la dernière ligne uniquement
  //   if (lines.length > 0) {
  //     const latest = lines[0];
  //     this.listeners.forEach((l) => l(latest));
  //   }
  // }

  private handleChange() {
    const stats = fs.statSync(this.filePath);

    if (stats.size <= this.lastSize) return;

    const stream = fs.createReadStream(this.filePath, {
      start: this.lastSize,
      end: stats.size,
    });

    let newData = "";

    stream.on("data", (chunk) => {
      newData += chunk.toString();
    });

    stream.on("end", () => {
      this.lastSize = stats.size;

      const newLines = newData.split("\n").filter(Boolean);
      newLines.forEach((line) => {
        this.listeners.forEach((l) => l(line));
      });
    });
  }

  clear() {
    fs.truncateSync(this.filePath, 0);
    this.lastSize = 0;

    // 🔥 signal "reset"
    this.listeners.forEach((l) => l("__CLEARED__"));
  }
}
