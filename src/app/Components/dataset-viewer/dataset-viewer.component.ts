import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';  // https://angular.io/guide/http
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service } from 'src/app/services';
import { BrowserModule } from '@angular/platform-browser';
import { DatasetCardComponent } from '..';

@Component({
  selector: 'app-dataset-viewer',
  standalone: true,  // https://angular.io/guide/standalone-components
  imports: [
    CommonModule,
    DatasetCardComponent,
  ],
  templateUrl: './dataset-viewer.component.html',
  styleUrls: ['./dataset-viewer.component.scss']
})
export class DatasetViewerComponent implements OnInit {

  private declarationsSummariesSubscription!: Subscription
  private disasterDeclarationsSummary!: DisasterDeclarationsSummary


  constructor(
    //private httpClient: HttpClient,
    private disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service,
    ) {

      // Following works: based on reading an actual JSON file
      /*
      let myTest = disasterDeclarationsSummariesV2Service.test()
        console.error (`DatasetViewerComponent: ${JSON.stringify(myTest.DisasterDeclarationsSummaries[0])}`)
      */

      console.log (`DatasetViewerComponent: Getting declarationsSummariesSubscription`)

      this.declarationsSummariesSubscription = disasterDeclarationsSummariesV2Service.getDisasterDeclarationsSummariesV2ServiceObserver().subscribe({
        next: (newDisasterDeclarationsSummary) => {
          this.disasterDeclarationsSummary = newDisasterDeclarationsSummary
          console.log(`Received new disasterDeclarationsSummary via subscription. ${JSON.stringify(newDisasterDeclarationsSummary)}`)
          //debugger
        },
        error: (e) => console.error('declarationsSummariesSubscription got:' + e),
        complete: () => console.info('declarationsSummariesSubscription complete')
      })

      console.log (`DatasetViewerComponent: Got declarationsSummariesSubscription, awaiting results`)
     }

  ngOnInit(): void {
    // fetch data async after constructior when async pipe subscribes to the disasters$ observable
   // debugger
    console.log (`DatasetViewerComponent: Got observable: ${this.disasterDeclarationsSummary}   ${JSON.stringify(this.disasterDeclarationsSummary)}`)
  }

}
