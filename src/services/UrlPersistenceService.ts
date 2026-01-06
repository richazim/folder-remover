import * as vscode from "vscode";
import { prettyPrintError } from "../utils/prettyPrintError";

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

    this.clearStore();

    await this.context.globalState.update(STORAGE_KEY, urls);
  }

  getUrls(): vscode.Uri[] {
    return this.context.globalState.get<vscode.Uri[]>(STORAGE_KEY) || [];
  }

  async changePersistedUris(urisToPersist: vscode.Uri[]): Promise<void> {
    const persistedUrisAsPaths = this.getUrlsAsFullpaths();
    const persistedUris = this.getUrls();

    // const newUrls = urls.filter((url) => !existingUrls.includes(url.path));
    let newUrisToPersist: vscode.Uri[] = [];
    urisToPersist.forEach((newUriToPersist) => {
      if(!persistedUrisAsPaths.includes(newUriToPersist.path)){
        newUrisToPersist.push(newUriToPersist);
      }
    });

    this.clearStore();

    await this.context.globalState.update(STORAGE_KEY, [...persistedUris, ...newUrisToPersist]);
  }

  async removeUrl(url: vscode.Uri): Promise<void> {
    const actualPersistedUrls = this.getUrls() || [];
    if(actualPersistedUrls.length === 0) {
      return;
    }
    
    try{
      const filtred = actualPersistedUrls.filter((persistedUrl) => persistedUrl.path !== url.path); 

      this.clearStore();
      
      await this.context.globalState.update(STORAGE_KEY, filtred);
    }catch(error) {
      prettyPrintError(error);
    }
  }

  async clearStore(): Promise<void> {
    await this.context.globalState.update(STORAGE_KEY, []);
  }
}
