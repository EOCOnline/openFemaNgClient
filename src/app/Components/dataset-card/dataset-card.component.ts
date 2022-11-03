import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisasterDeclarationsSummaryType, WebDisasterSummariesService } from 'src/app/services';
import { RouterModule } from '@angular/router';
//import { DatasetCardComponent } from './dataset-card.component';
//import { DatasetViewerComponent } from '../../app.component';

@Component({
  selector: 'app-dataset-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dataset-card.component.html',
  styleUrls: ['./dataset-card.component.scss']
})
export class DatasetCardComponent implements OnInit {

  @Input() disaster : DisasterDeclarationsSummaryType | null = null
  @Input() index : Number | null = null

  constructor(readonly webDisasterSummariesService: WebDisasterSummariesService) {
    if (!this.index) {
      this.index=-1
    }
  }

  ngOnInit(): void {
  }

}
