import * as vscode from "vscode";

const STORAGE_KEY = "urlStore.urls";

export class UrlStore {
  private static instance: UrlStore;
  private constructor(private readonly context: vscode.ExtensionContext) {}

  static init(context: vscode.ExtensionContext) {
    if (!UrlStore.instance) {
      UrlStore.instance = new UrlStore(context);
    }
    return UrlStore.instance;
  }

  static getInstance(): UrlStore {
    if (!UrlStore.instance) {
      throw new Error("UrlStore not initialized. Call init() first.");
    }
    return UrlStore.instance;
  }

  getUrls(): vscode.Uri[] {
    return this.context.globalState.get<vscode.Uri[]>(STORAGE_KEY, []);
  }

  async addUrl(url: vscode.Uri): Promise<void> {
    const urls = this.getUrls();

    if (urls.includes(url)) {
      return;
    };

    urls.push(url);
    await this.context.globalState.update(STORAGE_KEY, urls);
  }

  async addUrls(urls: vscode.Uri[]): Promise<void> {
    const existingUrls = this.getUrls();
    const newUrls = urls.filter(url => !existingUrls.includes(url));
    await this.context.globalState.update(STORAGE_KEY, [...existingUrls, ...newUrls]);
  }

  async removeUrl(url: vscode.Uri): Promise<void> {
    const urls = this.getUrls().filter(u => u !== url);
    await this.context.globalState.update(STORAGE_KEY, urls);
  }

  async clear(): Promise<void> {
    await this.context.globalState.update(STORAGE_KEY, []);
  }
}
