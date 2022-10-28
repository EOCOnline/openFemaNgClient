/*import { Component } from '@angular/core';
import {DataSetViewerComponent} from './Components'
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  //templateUrl: './app.component.html',
  templateUrl: './Components/data-set-viewer/data-set-viewer.component.html',
 // standalone: true,
  styleUrls: ['./app.component.scss'],
  //imports:[DataSetViewerComponent],
})
export class AppComponent {
  title = 'openFemaNgClient';
}
*/

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';  // https://angular.io/guide/http
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { DisasterDeclarationsSummaryType } from 'src/app/services';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-data-set-viewer',
  standalone: true,  // https://angular.io/guide/standalone-components
  imports: [CommonModule,
    // BrowserModule,
    // import HttpClientModule after BrowserModule.
    // HttpClientModule
  ],
  templateUrl: './components/data-set-viewer/data-set-viewer.component.html',
  styleUrls: ['./components/data-set-viewer/data-set-viewer.component.scss']
})
export class DataSetViewerComponent implements OnInit {

  disasters$: Observable<DisasterDeclarationsSummaryType[]>
 api = "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries"

  constructor(
    private httpClient: HttpClient
    ) {
      this.disasters$ = this.httpClient.get<DisasterDeclarationsSummaryType[]>(`${this.api}$filter=state eq 'WA'`)
     }

  ngOnInit(): void {
    // fetch data async after constructior when async pipe subscribes to the disasters$ observable
  }

}
