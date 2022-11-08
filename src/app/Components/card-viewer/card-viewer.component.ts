import { Component, Input, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination'

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, DisasterDeclarationsSummariesV2Service, DisasterTypes } from '../../services'

/*  https://github.com/angular/examples/tree/main/walk-my-dog & https://angular.io/guide/standalone-components
  !Following removed in order to access NgxPaginationModule
  standalone: true,  // https://angular.io/guide/standalone-components
    imports: [CommonModule, CardComponent],
  */


@Component({
  selector: 'card-viewer',
  templateUrl: './card-viewer.component.html',
  styleUrls: ['./card-viewer.component.scss'],
  providers: [DisasterDeclarationsSummariesV2Service],
})
export class CardViewerComponent implements OnInit, OnDestroy {
  @Input('data') disasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]
  @ViewChild('NumPerPage') NumPerPage!: ElementRef

  // https://michaelbromley.github.io/ngx-pagination
  config: PaginationInstance = {
    itemsPerPage: 30,
    currentPage: 1
  }

  private declarationsSummariesSubscription!: Subscription
  private disasterDeclarationsSummary!: DisasterDeclarationsSummary
  types = DisasterTypes


  constructor(
    private disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service,
    //   @Inject(DOCUMENT) private document: Document,
  ) {
    console.log(`CardViewerComponent: Getting declarationsSummariesSubscription`)
    this.declarationsSummariesSubscription = disasterDeclarationsSummariesV2Service.getDisasterDeclarationsSummariesV2ServiceObserver().subscribe({
      next: (newDisasterDeclarationsSummary) => {
        this.disasterDeclarationsSummary = newDisasterDeclarationsSummary
        this.displayDataSet()
      },
      error: (e) => console.error('declarationsSummariesSubscription got:' + e),
      complete: () => console.info('declarationsSummariesSubscription complete')
    })

    console.log(`CardViewerComponent: Got declarationsSummariesSubscription, awaiting results`)
  }

  ngOnInit(): void {
    // fetch data async after constructior when async pipe subscribes to the disasters$ observable
    // console.error(`CardViewerComponent: Got observable: ${this.disasterDeclarationsSummary}   ${JSON.stringify(this.disasterDeclarationsSummary)}`)
  }

  displayDataSet() {
    // console.log(`CardViewerComponent: Received new disasterDeclarationsSummary via subscription. \n metadata: \n ${JSON.stringify(this.disasterDeclarationsSummary.metadata)}`)
    // console.log(`CardViewerComponent: Received new disasterDeclarationsSummary via subscription. \n DisasterDeclarationsSummaries: \n ${JSON.stringify(this.disasterDeclarationsSummary.DisasterDeclarationsSummaries[0])}`)

    this.disasterDeclarationsSummaries = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
  }

  checkBoxesInit() {
    // https://coryrylan.com/blog/creating-a-dynamic-checkbox-list-in-angular
    //  DisasterTypes.forEach(() => this.typesArray.push(new FormControl(true)));
  }

  onChanged(type: string) {
    console.error(`CardViewerComponent: got changed ${type}`)

  }

  onNumberPerPage() {
    //let cntrl = document.getElementById("NumPerPage") as HTMLInputElement
    this.config.itemsPerPage = Number(this.NumPerPage.nativeElement.value)
    //console.error(`================CardViewerComponent: Received new per page value ${this.config.itemsPerPage}`)
  }

  ngOnDestroy(): void {
    this.declarationsSummariesSubscription?.unsubscribe()
  }
}
