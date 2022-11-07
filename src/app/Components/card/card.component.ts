import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Dog } from './disasters.service';
import { RouterModule } from '@angular/router';
import { DisasterDeclarationsSummaryType } from '../../services/disaster-declarations-summaries-v2.interface';

@Component({
  selector: 'card',
  // standalone: true,
  // imports: [CommonModule, RouterModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() disaster!: DisasterDeclarationsSummaryType
  @Input() index!: Number

  constructor() {
    //console.log(`CardComponent: constructor`)
  }

  ngOnInit(): void {
    //console.log(`CardComponent: ngOnInit`)
    //console.log(`CardComponent: disaster=${this.disaster?.femaDeclarationString}, in ${this.disaster?.state}`)
  }

}
