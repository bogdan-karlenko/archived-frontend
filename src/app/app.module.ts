import { DataService } from './services/data.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MapViewComponent } from './workspace/map-view/map-view.component';
import { SideBarComponent } from './workspace/side-bar/side-bar.component';
import { NavbarComponent } from './workspace/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    MapViewComponent,
    SideBarComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyD57xBPFgBEZuMhcLUBA3qNpsLfHWicy6U'
    }),
    AngularMultiSelectModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
