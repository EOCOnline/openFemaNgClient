import { Component, OnInit } from '@angular/core';
import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service } from 'src/app/services';

@Component({
  selector: 'app-dataset-details.component',
  templateUrl: './dataset-details.component.component.html',
  styleUrls: ['./dataset-details.component.component.scss'],
  standalone: true,  // https://angular.io/guide/standalone-components
})
export class DatasetDetailsComponent implements OnInit {

  constructor() {
    console.log (`DatasetDetailsComponent: Getting declarationsSummariesSubscription`)

  }

  ngOnInit(): void {
  }

}
