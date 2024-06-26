// In journal.page.ts
export interface AudioFile {
    name: string;
    duration: string;
    folder?: string;  // Assuming you've added 'folder' to the interface
    audioRef?: HTMLAudioElement;
    file?: File;
    date: string;
    time: string;
  }
  
  
  export interface Folder {
    name: string;
  }
  