import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service } from 'src/app/services';

@Component({
  selector: 'app-dataset-details.component',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['./dataset-details.component.scss'],
  standalone: true,  // https://angular.io/guide/standalone-components
  imports: [CommonModule],
})
export class DatasetDetailsComponent implements OnInit {

  //summary$!: Observable<DisasterDeclarationsSummary | undefined>;
  summary$!: Observable<DisasterDeclarationsSummaryType | undefined>;

  constructor(private disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service, private route: ActivatedRoute) {

    console.log (`DatasetDetailsComponent: Getting declarationsSummariesSubscription`)

  }


  ngOnInit(): void {
    this.summary$ = this.route.paramMap.pipe(map(params => {
      return this.disasterDeclarationsSummariesV2Service.disasterDeclarationsSummary.DisasterDeclarationsSummaries[Number(params.get('index'))]
    }))
  }

}
