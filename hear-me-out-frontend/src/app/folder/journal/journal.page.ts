import { Component, OnInit } from '@angular/core';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FolderModalComponent } from './foldermodalcomponent';
import { StorageService } from 'src/app/services/storage.service';
import { FileModalComponent } from './filemodalcomponent';
import { Folder } from './interface';
import { AudioFile } from './interface';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
  recording = false;
  startTime: number | null = null;
  durationInterval: any;
  folders: Folder[] = [];
  files: AudioFile[] = [];  // Array to store file information


  constructor(private router: Router, private modalCtrl: ModalController, private storageService: StorageService, private cdr: ChangeDetectorRef,
  ) { 
    this.storageService.filesChanged.subscribe(() => {
      this.loadFiles();
      this.cdr.detectChanges();
    });
  }

  async ngOnInit() {
    await this.loadFolders();
    VoiceRecorder.requestAudioRecordingPermission();
    await this.loadFiles(); // Load files initially

  }

  async loadFiles() {
    this.files = await this.storageService.getAllFiles(); // Assuming this fetches all files across folders
  }


  async createNewFolder() {
    const modal = await this.modalCtrl.create({
      component: FolderModalComponent,
    });
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
  
    if (data?.folderName) {
      this.folders.push({ name: data.folderName });
      await this.storageService.set('folders', this.folders);
      console.log('Folders after adding new one:', this.folders);
    }
  }
  

  async loadFolders() {
    const savedFolders = await this.storageService.get('folders');
    if (savedFolders) {
      this.folders = savedFolders;
    }
  }

  async clearStorage() {
    await this.storageService.clearAllData(); // Clear the storage
    this.files = []; // Clear the files array to update the UI
    this.folders = []; // Optionally clear the folders if they are also managed
    this.cdr.detectChanges(); // Manually trigger change detection to update the view
  }
  

  startRecording() {
    if (this.recording) return;

    this.recording = true;
    this.startTime = Date.now();
    this.durationInterval = setInterval(() => this.calculateDuration(), 1000);
    VoiceRecorder.startRecording();
  }

  stopRecording() {
    if (!this.recording) return;

    clearInterval(this.durationInterval);
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
        if (result.value && result.value.recordDataBase64) {
            console.log('Audio data exists:', !!result.value.recordDataBase64.length);
            const recordData = result.value.recordDataBase64;

            // Open the file modal to get file name and folder
            const modal = await this.modalCtrl.create({
                component: FileModalComponent,
                componentProps: { folders: this.folders }
            });

            await modal.present();

            const { data } = await modal.onWillDismiss();

            if (data?.fileName && data?.folderName) {
                const fileName = data.fileName; // Use the file name from the modal
                const duration = this.calculateDuration(true);

                // Write the file using the fileName from the modal
                await Filesystem.writeFile({
                    path: `${data.folderName}/${fileName}`, // Ensure path includes folder
                    data: recordData,
                    directory: Directory.Data
                });

                console.log(`File written to: ${data.folderName}/${fileName}`);

                // Add file to the folder after recording
                this.addFilesToFolder(fileName, duration, data.folderName);

                // Reset recording state
                this.recording = false;
                this.startTime = null;
            }
        }
    });
}

addFilesToFolder(fileName: string, duration: string, folderName: string) {
  const fileData: AudioFile = {
    name: fileName,
    duration: duration,
    date: new Date().toLocaleDateString(),  // Assuming current date for simplicity
    time: new Date().toLocaleTimeString(),  // Assuming current time for simplicity
    folder: folderName,
  };

  this.storageService.setFileInFolder(folderName, fileData);
  this.files.push(fileData);  // Add to local array for display
  console.log(`File added to folder ${folderName}:`, fileData);
}


async getFullPath(fileName: string): Promise<string> {
    const uri = await Filesystem.getUri({
        directory: Directory.Data,
        path: fileName
    });
    return uri.uri; // This will return the full URI where the file is stored
}


  calculateDuration(finalize = false): string {
    if (!this.startTime) return '0:00';

    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    const durationDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    if (finalize) {
      clearInterval(this.durationInterval);
      return durationDisplay;
    } else {
      return durationDisplay;
    }
  }

  navigateToVF(title: string) {
    this.router.navigate(['/folder/voice-folder'], { state: { title } }).catch(err => {
      console.error('Navigation Error:', err);
    });
  }

  navigateToWrittenJournal(file: any) {
    this.router.navigate(['/folder/written-journal'], { state: { file: file } });
  }
  

}

