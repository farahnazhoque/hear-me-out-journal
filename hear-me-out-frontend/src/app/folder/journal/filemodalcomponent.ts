import { Component, ViewChild } from '@angular/core';
import { ModalController, IonInput, IonSelect } from '@ionic/angular';
import { Folder } from './interface'; // Adjust the path as needed

@Component({
  selector: 'app-file-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Create New File</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cancel</ion-button>
          <ion-button (click)="confirm()">Confirm</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label>Folder</ion-label>
        <ion-select #folderSelect placeholder="Select Folder">
          <ion-select-option *ngFor="let folder of folders" [value]="folder.name">{{folder.name}}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-input #fileNameInput placeholder="Enter file name"></ion-input>
      </ion-item>
    </ion-content>
  `
})
export class FileModalComponent {
  @ViewChild('fileNameInput', { static: false }) fileNameInput!: IonInput;
  @ViewChild('folderSelect', { static: false }) folderSelect!: IonSelect;
  folders: Folder[] = [];

constructor(private modalCtrl: ModalController) {}

dismiss() {
    this.modalCtrl.dismiss();
}

confirm() {
    this.fileNameInput.getInputElement().then((inputElement: HTMLInputElement) => {
        const fileName = inputElement.value;
        const folderName = this.folderSelect.value;
        this.modalCtrl.dismiss({ fileName, folderName });
    });
}
}