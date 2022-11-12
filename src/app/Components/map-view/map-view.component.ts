/// <reference types="@types/google.maps" />

import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription, throwError } from 'rxjs';

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service } from 'src/app/services'
import { Common } from "../"

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
  providers: [DisasterDeclarationsSummariesV2Service],
})
export class MapViewComponent implements OnInit, OnDestroy {

  private declarationsSummariesSubscription!: Subscription
  public disasterDeclarationsSummary!: DisasterDeclarationsSummary

  constructor(
    private disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service,
  ) {

    console.log(`MapViewComponent constructor: Getting declarationsSummariesSubscription`)

    this.declarationsSummariesSubscription = disasterDeclarationsSummariesV2Service.getDisasterDeclarationsSummariesV2ServiceObserver().subscribe({
      next: (newDisasterDeclarationsSummary) => {
        this.disasterDeclarationsSummary = newDisasterDeclarationsSummary
        this.displayDataSet()
      },
      error: (e) => console.error('declarationsSummariesSubscription got:' + e),
      complete: () => console.info('declarationsSummariesSubscription complete')
    })

    console.log(`MapViewComponent: Requested declarationsSummariesSubscription, awaiting results`)
  }

  ngOnInit(): void {
    // fetch data async after constructior when async pipe subscribes to the disasters$ observable
    console.log(`MapViewComponent ngOnInit.`)

    if (this.disasterDeclarationsSummary) {
      console.log(`ngInit got disasterDeclarationsSummary: ${JSON.stringify(this.disasterDeclarationsSummary.DisasterDeclarationsSummaries[0])}`)
    } else {
      console.warn(`ngInit hasn't got disasterDeclarationsSummary yet!`)
    }
  }

  displayDataSet() {

    console.log(`MapViewComponent: Received new disasterDeclarationsSummary via subscription. \n metadata: \n ${JSON.stringify(this.disasterDeclarationsSummary.metadata)}`)

    //  console.log(`MapViewComponent: Received new disasterDeclarationsSummary via subscription. \n DisasterDeclarationsSummaries: \n ${JSON.stringify(this.disasterDeclarationsSummary.DisasterDeclarationsSummaries)}`)

    //    this.disasterDeclarationsSummaries = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
  }

  ngOnDestroy(): void {
    this.declarationsSummariesSubscription?.unsubscribe()
  }

}
