 import { Component, Input, OnInit } from '@angular/core';
 import { CommonModule } from '@angular/common';
// import { Dog } from './disasters.service';
 import { RouterModule } from '@angular/router';
import { DisasterDeclarationsSummaryType } from '../services/disaster-declarations-summaries-v2.interface';

 @Component({
   selector: 'simple-card',
   //standalone: true,
   //imports: [CommonModule, RouterModule],
   template: `
   <h5>simple-card</h5>
   <article class="pet-card">
     <p class="description">
       <span class="pet-name">{{disaster.femaDeclarationString}}</span> in {{disaster.state}} of type
       {{disaster.incidentType}}
     </p>
     <p class="pet-learn-more"><a href="/details/{{index}}">Learn More</a></p>
   <article>
 `,
   styles: [`
   .pet-card {
     display: flex;
     flex-direction: column;
     border-radius: 10px;
     box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
     width: 300px;
   }
   .pet-name {
     font-weight: bolder;
   }
   .description, .pet-headline, .pet-learn-more {
     padding: 10px;
   }
 `]
 })
 export class SimpleCardComponent implements OnInit {
   @Input() disaster!: DisasterDeclarationsSummaryType
   @Input() index!: Number

   constructor() {
    console.log (`SimpleCardComponent: constructor`)
    }

   ngOnInit(): void {
   }

 }
