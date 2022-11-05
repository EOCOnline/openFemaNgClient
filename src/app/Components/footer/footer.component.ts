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

  today = new Date()
  version = "0.0.1"


  constructor(
    //@Inject(DOCUMENT) private document: Document
    ) {
    console.log(`======== FooterComponent Constructor() ============`)
  }

  ngOnInit(): void {
    //this.version = this.settings?.version
  }

  ngOnDestroy() {
    //this.settingsSubscription?.unsubscribe()
  }
}
