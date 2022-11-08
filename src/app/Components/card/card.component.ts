import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgIfContext } from '@angular/common';
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

  types = DisasterTypes

  constructor() {
    //console.log(`CardComponent: constructor`)
  }

  ngOnInit(): void {
    //console.log(`CardComponent: ngOnInit`)
    //console.log(`CardComponent: disaster=${this.disaster?.femaDeclarationString}, in ${this.disaster?.state}`)
  }

  calcBackgroundColor(type: string) {
    let id = this.types.find(el => el.type == type)
    return { 'background-color': `${id ? id.color : '#A3A3A3'}` }
    // UNKNOWN!
  }
  /*
      for (let i = 0; i < DisasterTypes.length; i++) {
        if (type == DisasterTypes[i].type) {
          color = DisasterTypes[0].color
        }
      }
      return { 'background-color': `${color}` }
    }
    */
}

