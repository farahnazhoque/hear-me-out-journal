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
  
  // Add methods to play, pause, and delete files as needed
  async playFile(file: AudioFile) {
    if (!file.audioRef) {
      const audioData = await Filesystem.readFile({ 
        path: file.name, 
        directory: Directory.Data 
      });
      file.audioRef = new Audio('data:audio/mp3;base64,' + audioData.data);
      file.audioRef.load();
    }
  
    file.audioRef.play();
  }

  pauseFile(file: AudioFile) {
    file.audioRef?.pause();
  }

  
  async deleteFile(file: AudioFile) {
    await Filesystem.deleteFile({ 
      path: file.name, 
      directory: Directory.Data 
    });
    this.files = this.files.filter(f => f.name !== file.name);
    // Clear the folder and then add each remaining file back
    await this.storageService.clearFolder(this.title);
    for (const remainingFile of this.files) {
      await this.storageService.setFileInFolder(this.title, remainingFile);
    }
  }
  
  
  backToJournal() {

      this.router.navigateByUrl('/folder/journal');
    }
  }
  
  
