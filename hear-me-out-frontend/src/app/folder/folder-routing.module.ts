import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';

const routes: Routes = [
  {
    path: '',
    component: FolderPage
  },
  {
    path: 'voice-journal',
    loadChildren: () => import('./journal/journal.module').then( m => m.JournalPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'create-account',
    loadChildren: () => import('./create-account/create-account.module').then( m => m.CreateAccountPageModule)
  },
  {
    path: 'voice-folder',
    loadChildren: () => import('./voice-folder/voice-folder.module').then( m => m.VoiceFolderPageModule)
  },
  {
    path: 'written-journal',
    loadChildren: () => import('./written-journal/written-journal.module').then( m => m.WrittenJournalPageModule)
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
