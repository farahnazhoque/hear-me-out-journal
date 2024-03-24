import { Component, OnInit } from '@angular/core';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { Filesystem, Directory } from '@capacitor/filesystem';

interface AudioFile {
  name: string;
  duration: string;
  audioRef?: HTMLAudioElement; 
}

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
  recording = false;
  storedFiles: AudioFile[] = [];
  startTime: number | null = null;
  durationInterval: any;
  audioRef?: HTMLAudioElement; 

  constructor() { }

  ngOnInit() {
    this.loadFiles();
    VoiceRecorder.requestAudioRecordingPermission();
  }

  async loadFiles() {
    // Additional logic to read duration from file's metadata if available
    const files = await Filesystem.readdir({
      path: '',
      directory: Directory.Data
    });
    console.log(files);
    this.storedFiles = files.files.map(file => ({
      name: file.name,
      duration: '' // Initialize with empty duration
      
      // TODO: Read file duration from metadata if available
    }));
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
        const recordData = result.value.recordDataBase64;
        const fileName = new Date().getTime() + '.mp3';
        const duration = this.calculateDuration(true); // Final duration calculation

        await Filesystem.writeFile({
          path: fileName,
          data: recordData,
          directory: Directory.Data
        });

        this.storedFiles.push({
          name: fileName,
          duration: duration // Save duration next to the file name
        });

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
      // Update the duration display on UI
      // TODO: Update a UI element with durationDisplay
      return durationDisplay;
    }
  }

  async playFile(file: AudioFile) {
    if (!file.audioRef) {
      const audioData = await Filesystem.readFile({ 
        path: file.name, 
        directory: Directory.Data 
      });
      file.audioRef = new Audio('data:audio/mp3;base64,' + audioData.data);
      file.audioRef.load();

      // Update the duration as the audio plays
      file.audioRef.ontimeupdate = () => {
        file.duration = this.formatDuration(file.audioRef!.currentTime);
      };
    }
  
    file.audioRef.play();
  }

  pauseFile(file: AudioFile) {
    file.audioRef?.pause();
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  async deleteFile(file: AudioFile) {
    await Filesystem.deleteFile({ 
      path: file.name, 
      directory: Directory.Data 
    });
    this.storedFiles = this.storedFiles.filter(f => f.name !== file.name);
  }

}
