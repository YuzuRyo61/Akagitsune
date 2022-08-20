import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [],
  },
  {
    path: 'add',
    loadChildren: () => import('./pages/add/add.module').then(m => m.AddModule),
  },
  {
    path: 'accounts',
    loadChildren: () => import('./pages/accounts/accounts.module').then(m => m.AccountsModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
