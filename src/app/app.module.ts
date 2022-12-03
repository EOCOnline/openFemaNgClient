import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http' //https://angular.io/guide/http#setup-for-server-communication
import { NgxPaginationModule } from 'ngx-pagination'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component';

import { DetailViewComponent, GridViewComponent, ListItemComponent, FooterComponent, CardViewComponent, NavbarComponent, ListViewComponent, CardComponent, MapViewComponent } from './components';
import { AgGridModule } from 'ag-grid-angular';
//import { GoogleMap, MapMarker, MapInfoWindow } from '@angular/google-maps';
import { GoogleMapsModule } from '@angular/google-maps'
/**
 * https://timdeschryver.dev/blog/google-maps-as-an-angular-component:
 * The GoogleMapsModule exports three components that we can use:
 * GoogleMap: this is the wrapper around Google Maps, available via the google-map selector
 * MapMarker: used to add markers on the map, available via the map-marker selector
 * MapInfoWindow: the info window of a marker, available via the map-info-window selector
 */

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
    MapViewComponent,
    //MapViewComponent,
    // GoogleMap,
    // MapMarker,
    // GoogleMaps,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    AgGridModule,
    GoogleMapsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
