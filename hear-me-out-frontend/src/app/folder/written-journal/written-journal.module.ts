import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WrittenJournalPageRoutingModule } from './written-journal-routing.module';

import { WrittenJournalPage } from './written-journal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WrittenJournalPageRoutingModule
  ],
  declarations: [WrittenJournalPage]
})
export class WrittenJournalPageModule {}
