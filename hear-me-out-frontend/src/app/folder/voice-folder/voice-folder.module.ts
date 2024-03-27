import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoiceFolderPageRoutingModule } from './voice-folder-routing.module';

import { VoiceFolderPage } from './voice-folder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoiceFolderPageRoutingModule
  ],
  declarations: [VoiceFolderPage]
})
export class VoiceFolderPageModule {}
