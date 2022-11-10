import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisasterDeclarationsSummaryType, DisasterTypes, WebDisasterSummariesService } from 'src/app/services';
import { RouterModule } from '@angular/router';
//import { ListViewComponent } from '..';

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

  types = DisasterTypes

  constructor(readonly webDisasterSummariesService: WebDisasterSummariesService) {
    if (!this.index) {
      this.index = -1
    }
  }

  ngOnInit(): void {
  }

  calcBackgroundColor(type: string) {
    let id = this.types.find(el => el.type == type)
    return { 'background-color': `${id ? id.color : '#A3A3A3'}` }
    // UNKNOWN!
  }
}
