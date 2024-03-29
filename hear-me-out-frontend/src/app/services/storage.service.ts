import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AudioFile } from '../folder/journal/interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

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
  
  
}
