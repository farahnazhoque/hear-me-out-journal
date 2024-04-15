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
      // Loop through all files
      for (const file of this.files) {
        // Check if the file exists before deleting
        const fileStat = await Filesystem.stat({
          path: file.name,
          directory: Directory.Data
        }).catch(e => null); // Catch and return null if an error occurs
  
        // Only attempt to delete the file if it exists
        if (fileStat) {
          await Filesystem.deleteFile({
            path: file.name,
            directory: Directory.Data
          });
        } else {
          console.log(`File does not exist and cannot be deleted: ${file.name}`);
        }
      }
    
      // Clear the files array and update the storage if any deletions occurred
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
      console.log(`Attempting to play file: ${filePath}`); // Log the full file path
  
      const fileStat = await Filesystem.stat({
        path: filePath,
        directory: Directory.Data
      }).catch(e => null);
  
      // Only attempt to read the file if it exists
      if (fileStat) {
        console.log(`Playing file: ${filePath}`);
        // Prepare the audio file for playback
        Filesystem.readFile({
          path: filePath,
          directory: Directory.Data
        }).then(audioData => {
          file.audioRef = new Audio('data:audio/mp3;base64,' + audioData.data);
  
          file.audioRef.addEventListener('canplay', () => {
            console.log(`Audio ${filePath} is ready to play.`);
            if (file.audioRef) {
              file.audioRef.currentTime = 0;
              file.audioRef.play();
            }
          });
  
          file.audioRef.addEventListener('error', (e) => {
            console.error(`Error with audio ${filePath}:`, e);
          });
  
          file.audioRef.load();
        })
        .catch(error => {
          console.error('Error accessing or playing the audio file:', filePath, error);
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
      // Find the actual file in the files array that matches the name of the file to delete
      const file = this.files.find(f => f.name === fileToDelete.name);
  
      if (!file) {
        console.log(`File not found in the list: ${fileToDelete.name}`);
        return; // If the file isn't found in the array, exit the function
      }
  
      // Proceed with the deletion from the filesystem
      console.log(`Deleting file: ${file.name}`);
      Filesystem.deleteFile({
        path: file.name,
        directory: Directory.Data
      })
      .then(deleteResult => {
        console.log('Delete result:', deleteResult);
        this.files = this.files.filter(file => file.name !== fileToDelete.name);
        this.storageService.removeFileFromFolder(this.title, fileToDelete);
        console.log(`File deleted: ${fileToDelete.name}`);
      })
      .catch(error => {
        console.error('Error deleting file:', error);
      });
      
      // Remove the file from the UI list
      this.files = this.files.filter(f => f.name !== file.name);
  
      // Update the storage to reflect the deletion
      await this.storageService.removeFileFromFolder(this.title, file);
  
      console.log(`File deleted: ${file.name}`);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
  
  
  pauseFile(file: AudioFile) {
    file.audioRef?.pause();
  }


  
  backToJournal() {

      this.router.navigateByUrl('/folder/journal');
    }
  }
  
  
