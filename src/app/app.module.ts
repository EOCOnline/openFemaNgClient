import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http' //https://angular.io/guide/http#setup-for-server-communication
import { NgxPaginationModule } from 'ngx-pagination'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component';

import { DetailViewComponent, GridViewComponent, ListItemComponent, FooterComponent, CardViewComponent, NavbarComponent, ListViewComponent, CardComponent, MapComponent, MapViewComponent } from './components';
import { AgGridModule } from 'ag-grid-angular';
//import { GoogleMap } from '@angular/google-maps';
import { GoogleMapsModule } from '@angular/google-maps'

@NgModule({
  declarations: [
    AppComponent,
    DetailViewComponent,
    NavbarComponent,
    GridViewComponent,
    ListViewComponent,
    CardViewComponent,
    CardComponent,
    ListItemComponent,
    FooterComponent,
    MapComponent,
    MapViewComponent,
    GoogleMapsModule,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    AgGridModule,
    //GoogleMap,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
