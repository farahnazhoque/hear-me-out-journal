import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WrittenJournalPage } from './written-journal.page';

const routes: Routes = [
  {
    path: '',
    component: WrittenJournalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WrittenJournalPageRoutingModule {}
