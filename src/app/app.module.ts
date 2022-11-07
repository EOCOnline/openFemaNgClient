import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http' //https://angular.io/guide/http#setup-for-server-communication
import { NgxPaginationModule } from 'ngx-pagination'
import { FormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout'

import { DatasetGridComponent, DatasetCardComponent, FooterComponent, SimpleViewerComponent, NavbarComponent } from './components';
// SimpleCardComponent
// DatasetViewerComponent
import { AgGridModule } from 'ag-grid-angular'


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DatasetGridComponent,
    // DatasetViewerComponent,
    SimpleViewerComponent,
    // SimpleCardComponent,
    DatasetCardComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    AgGridModule, //.withComponents([]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
