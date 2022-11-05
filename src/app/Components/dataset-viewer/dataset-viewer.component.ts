import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';  // https://angular.io/guide/http
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service } from 'src/app/services'
import { BrowserModule } from '@angular/platform-browser';
import { DatasetCardComponent } from '../';
import {NgxPaginationModule} from 'ngx-pagination'

// inspired by:
// https://github.com/angular/examples/tree/main/walk-my-dog
// An example explained in a video at https://angular.io/guide/standalone-components
/*
standalone: true,  // https://angular.io/guide/standalone-components
  imports: [
    CommonModule,
    DatasetCardComponent,
    // NgxPaginationModule,
  ],
  */
@Component({
  selector: 'app-dataset-viewer',
  templateUrl: './dataset-viewer.component.html',
  styleUrls: ['./dataset-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // https://michaelbromley.github.io/ngx-pagination/#/basic
})
export class DatasetViewerComponent implements OnInit, OnDestroy {
  // https://michaelbromley.github.io/ngx-pagination
  @Input('data') disasterDeclarationsSummaries: DisasterDeclarationsSummaryType[] = [];
  page = 1;

  private declarationsSummariesSubscription!: Subscription
  private disasterDeclarationsSummary!: DisasterDeclarationsSummary
  //disasterDeclarationsSummaries: DisasterDeclarationsSummaryType[] |null = null

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
          this.displayDataSet()
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

  displayDataSet() {
    console.log(`Received new disasterDeclarationsSummary via subscription. metadata: \n ${JSON.stringify(this.disasterDeclarationsSummary.metadata)}`)
    console.log(`Received new disasterDeclarationsSummary via subscription. DisasterDeclarationsSummaries: \n ${JSON.stringify(this.disasterDeclarationsSummary.DisasterDeclarationsSummaries)}`)

    this.disasterDeclarationsSummaries = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
  }

  ngOnDestroy(): void {
    this.declarationsSummariesSubscription?.unsubscribe()
  }
}
