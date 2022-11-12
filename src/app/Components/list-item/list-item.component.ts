import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisasterDeclarationsSummaryType, DisasterTypes, WebDisasterSummariesService } from 'src/app/services';
import { RouterModule } from '@angular/router';
//import { ListViewComponent } from '..';
import { Common } from "../"
//standalone: true,
//imports: [CommonModule, RouterModule],
@Component({
  selector: 'list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  //providers:[DisasterDeclarationsSummariesV2Service],
})
export class ListItemComponent implements OnInit {
  @Input() disaster!: DisasterDeclarationsSummaryType // | null = null
  @Input() index: Number = 0 // | null = null



  constructor(readonly webDisasterSummariesService: WebDisasterSummariesService) {
    if (!this.index) {
      this.index = -1
    }
  }

  ngOnInit(): void {
  }

  getDisasterColorStyle(type: string) {
    return Common.getDisasterColorStyle(type)
  }
}
