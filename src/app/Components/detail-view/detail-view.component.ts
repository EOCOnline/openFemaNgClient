import { AfterContentInit, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service, DisasterTypes } from 'src/app/services';
import { Common } from "../"

@Component({
  selector: 'detail-view.component',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
  // standalone: true,  // https://angular.io/guide/standalone-components
  // imports: [CommonModule],
  providers: [DisasterDeclarationsSummariesV2Service],
})
export class DetailViewComponent implements OnInit, AfterViewInit {
  @Input() disaster!: DisasterDeclarationsSummaryType
  @Input('data') disasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]

  //@Input() index!: Number

  //summary$!: Observable<DisasterDeclarationsSummary | undefined>;
  disaster$!: Observable<DisasterDeclarationsSummaryType | undefined>
  private declarationsSummariesSubscription!: Subscription
  //disaster!: DisasterDeclarationsSummaryType
  disasterDeclarationsSummary!: DisasterDeclarationsSummary

  index = -1
  gotData = false
  types = DisasterTypes

  constructor(
    private disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service,
    private route: ActivatedRoute) {
    console.log(`DetailView: constructor`)

    console.log(`DetailView: Getting declarationsSummariesSubscription`)
    this.declarationsSummariesSubscription = disasterDeclarationsSummariesV2Service.getDisasterDeclarationsSummariesV2ServiceObserver().subscribe({
      next: (newDisasterDeclarationsSummary) => {
        this.disasterDeclarationsSummary = newDisasterDeclarationsSummary
        this.displayData()
      },
      error: (e) => console.error('DetailView: declarationsSummariesSubscription got:' + e),
      complete: () => console.info('DetailView: declarationsSummariesSubscription complete')
    })
    console.log(`CardViewer: Got declarationsSummariesSubscription, awaiting results`)
  }

  ngOnInit(): void {
    console.log(`DetailView onInit`)

    this.index = Number(this.route.snapshot.params['index'])
    // or this.route.params.subscribe(params=>{ let id = params['id'] })

    //this.waitForData()
    //this.disaster = this.disasterDeclarationsSummariesV2Service.getSummary(this.index)
  }

  displayData() {
    console.log(`DetailView displayData: Got ${this.disasterDeclarationsSummary.DisasterDeclarationsSummaries.length} records of data`)

    //console.log(`CardViewer: Received new disasterDeclarationsSummary via subscription. \n metadata: \n ${JSON.stringify(this.disasterDeclarationsSummary.metadata)}`)

    //console.log(`CardViewer: Received new disasterDeclarationsSummary via subscription. \n DisasterDeclarationsSummaries: \n ${JSON.stringify(this.disasterDeclarationsSummary.DisasterDeclarationsSummaries[0])}`)

    this.disaster = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries[this.index]
    this.gotData = true
  }

  getDisasterColorStyle(type: string) {
    return Common.getDisasterColorStyle(type)
  }


  ngAfterViewInit() {
    console.log(`DetailView ngAfterContentInit`)

    /*
    //! Moving following from OnInit to here still does NOT avoid: https://angular.io/errors/NG0100
    //  Previous value: 'null'. Current value: 'undefined'
    this.summary$ = this.route.paramMap.pipe(map(params => {
      this.itemNumber = Number(params.get('index'))

      console.error(`DetailView onInit: looking up summary # ${this.itemNumber}`)
      let val = this.disasterDeclarationsSummariesV2Service.getSummary(this.itemNumber)

      if (val) {
        console.error(`DetailView onInit: Found disaster #${this.itemNumber}) ${val.declarationRequestNumber} -- ${val.declarationTitle}`)
        return val
      } else {
        console.error(`DetailView onInit: Could NOT find disaster # ${this.itemNumber}. Maybe too early?`)
        return undefined
      }
      //   return this.disasterDeclarationsSummariesV2Service.disasterDeclarationsSummary.DisasterDeclarationsSummaries[Number(params.get('index'))]
    }))
*/
  }

  sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  //! This still seemed to block execution of 'background' loading of summaried: need to do with Promise?!
  waitForData() {
    console.log(`DetailView waitForData`)
    let rows: DisasterDeclarationsSummary | null = null
    if (rows) {
      console.warn(`DetailView waitForData SHOULD NOT GET THIS!`)
    } else {
      console.log(`DetailView waitForData SHOULD get this!`)
    }

    this.sleep(15000)

    for (let sec = 0; sec < 10; sec++) {
      rows = this.disasterDeclarationsSummariesV2Service.getSummaries()
      //console.log(`slept for ${sec} seconds...`)
      console.log(`slept for ${sec} seconds...; row has length: ${rows?.DisasterDeclarationsSummaries?.length}`)
      if (rows) {
        console.log("DatasetGridComponent onGridReady(): Got rows!")
        break
      } else {
        // Sleep 1 second...
        this.sleep(10000)
      }
    }
  }
}
