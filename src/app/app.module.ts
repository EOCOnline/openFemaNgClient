import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http' //https://angular.io/guide/http#setup-for-server-communication

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component';
import { DatasetGridComponent } from './components';
import { AgGridModule } from 'ag-grid-angular'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FooterComponent } from './components'

@NgModule({
  declarations: [
    AppComponent,
    DatasetGridComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    AgGridModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
