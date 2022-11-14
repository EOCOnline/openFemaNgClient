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
type propArrayT = { key: string, value: string | number | boolean | null }

@Component({
  selector: 'card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss'],
  providers: [DisasterDeclarationsSummariesV2Service],
})
export class CardViewComponent implements OnInit, OnDestroy {
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
  propArray!: propArrayT[]

  serverSortProperty = { key: 'server order', value: 'index' }
  assend = true
  prevKey = ""

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
    console.log(`CardViewer: Got new declaration summaries!`)

    this.disasterDeclarationsSummaries = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
    this.filteredDisasterDeclarationsSummaries = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
    this.propArray = this.getDatasetProperties(0)
  }

  absoluteIndex(indexOnPage: number): number {
    return this.config.itemsPerPage * (this.config.currentPage - 1) + indexOnPage;
  }

  onNumberPerPage() {
    //let cntrl = document.getElementById("NumPerPage") as HTMLInputElement
    this.config.itemsPerPage = Number(this.NumPerPage.nativeElement.value)  // relies on @ViewChild
    //console.log(`CardViewer: Received new per page value ${this.config.itemsPerPage}`)
  }

  //!TODO: Merge sortBy & onChecked, so both run in predictable way
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

    // NOW filter all summaries by whether they should be displayed.
    // Old way of only displaying card only if that type's display was true messed up pagination...)
    console.warn(`CardViewer: onChecked refiltering ${this.disasterDeclarationsSummaries.length} records`)
    this.filteredDisasterDeclarationsSummaries = this.disasterDeclarationsSummaries.filter(this.shouldDisplay)
    console.warn(`CardViewer: onChecked refiltered to ${this.filteredDisasterDeclarationsSummaries.length}`)
  }

  shouldDisplay(el: DisasterDeclarationsSummaryType) {
    // WIERD: can't access this.types within this filter function: scoping issues?!
    // const myTypes = DisasterTypes
    return DisasterTypes.find(ell => ell.type == el.incidentType)?.display
  }

  filterBy(type: string) {
    return this.types.find(el => el.type == type)?.display
  }

  /**
   *
   * https://imfaber.me/typescript-how-to-iterate-over-object-properties/
   */
  getDatasetProperties(index: number = 0) {
    let propArray: propArrayT[] = [this.serverSortProperty] //! this special tag could also be added in the html!
    Object.entries(this.disasterDeclarationsSummaries[index])
      .forEach(([key, value]) => propArray.push({ 'key': key, 'value': value }))

    return propArray
  }


  //!TODO: Merge sortBy & onChecked, so both run in predictable way
  sortBy(ev: Event) {
    let selectElement = document.querySelector('#sortOrder') as HTMLSelectElement;
    let key = selectElement?.value

    // if users re-selects key, then sort decending
    if (this.prevKey == key) {
      this.assend = !this.assend
    } else {
      this.assend = true
      this.prevKey = key
    }

    console.log(`CardViewer: Sorting ${this.assend ? "assending" : "decending"} by ${key}...`)

    if (key == this.serverSortProperty.key) {
      // no need to sort, but IF its already been sorted...
      console.warn(`CardViewer sortBy: sorting by 'server order' WILL IGNORE PREVIOUS FILTERS!`)
      this.filteredDisasterDeclarationsSummaries = this.disasterDeclarationsSummaries
    } else {
      // let cntrl = document.getElementById(key) as HTMLInputElement

      // let arrayItem = this.propArray.find(el => el.key == key)
      // if (!arrayItem) {
      //   console.error(`CardViewer: could NOT find ${key} in list of disaster dataset properties`)
      //   return
      // }


      // NOW filter all summaries by whether they should be displayed.
      // Old way of only displaying card, only if that key's display was true, messed up pagination...)
      console.warn(`CardViewer: sortBy ${key}; sorting ${this.disasterDeclarationsSummaries.length} records`)
      // ! BUG: Need to do BOTH sort & filtering...

      this.filteredDisasterDeclarationsSummaries = this.disasterDeclarationsSummaries.sort(this.sortFn(x, y, key, assend))
      //arrayOfObjects.sort((a, b) => (a.propertyToSortBy < b.propertyToSortBy ? -1 : 1))
      //arrayOfObjects.sort((a.propertyToSortBy, b.propertyToSortBy) => (a.propertyToSortBy < b.propertyToSortBy ? -1 : 1))
      //arrayOfObjects.sort((a.propertyToSortBy, b.propertyToSortBy) => (a.propertyToSortBy > b.propertyToSortBy ? -1 : 1))
    }
  }

  sortFn(x: DisasterDeclarationsSummaryType, y: DisasterDeclarationsSummaryType,
    sortKey: keyof DisasterDeclarationsSummaryType, assending: boolean = true) {

    let assention = assending ? 1 : -1

    if (sortKey && x && y) {
      let xx = x[sortKey]
      let yy = x[sortKey]

      if (xx && yy) {
        if (xx > yy) return assention
        if (xx < yy) return -assention
      }
    }
    return 0
  }

  getProperty(disaster: DisasterDeclarationsSummaryType, property: keyof DisasterDeclarationsSummaryType) {
    return disaster[property]
  }
  // https://stackoverflow.com/a/62311449/18004414
  getKeyValue = <T extends {}, U extends keyof T>(key: U) => (obj: T) => obj[key]

  sortByy = <T extends {}>(index: string, list: T[]): T[] => {
    return list.sort((a, b): number => {
      const _a = this.getKeyValue<keyof T, T>(index)(a)
      const _b = this.getKeyValue<keyof T, T>(index)(b)
      if (_a < _b) return -1
      if (_a > _b) return 1
      return 0
    })
  }

  const x = [{ label: 'anything' }, { label: 'goes' }]


  ngOnDestroy(): void {
    this.declarationsSummariesSubscription?.unsubscribe()
  }
}
