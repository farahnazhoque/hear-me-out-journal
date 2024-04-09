import { Component, OnInit } from '@angular/core';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FolderModalComponent } from './foldermodalcomponent';
import { StorageService } from 'src/app/services/storage.service';
import { FileModalComponent } from './filemodalcomponent';
import { Folder } from './interface';

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

  constructor(private router: Router, private modalCtrl: ModalController, private storageService: StorageService) { }

  async ngOnInit() {
    await this.loadFolders();
    VoiceRecorder.requestAudioRecordingPermission();
  }

  async addFilesToFolder(fileName: string, duration: string) {
    const modal = await this.modalCtrl.create({
      component: FileModalComponent,
      componentProps: {
        folders: this.folders
      }
    });
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
  
    if (data?.fileName && data?.folderName) {
      const fileData = {
        name: data.fileName,
        duration: duration,
        folder: data.folderName,
      };
  
      await this.storageService.setFileInFolder(data.folderName, fileData);
      console.log(`File added to folder ${data.folderName}:`, fileData);
    }
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
        console.log('Audio data exists:', !!result.value.recordDataBase64.length); // Should log true if data is present
        const recordData = result.value.recordDataBase64;
        const fileName = `${new Date().getTime()}.mp3`;
        const duration = this.calculateDuration(true);

        await Filesystem.writeFile({
          path: fileName,
          data: recordData,
          directory: Directory.Data
        });

        this.addFilesToFolder(fileName, duration);

        this.recording = false;
        this.startTime = null;
      }
    });
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

}
