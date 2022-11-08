import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http' //https://angular.io/guide/http#setup-for-server-communication
import { NgxPaginationModule } from 'ngx-pagination'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component';

import { DatasetGridComponent, DatasetCardComponent, FooterComponent, CardViewerComponent, NavbarComponent, DatasetViewerComponent, CardComponent, MapComponent } from './components';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DatasetGridComponent,
    DatasetViewerComponent,
    CardViewerComponent,
    CardComponent,
    DatasetCardComponent,
    FooterComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    AgGridModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
