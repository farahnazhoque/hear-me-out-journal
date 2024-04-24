import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AudioFile } from '../folder/journal/interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  filesChanged = new EventEmitter<void>();


  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  public async get(key: string): Promise<any> {
    return await this._storage?.get(key);
  }

  public async setFileInFolder(folderName: string, fileData: AudioFile): Promise<void> {
    const folder = (await this._storage?.get(folderName)) || [];
    folder.push(fileData);
    await this._storage?.set(folderName, folder);
  }
  
  public async getFilesInFolder(folderName: string): Promise<AudioFile[]> {
    return (await this._storage?.get(folderName)) || [];
  }

  public async clearFolder(folderName: string): Promise<void> {
    await this._storage?.set(folderName, []);
  }

  public async logAllFiles(): Promise<void> {
    if (!this._storage) {
      console.warn('Storage has not been initialized.');
      return;
    }
  
    const keys = await this._storage.keys();
    for (const key of keys) {
      const files = await this._storage.get(key);
      if (Array.isArray(files)) {
        console.log(`Folder: ${key}, Files: `, files);
      }
    }
  }

  public async removeFileFromFolder(folderName: string, fileData: AudioFile): Promise<void> {
    const folder = (await this._storage?.get(folderName)) || [];
    const updatedFolder = folder.filter((f: { name: string; }) => f.name !== fileData.name);
    await this._storage?.set(folderName, updatedFolder);
    this.filesChanged.emit();
  }
  
  // In StorageService
  public async getAllFiles(): Promise<AudioFile[]> {
    const keys = await this._storage?.keys();
    let allFiles: AudioFile[] = [];
    if (keys) {
      for (const key of keys) {
        const files = await this.getFilesInFolder(key);
        allFiles = allFiles.concat(files);
      }
    }
    return allFiles;
  }

  public async clearAllData(): Promise<void> {
    await this._storage?.clear();
    this.filesChanged.emit(); // Emit to update any listeners
    console.log('All storage data has been cleared.');
  }
  
}
