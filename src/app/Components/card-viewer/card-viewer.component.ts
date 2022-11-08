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
  @Input('data') filteredDisasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]
  //  @Input('data') !: DisasterDeclarationsSummaryType[]
  @ViewChild('NumPerPage') NumPerPage!: ElementRef

  // https://michaelbromley.github.io/ngx-pagination
  config: PaginationInstance = {
    itemsPerPage: 30,
    currentPage: 1
  }

  private declarationsSummariesSubscription!: Subscription
  private disasterDeclarationsSummary!: DisasterDeclarationsSummary
  disasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]
  types = DisasterTypes


  constructor(
    private disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service,
    //   @Inject(DOCUMENT) private document: Document,
  ) {
    console.log(`CardViewer: Getting declarationsSummariesSubscription`)
    this.declarationsSummariesSubscription = disasterDeclarationsSummariesV2Service.getDisasterDeclarationsSummariesV2ServiceObserver().subscribe({
      next: (newDisasterDeclarationsSummary) => {
        this.disasterDeclarationsSummary = newDisasterDeclarationsSummary
        this.displayDataSet()
      },
      error: (e) => console.error('declarationsSummariesSubscription got:' + e),
      complete: () => console.info('declarationsSummariesSubscription complete')
    })

    console.log(`CardViewer: Got declarationsSummariesSubscription, awaiting results`)
  }

  ngOnInit(): void {
    // fetch data async after constructior when async pipe subscribes to the disasters$ observable
    // console.error(`CardViewer: Got observable: ${this.disasterDeclarationsSummary}   ${JSON.stringify(this.disasterDeclarationsSummary)}`)
  }

  displayDataSet() {
    // console.log(`CardViewer: Received new disasterDeclarationsSummary via subscription. \n metadata: \n ${JSON.stringify(this.disasterDeclarationsSummary.metadata)}`)
    // console.log(`CardViewer: Received new disasterDeclarationsSummary via subscription. \n DisasterDeclarationsSummaries: \n ${JSON.stringify(this.disasterDeclarationsSummary.DisasterDeclarationsSummaries[0])}`)
    console.warn(`CardViewer: Got new declaration summaries!`)
    this.disasterDeclarationsSummaries = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
    this.filteredDisasterDeclarationsSummaries = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
  }

  onNumberPerPage() {
    //let cntrl = document.getElementById("NumPerPage") as HTMLInputElement
    this.config.itemsPerPage = Number(this.NumPerPage.nativeElement.value)  // relies on @ViewChild
    //console.log(`CardViewer: Received new per page value ${this.config.itemsPerPage}`)
  }

  checkBoxesInit() {
    // https://coryrylan.com/blog/creating-a-dynamic-checkbox-list-in-angular
    //  DisasterTypes.forEach(() => this.typesArray.push(new FormControl(true)));
  }

  onChanged(type: string) {
    let cntrl = document.getElementById(type) as HTMLInputElement

    let arrayItem = this.types.find(el => el.type == type)
    if (!arrayItem) {
      console.error(`CardViewer: could NOT find ${type} in list of known disaster types`)
      return
    }
    arrayItem.display = !arrayItem?.display
    cntrl.checked = arrayItem.display

    console.log(`CardViewer: now ${arrayItem.display ? '' : 'NOT '}displaying ${cntrl.id}`)

    // NOW filter all summaries by whether they should be displayed.
    // Old way of only displaying card only if that type's display was true messed up pagination...)
    console.warn(`CardViewer: onChanged refiltering ${this.disasterDeclarationsSummaries.length}`)
    this.filteredDisasterDeclarationsSummaries = this.disasterDeclarationsSummaries.filter(this.shouldDisplay)
    console.warn(`CardViewer: onChanged refiltered to ${this.filteredDisasterDeclarationsSummaries.length}`)
  }

  shouldDisplay(el: DisasterDeclarationsSummaryType) {
    // WIERD: can't access this.types within this filter function: scoping issues?!
    // const myTypes = DisasterTypes
    return DisasterTypes.find(ell => ell.type == el.incidentType)?.display
  }

  filterBy(type: string) {
    return this.types.find(el => el.type == type)?.display
  }

  ngOnDestroy(): void {
    this.declarationsSummariesSubscription?.unsubscribe()
  }
}
