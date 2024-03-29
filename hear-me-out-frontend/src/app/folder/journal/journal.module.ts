import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JournalPageRoutingModule } from './journal-routing.module';

import { JournalPage } from './journal.page';
import { FolderModalComponent } from './foldermodalcomponent';
import { FileModalComponent } from './filemodalcomponent'; // Adjust the path as needed
import { AudioFile, Folder } from './interface'; // Adjust the path as needed

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JournalPageRoutingModule
  ],
  declarations: [JournalPage, FolderModalComponent, FileModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line to suppress the warning

})
export class JournalPageModule {}
