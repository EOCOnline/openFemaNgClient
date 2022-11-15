import { Component, Input, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination'

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, DisasterDeclarationsSummariesV2Service, DisasterTypes } from '../../services'

/*  https://github.com/angular/examples/tree/main/walk-my-dog & https://angular.io/guide/standalone-components
  !Following removed in order to access NgxPaginationModule
  standalone: true,  // https://angular.io/guide/standalone-components
    imports: [CommonModule, CardComponent],
  */

type keyArrayT = { key: keyof DisasterDeclarationsSummaryType | undefined }
type valueArrayT = { key: keyof DisasterDeclarationsSummaryType | undefined, value: string | number | boolean | null }

@Component({
  selector: 'card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss'],
  providers: [DisasterDeclarationsSummariesV2Service],
})
export class CardViewComponent implements OnInit, OnDestroy {
  @Input('data') filteredDisasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]
  @ViewChild('NumPerPage') NumPerPage!: ElementRef

  private declarationsSummariesSubscription!: Subscription
  private disasterDeclarationsSummary!: DisasterDeclarationsSummary
  disasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]
  types = DisasterTypes

  // https://michaelbromley.github.io/ngx-pagination
  config: PaginationInstance = {
    itemsPerPage: 30,
    currentPage: 1
  }

  keyArray!: keyArrayT[]
  serverSort = 'server order'
  sortKey!: keyof DisasterDeclarationsSummaryType | undefined  // undefined is flag for serverSort: no sort
  ascend = 1

  constructor(
    private disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service,
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
  }

  displayDataSet() {
    // console.log(`CardViewer: Received new disasterDeclarationsSummary via subscription. \n metadata: \n ${JSON.stringify(this.disasterDeclarationsSummary.metadata)}`)
    // console.log(`CardViewer: Received new disasterDeclarationsSummary via subscription. \n DisasterDeclarationsSummaries: \n ${JSON.stringify(this.disasterDeclarationsSummary.DisasterDeclarationsSummaries[0])}`)
    console.log(`CardViewer: Got new declaration summaries!`)

    this.disasterDeclarationsSummaries = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
    this.filteredDisasterDeclarationsSummaries = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
    this.keyArray = this.getDatasetKeys(0)
  }

  //  ========================== Paginate =================================
  absoluteIndex(indexOnPage: number): number {
    return this.config.itemsPerPage * (this.config.currentPage - 1) + indexOnPage;
  }

  onNumberPerPage() {
    //let cntrl = document.getElementById("NumPerPage") as HTMLInputElement
    this.config.itemsPerPage = Number(this.NumPerPage.nativeElement.value)  // relies on @ViewChild
    //console.log(`CardViewer: Received new per page value ${this.config.itemsPerPage}`)
  }

  //  ======================= Filter & Sort ==============================

  // https://imfaber.me/typescript-how-to-iterate-over-object-properties/
  getDatasetKeys(index: number = 0) {
    let keyArray: keyArrayT[] = [] // NOTE: special sortServer tag is added in the template/html
    Object.keys(this.disasterDeclarationsSummaries[index])
      .forEach(([key]) => keyArray.push({ key: key as keyof DisasterDeclarationsSummaryType }))

    //or just:
    let altKeyArray = Object.getOwnPropertyNames(this.disasterDeclarationsSummaries[index])
    debugger
    return keyArray
  }

  // https://imfaber.me/typescript-how-to-iterate-over-object-properties/
  getDatasetValues_UNUSED(index: number = 0) {
    let valueArray: valueArrayT[] = [] // NOTE: special sortServer tag is added in the template/html
    Object.entries(this.disasterDeclarationsSummaries[index])
      .forEach(([key, value]) => valueArray.push({ key: key as keyof DisasterDeclarationsSummaryType, value: value }))
    return valueArray
  }

  filterSort() {
    // filter, then sort, based on latest user selections

    // start with full dataset
    this.filteredDisasterDeclarationsSummaries = this.disasterDeclarationsSummaries.filter(this.shouldDisplay)
    console.warn(`CardViewer: refiltered to ${this.filteredDisasterDeclarationsSummaries.length} records. Sort on ${this.sortKey}`)
    if (this.sortKey != undefined) {
      this.filteredDisasterDeclarationsSummaries = this.filteredDisasterDeclarationsSummaries.sort((x, y) => this.sortByObjKey(x, y))
      // for (let i = 0; i < 15; i++) { console.log(`After sort: ${i}) ${this.filteredDisasterDeclarationsSummaries[i][this.sortKey]}`)}
    } else {
      if (this.ascend < 0) {
        // decending sort
        this.filteredDisasterDeclarationsSummaries = this.filteredDisasterDeclarationsSummaries.reverse()
        console.error(`CardViewer descending sort of server order`)
      }
    }
  }

  onChecked(type: string) {
    let cntrl = document.getElementById(type) as HTMLInputElement

    let arrayItem = this.types.find(el => el.type == type)
    if (!arrayItem) {
      console.error(`CardViewer: could NOT find ${type} in list of known disaster types`)
      return
    }
    arrayItem.display = !arrayItem?.display
    cntrl.checked = arrayItem.display

    console.log(`CardViewer: now ${arrayItem.display ? '' : 'NOT '}displaying ${cntrl.id}`)
    console.warn(`CardViewer: onChecked refiltering all ${this.disasterDeclarationsSummaries.length} records`)

    this.filterSort()
  }

  shouldDisplay(el: DisasterDeclarationsSummaryType) {
    return DisasterTypes.find(ell => ell.type == el.incidentType)?.display
  }

  // TODO: handle Keydown of space or return?
  //if (event.key === 'Enter' || event.key === ' ') {event.preventDefault(); this.toggleStatus();}
  sortOrder(ev: Event) {
    let selectElement = document.querySelector('#sortBy') as HTMLSelectElement

    if (selectElement.getAttribute('aria-checked') === 'true') {
      this.ascend = 1
    } else {
      this.ascend = -1
    }
    selectElement.setAttribute('aria-checked', this.ascend == 1 ? 'false' : 'true')
    console.log(`CardViewer: sort in ${this.ascend == 1 ? "as" : "de"}sending order`)

    this.filterSort()
  }

  sortBy(ev: Event) {
    let selectElement = document.querySelector('#sortBy') as HTMLSelectElement
    let keyString = selectElement?.value

    console.log(`CardViewer: Sorting ${this.ascend == 1 ? "ascending" : "decending"} by ${keyString}...`)

    if (keyString == this.serverSort) {
      this.sortKey = undefined
      console.warn(`CardViewer sortBy: sorting by 'server order': i.e., NOTHING!`)
      if (this.ascend < 0) {
        // TODO: handle decending sort
        console.error(`CardViewer descending sort of server order not implemented yet!`)
      }
    } else {
      console.warn(`CardViewer: sortBy ${keyString}; sorting ${this.disasterDeclarationsSummaries.length} records`)
      this.sortKey = keyString as keyof DisasterDeclarationsSummaryType
    }
    this.filterSort()
  }

  sortByObjKey(x: DisasterDeclarationsSummaryType, y: DisasterDeclarationsSummaryType) {
    if (this.sortKey != undefined) {
      let xx = x[this.sortKey]
      let yy = y[this.sortKey]
      if (xx && yy) {
        if (xx > yy) return this.ascend
        if (xx < yy) return -this.ascend
      }
    }
    return 0
  }

  // https://stackoverflow.com/a/62311449/18004414
  getKeyValue_UNUSED = <T extends {}, U extends keyof T>(key: U) => (obj: T) => obj[key]

  ngOnDestroy(): void {
    this.declarationsSummariesSubscription?.unsubscribe()
  }
}
