import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';  // https://angular.io/guide/http
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service } from 'src/app/services';
import { BrowserModule } from '@angular/platform-browser';
import { DataSetCardComponent } from '../.';

@Component({
  selector: 'app-data-set-viewer',
  standalone: true,  // https://angular.io/guide/standalone-components
  imports: [CommonModule,
    DataSetCardComponent,
    // BrowserModule,
    // import HttpClientModule after BrowserModule.
    // HttpClientModule
  ],
  templateUrl: './data-set-viewer.component.html',
  styleUrls: ['./data-set-viewer.component.scss']
})
export class DataSetViewerComponent implements OnInit {

  private declarationsSummariesSubscription!: Subscription
  private disasterDeclarationsSummary!: DisasterDeclarationsSummary


  constructor(
    //private httpClient: HttpClient,
    private disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service,
    ) {
      console.log (`DataSetViewerComponent: Getting declarationsSummariesSubscription`)
     // debugger

      this.declarationsSummariesSubscription = disasterDeclarationsSummariesV2Service.getDisasterDeclarationsSummariesV2ServiceObserver().subscribe({
        next: (newDisasterDeclarationsSummary) => {
          this.disasterDeclarationsSummary = newDisasterDeclarationsSummary
          console.log(`Received new disasterDeclarationsSummary via subscription. ${JSON.stringify(newDisasterDeclarationsSummary)}`)
          //debugger
        },
        error: (e) => console.error('declarationsSummariesSubscription got:' + e),
        complete: () => console.info('declarationsSummariesSubscription complete')
      })

      console.log (`DataSetViewerComponent: Got declarationsSummariesSubscription, awaiting results`)
     }

  ngOnInit(): void {
    // fetch data async after constructior when async pipe subscribes to the disasters$ observable
    debugger
    console.log (`DataSetViewerComponent: Got observable: ${this.disasterDeclarationsSummary}   ${JSON.stringify(this.disasterDeclarationsSummary)}`)
  }

}
