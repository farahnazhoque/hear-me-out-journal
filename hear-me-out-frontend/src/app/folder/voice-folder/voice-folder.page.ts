import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { AudioFile } from '../journal/interface'; // Adjust the path as needed
import { Directory, Filesystem } from '@capacitor/filesystem';

interface VoiceFolderState {
  title: string;
}

@Component({
  selector: 'app-voice-folder',
  templateUrl: './voice-folder.page.html',
  styleUrls: ['./voice-folder.page.scss'],
})
export class VoiceFolderPage implements OnInit {
  title: string = 'Default Title';
  files: AudioFile[] = [];
  

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as VoiceFolderState;
    this.title = state?.title;
    await this.loadFiles();
    await this.logDirectoryUri(); // Call the method to log the directory URI

  }

  async loadFiles() {
    this.files = await this.storageService.getFilesInFolder(this.title);
    console.log(`Files loaded for folder ${this.title}:`, this.files);
  }

  async clearAllFiles() {
    try {
      for (const file of this.files) {
        const filePath = `${this.title}/${file.name}`; // Consistent file path
  
        const fileStat = await Filesystem.stat({
          path: filePath,
          directory: Directory.Data
        }).catch(e => null);
  
        if (fileStat) {
          await Filesystem.deleteFile({
            path: filePath,
            directory: Directory.Data
          });
        } else {
          console.log(`File does not exist and cannot be deleted: ${filePath}`);
        }
      }
  
      if (this.files.length) {
        this.files = [];
        await this.storageService.clearFolder(this.title);
      }
  
      console.log(`All files in folder ${this.title} have been cleared or verified as non-existent.`);
    } catch (error) {
      console.error('Error clearing all files:', error);
    }
  }
  

  async logDirectoryUri() {
    try {
      const uri = await Filesystem.getUri({
        directory: Directory.Data,
        path: '' // Empty path to get the directory's URI
      });
      console.log('Directory URI:', uri.uri);
    } catch (error) {
      console.error('Error getting directory URI:', error);
    }
  }

  async logFilePaths() {
    try {
      const result = await Filesystem.readdir({
        directory: Directory.Data,
        path: this.title // Use the folder name as the path
      });
      console.log(`Files in Directory.Data/${this.title}:`, result.files);
  
      for (const fileName of result.files) {
        const filePath = `${this.title}/${fileName}`;
        const fileUri = await Filesystem.getUri({
          directory: Directory.Data,
          path: filePath
        });
        console.log(`File Path: ${filePath}, URI: ${fileUri.uri}`);
      }
    } catch (error) {
      console.error('Error listing files and their URIs:', error);
    }
  }
  
  
  
  async playFile(fileToPlay: AudioFile) {
    try {
      const file = this.files.find(f => f.name === fileToPlay.name);
  
      if (!file) {
        console.log(`File not found in the list: ${fileToPlay.name}`);
        return;
      }
  
      const filePath = `${this.title}/${file.name}`;
      console.log(`Attempting to play file: ${filePath}`);
  
      const fileStat = await Filesystem.stat({
        path: filePath,
        directory: Directory.Data
      }).catch(e => null);
  
      if (fileStat) {
        console.log(`Playing file: ${filePath}`);
        const audioData = await Filesystem.readFile({
          path: filePath,
          directory: Directory.Data
        });
  
        if (!file.audioRef) {
          file.audioRef = new Audio(); // Ensure audioRef is initialized
        }
        
        file.audioRef.src = 'data:audio/mp3;base64,' + audioData.data;
        file.audioRef.load(); // Preload the audio data
        
        file.audioRef.addEventListener('canplay', async () => {
          try {
            await file.audioRef?.play(); // Safe call using optional chaining
            console.log(`Audio ${filePath} is ready to play.`);
          } catch (error) {
            console.error(`Error during auto-play`);
          }
        });
  
        file.audioRef.addEventListener('error', e => {
          console.error(`Error with audio ${filePath}:`, e);
        });
  
      } else {
        console.log(`File does not exist and cannot be played: ${filePath}`);
      }
    } catch (error) {
      console.error('Error playing file:', error);
    }
  }
  
  
  async listFiles() {
    try {
      const result = await Filesystem.readdir({
        directory: Directory.Data,
        path: ''
      });
      console.log('Files in Directory.Data:', result.files);
    } catch (error) {
      console.error('Error listing files:', error);
    }
  }
  
  
  async deleteFile(fileToDelete: AudioFile) {
    try {
      const filePath = `${this.title}/${fileToDelete.name}`; // Consistent file path
      const fileStat = await Filesystem.stat({
        path: filePath,
        directory: Directory.Data
      }).catch(e => null);
  
      if (fileStat) {
        await Filesystem.deleteFile({
          path: filePath,
          directory: Directory.Data
        });
        this.files = this.files.filter(file => file.name !== fileToDelete.name);
        await this.storageService.removeFileFromFolder(this.title, fileToDelete);
        console.log(`File deleted: ${filePath}`);
      } else {
        console.log(`File does not exist and cannot be deleted: ${filePath}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
  
  
  pauseFile(fileToPause: AudioFile) {
    const filePath = `${this.title}/${fileToPause.name}`; // Consistent file path
    const file = this.files.find(f => f.name === fileToPause.name);
  
    if (!file || !file.audioRef) {
      console.error(`File not found or no audio loaded for: ${filePath}`);
      return;
    }
  
    if (!file.audioRef.paused) {
      file.audioRef.pause();
      console.log(`Audio paused for file: ${filePath}`);
    } else {
      console.log(`Audio already paused for file: ${filePath}`);
    }
  }
  


  
  backToJournal() {

      this.router.navigateByUrl('/folder/journal');
    }
  }
  
  
