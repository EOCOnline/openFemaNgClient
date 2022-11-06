import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';  // https://angular.io/guide/http
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service } from 'src/app/services'
import { BrowserModule } from '@angular/platform-browser';
import { SimpleCardComponent } from '..';


// see: https://github.com/angular/examples/tree/main/walk-my-dog; from https://angular.io/guide/standalone-components video
/*
  Following removed in order to access NgxPaginationModule
    import {NgxPaginationModule} from 'ngx-pagination'

    standalone: true,  // https://angular.io/guide/standalone-components
      imports: [
        CommonModule,
        SimpleCardComponent,
        // NgxPaginationModule,
      ],
  */

@Component({
  selector: 'simple-viewer',
  templateUrl: './simple-viewer.component.html',
  styleUrls: ['./simple-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleViewerComponent implements OnInit, OnDestroy {
  // https://michaelbromley.github.io/ngx-pagination
  @Input('data') disasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]
  page = 1;

  private declarationsSummariesSubscription!: Subscription
  private disasterDeclarationsSummary!: DisasterDeclarationsSummary
  //disasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]

  constructor(
    //private httpClient: HttpClient,
    private disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service,
  ) {

    // Following works: based on reading an actual JSON file
    /*
    let myTest = disasterDeclarationsSummariesV2Service.test()
      console.error (`SimpleViewerComponent: ${JSON.stringify(myTest.DisasterDeclarationsSummaries[0])}`)
    */

    console.log(`SimpleViewerComponent: Getting declarationsSummariesSubscription`)

    this.declarationsSummariesSubscription = disasterDeclarationsSummariesV2Service.getDisasterDeclarationsSummariesV2ServiceObserver().subscribe({
      next: (newDisasterDeclarationsSummary) => {
        this.disasterDeclarationsSummary = newDisasterDeclarationsSummary
        this.displayDataSet()
        //debugger
      },
      error: (e) => console.error('declarationsSummariesSubscription got:' + e),
      complete: () => console.info('declarationsSummariesSubscription complete')
    })

    console.log(`SimpleViewerComponent: Got declarationsSummariesSubscription, awaiting results`)
  }

  ngOnInit(): void {
    // fetch data async after constructior when async pipe subscribes to the disasters$ observable
    // debugger
    console.error(`SimpleViewerComponent: Got observable: ${this.disasterDeclarationsSummary}   ${JSON.stringify(this.disasterDeclarationsSummary)}`)
  }

  displayDataSet() {
    console.log(`SimpleViewerComponent: Received new disasterDeclarationsSummary via subscription. \n metadata: \n ${JSON.stringify(this.disasterDeclarationsSummary.metadata)}`)
    console.log(`SimpleViewerComponent: Received new disasterDeclarationsSummary via subscription. \n DisasterDeclarationsSummaries: \n ${JSON.stringify(this.disasterDeclarationsSummary.DisasterDeclarationsSummaries)}`)

    this.disasterDeclarationsSummaries = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
  }

  ngOnDestroy(): void {
    this.declarationsSummariesSubscription?.unsubscribe()
  }
}
