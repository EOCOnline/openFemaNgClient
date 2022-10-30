import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisasterDeclarationsSummaryType, WebDisasterSummariesService } from 'src/app/services';
import { RouterModule } from '@angular/router';
//import { DataSetCardComponent } from './dataset-card.component';
//import { DataSetViewerComponent } from '../../app.component';

@Component({
  selector: 'app-dataset-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dataset-card.component.html',
  styleUrls: ['./dataset-card.component.scss']
})
export class DataSetCardComponent implements OnInit {

  @Input() disaster!: DisasterDeclarationsSummaryType;
  @Input() index!: Number;

  constructor(readonly webDisasterSummariesService: WebDisasterSummariesService) { }

  ngOnInit(): void {
  }

}
