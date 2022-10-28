import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisasterDeclarationsSummaryType, WebDisasterSummariesService } from 'src/app/services';
import { RouterModule } from '@angular/router';
//import { DataSetCardComponent } from './data-set-card.component';
//import { DataSetViewerComponent } from '../../app.component';

@Component({
  selector: 'app-data-set-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './data-set-card.component.html',
  styleUrls: ['./data-set-card.component.scss']
})
export class DataSetCardComponent implements OnInit {

  @Input() disaster!: DisasterDeclarationsSummaryType;
  @Input() index!: Number;

  constructor(readonly webDisasterSummariesService: WebDisasterSummariesService) { }

  ngOnInit(): void {
  }

}
