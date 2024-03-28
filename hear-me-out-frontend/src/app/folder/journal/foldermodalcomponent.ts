import { Component, ViewChild } from '@angular/core';
import { ModalController, IonInput } from '@ionic/angular';

@Component({
  selector: 'app-folder-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Create New Folder</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cancel</ion-button>
          <ion-button (click)="confirm()">Confirm</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input #folderNameInput placeholder="Enter folder name"></ion-input>
      </ion-item>
    </ion-content>
  `
})
export class FolderModalComponent {
  @ViewChild('folderNameInput', { static: false }) folderNameInput!: IonInput;

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    this.folderNameInput.getInputElement().then((inputElement: HTMLInputElement) => {
      const folderName = inputElement.value;
      console.log('Confirming with folder name:', folderName); // Debug the folder name being passed
      this.modalCtrl.dismiss({ folderName });
    });
  }
  
}
