import { Routes } from '@angular/router';
import { SignInComponent } from './modules/auth/sign-in/sign-in.component';
import { SignUpComponent } from './modules/auth/sign-up/sign-up.component';
import { LayoutComponent } from './layout/layout.component';
import { TaskComponent } from './modules/admin/app/task/task.component';
import { layout } from './layout/layout.types';
import { noauthGuard } from './core/auth/guards/noauth.guard';
import { authGuard } from './core/auth/guards/auth.guard';
import { SignOutComponent } from './modules/auth/sign-out/sign-out.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard/task',
  },
  {
    path: 'signed-in-redirect',
    pathMatch: 'full',
    redirectTo: 'dashboard/task',
  },

  {
    path: '',
    canMatch: [noauthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
    ],
  },

  {
    path: '',
    canMatch: [authGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'sign-out',
        component: SignOutComponent,
      },
    ],
  },

  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'empty' as layout,
    },
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: 'task',
            component: TaskComponent,
          },
        ],
      },
    ],
  },
];
