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
  
  
  async playFile(file: AudioFile) {
    try {
      // Check if the file exists
      await Filesystem.stat({
        path: file.name,
        directory: Directory.Data
      });
  
      // Prepare the audio file for playback
      if (!file.audioRef) {
        const audioData = await Filesystem.readFile({ 
          path: file.name, 
          directory: Directory.Data 
        });
        file.audioRef = new Audio('data:audio/mp3;base64,' + audioData.data);
        
        // Event listeners for debugging
        file.audioRef.addEventListener('canplay', () => {
          console.log(`Audio ${file.name} is ready to play.`);
        });
        file.audioRef.addEventListener('error', (e) => {
          console.error(`Error with audio ${file.name}:`, e);
        });
  
        file.audioRef.load();
      }
  
      // Reset playback time to 0 and play
      file.audioRef.currentTime = 0;
      file.audioRef.play();
    } catch (error) {
      console.error('Error accessing or playing the audio file:', file.name, error);
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
  
  
