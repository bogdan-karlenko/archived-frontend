import { ProfileComponent } from './workspace/profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './main-layout/main-layout.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MapViewComponent } from './workspace/map-view/map-view.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'workspace',
        component: WorkspaceComponent,
        children: [
          { path: '', redirectTo: 'find', pathMatch: 'full'},
          {
            path: 'find',
            component: MapViewComponent
          },
          {
            path: 'profile',
            component: ProfileComponent
          }
        ]
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'register/:code',
        component: RegisterComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
