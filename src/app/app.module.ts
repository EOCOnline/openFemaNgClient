import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http' //https://angular.io/guide/http#setup-for-server-communication
import { NgxPaginationModule } from 'ngx-pagination'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component';

import { GridComponent, ListItemComponent, FooterComponent, CardViewerComponent, NavbarComponent, ListComponent, CardComponent, MapComponent } from './components';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    GridComponent,
    ListComponent,
    CardViewerComponent,
    CardComponent,
    ListItemComponent,
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
