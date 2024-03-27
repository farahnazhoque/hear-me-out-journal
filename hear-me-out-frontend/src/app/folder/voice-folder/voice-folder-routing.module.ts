import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoiceFolderPage } from './voice-folder.page';

const routes: Routes = [
  {
    path: '',
    component: VoiceFolderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoiceFolderPageRoutingModule {}
