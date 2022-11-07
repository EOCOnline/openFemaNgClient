import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisasterDeclarationsSummaryType, WebDisasterSummariesService } from 'src/app/services';
import { RouterModule } from '@angular/router';
import { DatasetViewerComponent } from './../';

//standalone: true,
//imports: [CommonModule, RouterModule],
@Component({
  selector: 'app-dataset-card',
  templateUrl: './dataset-card.component.html',
  styleUrls: ['./dataset-card.component.scss'],
  //providers:[DisasterDeclarationsSummariesV2Service],
})
export class DatasetCardComponent implements OnInit {
  @Input() disaster!: DisasterDeclarationsSummaryType// | null = null
  @Input() index: Number = 0// | null = null

  constructor(readonly webDisasterSummariesService: WebDisasterSummariesService) {
    if (!this.index) {
      this.index = -1
    }
  }

  ngOnInit(): void {
  }

}
