import { Routes } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { ForgetPasswordComponent } from './features/forget-password/forget-password.component';
import { ChangePasswordComponent } from './features/change-password/change-password.component';

import { TimelineComponent } from './features/timeline/timeline.component';
import { NotificationComponent } from './features/notification/notification.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { ProfileComponent } from './features/profile/profile.component';

import { authGuard } from './core/auth/guard/auth-guard';
import { guestGuard } from './core/auth/guard/guest-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/register',
    pathMatch: 'full',
  },

  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forget', component: ForgetPasswordComponent },
    ],
  },

  {
    path: 'main',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'timeline', component: TimelineComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'change-password', component: ChangePasswordComponent },
    ],
  },

  { path: 'notfound', component: NotfoundComponent },

  {
    path: '**',
    redirectTo: 'auth/register',
    pathMatch: 'full',
  },
];
