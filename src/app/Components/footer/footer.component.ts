//import { Subscription } from 'rxjs'

import { Component, Inject, OnDestroy, OnInit } from '@angular/core'

//import { LogService, SettingsService, SettingsType } from '../services'
//import { DOCUMENT, formatDate } from '@angular/common'
//import { Utility } from '../utility';

/**
 * Footer component
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent { //implements OnInit, OnDestroy

  // collection = [`item -1`]
  // page = 1

  today = new Date()
  version = "0.0.1"


  constructor(
    //@Inject(DOCUMENT) private document: Document
    ) {
    console.log(`======== FooterComponent Constructor() ============`)

    // for (let i = 1; i <= 100; i++) {
    //   this.collection.push(`item ${i}`)
    // }

  }

  ngOnInit(): void {
    //this.version = this.settings?.version
  }

  ngOnDestroy() {
    //this.settingsSubscription?.unsubscribe()
  }
}
