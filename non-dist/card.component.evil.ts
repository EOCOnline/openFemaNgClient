import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Dog } from './disasters.service';
import { RouterModule } from '@angular/router';
import { DisasterDeclarationsSummaryType } from '../src/app/services/disaster-declarations-summaries-v2.interface';

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
        /*
        {'background-color':
      case 'Coastal Storm') ? '#80DEEA':
      case 'Earthquake') ? '#FFFF00':
      case 'Fire') ? '#FF6E40':
      case 'Flood') ? '#8C9EFF':
      case 'Hurricane') ? '#CE93D8':
      case 'Severe Ice Storm') ? '#B2EBF2':
      case 'Severe Storm') ? 'lightblue':
      case 'Snowstorm') ? '#E0E0E0':
      case 'Tornado') ? '#E1BEE7':
      case 'Other') ? '#EEEEEE':
        null}
        */
        let color: string

        switch (type) {

            case 'Coastal Storm': color = '#80DEEA'; break
            case 'Earthquake': color = '#FFFF00'; break
            case 'Fire': color = '#FF6E40'; break
            case 'Flood': color = '#8C9EFF'; break
            case 'Hurricane': color = '#CE93D8'; break
            case 'Severe Ice Storm': color = '#B2EBF2'; break
            case 'Severe Storm': color = 'lightblue'; break
            case 'Snowstorm': color = '#E0E0E0'; break
            case 'Tornado': color = '#E1BEE7'; break
            case 'Other': color = '#EEEEEE'; break
            default: color = '#EEEEEE'; break
        }
        return `{'background-color': ${color} }`
    }
}
}
