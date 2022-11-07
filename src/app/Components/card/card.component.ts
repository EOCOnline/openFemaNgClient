import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Dog } from './disasters.service';
import { RouterModule } from '@angular/router';
import { DisasterDeclarationsSummaryType, DisasterTypes } from '../../services/disaster-declarations-summaries-v2.interface';

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

  calcBackgroundColor(type: string) {
    let color: string
    //color = DisasterTypes[type]
    //color = DisasterTypes.type

    switch (type) {
      case 'Coastal Storm': color = DisasterTypes['Coastal Storm']; break
      case 'Earthquake': color = DisasterTypes.Earthquake; break
      case 'Fire': color = DisasterTypes.Fire; break
      case 'Flood': color = DisasterTypes.Flood; break
      case 'Hurricane': color = DisasterTypes.Hurricane; break
      case 'Severe Ice Storm': color = DisasterTypes['Severe Ice Storm']; break
      case 'Severe Storm': color = DisasterTypes['Severe Storm']; break
      case 'Snowstorm': color = DisasterTypes.Snowstorm; break
      case 'Tornado': color = DisasterTypes.Tornado; break
      case 'Other': color = DisasterTypes.Other; break

      default: color = '##A3A3A3'; break
    }

    return { 'background-color': `${color}` }
  }
}

