import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service } from 'src/app/services';


@Component({
  selector: 'detail-view.component',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
  standalone: true,  // https://angular.io/guide/standalone-components
  imports: [CommonModule],
  providers: [DisasterDeclarationsSummariesV2Service],
})
export class DetailViewComponent implements OnInit {
  //@Input() disaster!: DisasterDeclarationsSummaryType
  //@Input() index!: Number

  //summary$!: Observable<DisasterDeclarationsSummary | undefined>;
  summary$!: Observable<DisasterDeclarationsSummaryType | undefined>
  //disaster!: DisasterDeclarationsSummaryType
  allSummaries!: DisasterDeclarationsSummary
  summary!: DisasterDeclarationsSummaryType

  constructor(private disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service, private route: ActivatedRoute) {

    console.log(`DetailView: Getting declarationsSummariesSubscription`)

  }


  ngOnInit(): void {
    console.log(`DetailView onInit: Got data yet?!`)
    this.waitForData()
    //this.disaster = this.disasterDeclarationsSummariesV2Service.getSummary(this.index)

    this.allSummaries = this.disasterDeclarationsSummariesV2Service.getSummaries()
    //this.summary = this.allSummaries.DisasterDeclarationsSummaries[Number(params.get('index'))]

    this.summary$ = this.route.paramMap.pipe(map(params => {
      console.error(`DetailView onInit: looking up summary # ${params.get('index')}`)
      let val = this.disasterDeclarationsSummariesV2Service.getSummary(Number(params.get('index')))
      if (val) {
        console.error(`DetailView onInit: Found disaster ${val.declarationRequestNumber} -- ${val.declarationTitle}`)
        return val
      } else {
        console.error(`DetailView onInit: Could NOT find disaster # ${params.get('index')}. Maybe too early?`)
        return undefined
      }
      //   return this.disasterDeclarationsSummariesV2Service.disasterDeclarationsSummary.DisasterDeclarationsSummaries[Number(params.get('index'))]
    }))
  }

  sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  waitForData() {
    console.error(`DetailView waitForData`)
    let rows: DisasterDeclarationsSummary | null = null
    if (rows) {
      console.error(`DetailView waitForData SHOULD NOT GET THIS!`)
    } else {
      console.warn(`DetailView waitForData SHOULD get this!`)
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
