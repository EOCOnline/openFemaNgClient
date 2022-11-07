import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Dog } from './disasters.service';
import { RouterModule } from '@angular/router';
import { DisasterDeclarationsSummaryType } from '../../services/disaster-declarations-summaries-v2.interface';

@Component({
  selector: 'simple-card',
  // standalone: true,
  // imports: [CommonModule, RouterModule],
  templateUrl: './simple-card.component.html',
  styleUrls: ['./simple-card.component.scss']
})
export class SimpleCardComponent implements OnInit {
  @Input() disaster!: DisasterDeclarationsSummaryType
  @Input() index!: Number

  constructor() {
    console.log(`SimpleCardComponent: constructor`)
  }

  ngOnInit(): void {
    console.log(`SimpleCardComponent: ngOnInit`)
    console.log(`SimpleCardComponent: disaster=${this.disaster?.femaDeclarationString}, in ${this.disaster?.state}`)
  }

}
