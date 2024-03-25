import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/folder.module.ts',
    pathMatch: 'full'},
    {
      path: 'folder/create-account',
      loadChildren: () => import('./folder/create-account/create-account.module').then(m => m.CreateAccountPageModule)
    },
  {
    path: 'folder/journal',
    loadChildren: () => import('./folder/journal/journal.module').then(m => m.JournalPageModule)
  },
  {
    path: 'folder/home',
    loadChildren: () => import('./folder/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
