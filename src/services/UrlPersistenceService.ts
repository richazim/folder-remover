import * as vscode from "vscode";

export const STORAGE_KEY = "urlStore.urls";

export class UrlPersistenceService {
  private static instance: UrlPersistenceService;
  private context: vscode.ExtensionContext;

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  public static getInstance(context: vscode.ExtensionContext): UrlPersistenceService {
    if (!UrlPersistenceService.instance) {
      UrlPersistenceService.instance = new UrlPersistenceService(context);
    }
    return UrlPersistenceService.instance;
  }

  getUrlsAsFullpaths(): string[] {
    const urls = this.getUrls();

    const fullPaths = urls.map((name) => {
        const folderUri = name.path;
        return folderUri;
    });

    return fullPaths;
  }

  async addUrl(url: vscode.Uri): Promise<void> {
    const urls = this.getUrls();

    if (urls.includes(url)) {
      return;
    };

    urls.push(url);
    await this.context.globalState.update(STORAGE_KEY, urls);
  }

  getUrls(): vscode.Uri[] {
    return this.context.globalState.get<vscode.Uri[]>(STORAGE_KEY, []);
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
