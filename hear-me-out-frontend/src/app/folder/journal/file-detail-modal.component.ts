import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { StorageService } from "src/app/services/storage.service";

@Component({
  selector: 'app-file-detail-modal',
  templateUrl: './file-detail-modal.component.html',
  styleUrls: ['./file-detail-modal.component.scss'],
})
export class FileDetailModalComponent implements OnInit {
    newFileName = '';
    folders: string[] = [];
    selectedFolder = '';

    constructor(
      private modalController: ModalController,
      private storageService: StorageService
    ) {}

    ngOnInit() {
      this.loadFolders();
    }

    async loadFolders() {
      const storedFolders = await this.storageService.getFolders();
      this.folders = Object.keys(storedFolders);
    }

    selectFolder(folder: string) {
      this.selectedFolder = folder;
    }

    async addNewFolder() {
      // Logic to add a new folder (use a prompt or another modal for folder name input)
      const folderName = prompt("Enter folder name:");
      if (folderName) {
        await this.storageService.addFolder(folderName);
        this.folders.push(folderName);
        this.selectedFolder = folderName;
      }
    }

    async saveFile() {
      // Emit an event or use a callback to pass the newFileName and selectedFolder back to JournalPage
      this.modalController.dismiss({
        newFileName: this.newFileName,
        selectedFolder: this.selectedFolder
      });
    }
}
