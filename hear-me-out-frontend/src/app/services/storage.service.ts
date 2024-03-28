import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    try {
      const storage = await this.storage.create();
      this._storage = storage;
      console.log('Storage is initialized');
    } catch (error) {
      console.error('Error initializing storage', error);
    }
  }

  public async set(key: string, value: any): Promise<void> {
    try {
      await this._storage?.set(key, value);
      console.log(`Data stored for key ${key}:`, value);
    } catch (error) {
      console.error(`Error setting data for key ${key}`, error);
    }
  }

  public async get(key: string): Promise<any> {
    try {
      const data = await this._storage?.get(key);
      console.log(`Data retrieved for key ${key}:`, data);
      return data;
    } catch (error) {
      console.error(`Error getting data for key ${key}`, error);
      return null;
    }
  }
}
