import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatInputModule, MatIconModule } from '@angular/material';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, } from 'angular-6-social-login';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MapViewComponent } from './workspace/map-view/map-view.component';
import { SideBarComponent } from './workspace/side-bar/side-bar.component';
import { NavbarComponent } from './workspace/navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { AuthInterceptor } from './core/auth.interceptor';
import { RegisterComponent } from './register/register.component';
import { RegisterService } from './services/register.service';
import { ProfileComponent } from './workspace/profile/profile.component';
import { UserService } from './services/user.service';

export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('1231662930306169')
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('930181284279-co6dre10poiv5unha2e6elt5p2tvafsl')
      }
    ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    MapViewComponent,
    SideBarComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    WorkspaceComponent,
    RegisterComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD57xBPFgBEZuMhcLUBA3qNpsLfHWicy6U'
    }),
    AngularMultiSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    SocialLoginModule
  ],
  providers: [
    DataService,
    AuthService,
    RegisterService,
    UserService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
