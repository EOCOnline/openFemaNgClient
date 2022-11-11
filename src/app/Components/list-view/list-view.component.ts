import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';  // https://angular.io/guide/http
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service } from 'src/app/services'
import { BrowserModule } from '@angular/platform-browser';
import { PaginationInstance } from 'ngx-pagination';
//import { DatasetCardComponent } from '../';
import { Common } from "../"


// see: https://github.com/angular/examples/tree/main/walk-my-dog; from https://angular.io/guide/standalone-components video
/*
  Following removed in order to access NgxPaginationModule
    import {NgxPaginationModule} from 'ngx-pagination'

    standalone: true,  // https://angular.io/guide/standalone-components
      imports: [
        CommonModule,
        DatasetCardComponent,
        // NgxPaginationModule,
      ],
  */

@Component({
  selector: 'list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  // EVIL: changeDetection: ChangeDetectionStrategy.OnPush,
  // standalone: true,  // https://angular.io/guide/standalone-components
  // imports: [
  // CommonModule,
  // DatasetCardComponent, can't as this is no longer stANDALONE...
  // NgxPaginationModule,
  // ],
  providers: [DisasterDeclarationsSummariesV2Service],
})
export class ListViewComponent implements OnInit, OnDestroy {
  // https://michaelbromley.github.io/ngx-pagination
  @Input('data') disasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]
  @ViewChild('NumPerPage') NumPerPage!: ElementRef

  // https://michaelbromley.github.io/ngx-pagination
  config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: 1
  }

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
      console.error (`ListViewComponent: ${JSON.stringify(myTest.DisasterDeclarationsSummaries[0])}`)
    */

    console.log(`ListViewComponent: Getting declarationsSummariesSubscription`)

    this.declarationsSummariesSubscription = disasterDeclarationsSummariesV2Service.getDisasterDeclarationsSummariesV2ServiceObserver().subscribe({
      next: (newDisasterDeclarationsSummary) => {
        this.disasterDeclarationsSummary = newDisasterDeclarationsSummary
        this.displayDataSet()
        //debugger
      },
      error: (e) => console.error('declarationsSummariesSubscription got:' + e),
      complete: () => console.info('declarationsSummariesSubscription complete')
    })

    console.log(`ListViewComponent: Got declarationsSummariesSubscription, awaiting results`)
  }

  ngOnInit(): void {
    // fetch data async after constructior when async pipe subscribes to the disasters$ observable
    // debugger
    console.error(`ListViewComponent: Got observable: ${this.disasterDeclarationsSummary}   ${JSON.stringify(this.disasterDeclarationsSummary)}`)
  }

  displayDataSet() {
    console.log(`ListViewComponent: Received new disasterDeclarationsSummary via subscription. \n metadata: \n ${JSON.stringify(this.disasterDeclarationsSummary.metadata)}`)
    console.log(`ListViewComponent: Received new disasterDeclarationsSummary via subscription. \n DisasterDeclarationsSummaries: \n ${JSON.stringify(this.disasterDeclarationsSummary.DisasterDeclarationsSummaries)}`)

    this.disasterDeclarationsSummaries = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
  }

  absoluteIndex(indexOnPage: number): number {
    return this.config.itemsPerPage * (this.config.currentPage - 1) + indexOnPage;
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
