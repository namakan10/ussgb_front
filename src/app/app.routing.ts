import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { HomeComponent } from './pages/A_Pages_Utilisateurs/home/home.component';
import { AuthGuardService } from './services/auth-guard.service';

export const AppRoutes: Routes = [
  { path: '', redirectTo: '/pages/utilisateur/home', pathMatch: 'full' },
  { path: 'admin', redirectTo: '/admin/home', pathMatch: 'full' },
{
    path: '',
    component: FullComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: '/dashboard',
      //   pathMatch: 'full'
      // },
      {
        path: '',
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: 'admin/home',
        component: HomeComponent
      } ,
    ]
  },
  {
    path: 'pages',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  { path: '**', redirectTo: 'pages' },
];
