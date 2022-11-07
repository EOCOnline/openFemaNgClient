import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
//import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';  // https://angular.io/guide/http
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service } from 'src/app/services'
import { BrowserModule } from '@angular/platform-browser';
// import { SimpleCardComponent } from '..'
import { PaginationInstance } from 'ngx-pagination'


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
  providers: [DisasterDeclarationsSummariesV2Service],
  // EVIL: changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleViewerComponent implements OnInit, OnDestroy {
  @Input('data') disasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]
  @ViewChild('NumPerPage') NumPerPage!: ElementRef

  // https://michaelbromley.github.io/ngx-pagination
  itemsPerPage = 30
  currentPage = 1

  config: PaginationInstance = {
    itemsPerPage: 30,
    currentPage: 1
  }

  private declarationsSummariesSubscription!: Subscription
  private disasterDeclarationsSummary!: DisasterDeclarationsSummary
  //disasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]

  constructor(
    //private httpClient: HttpClient,
    private disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service,
    @Inject(DOCUMENT) private document: Document,
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
    console.log(`SimpleViewerComponent: Received new disasterDeclarationsSummary via subscription. \n DisasterDeclarationsSummaries: \n ${JSON.stringify(this.disasterDeclarationsSummary.DisasterDeclarationsSummaries[0])}`)

    this.disasterDeclarationsSummaries = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
  }

  onNumberPerPage() {
    //let cntrl = document.getElementById("NumPerPage") as HTMLInputElement
    this.config.itemsPerPage = Number(this.NumPerPage.nativeElement.value)
    //console.error(`================SimpleViewerComponent: Received new per page value ${this.config.itemsPerPage}`)
  }
  ngOnDestroy(): void {
    this.declarationsSummariesSubscription?.unsubscribe()
  }
}
