import { Injectable, OnDestroy, OnInit, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'  // https://angular.io/guide/http
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { metadataType, DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService } from './'

/*
Error: src/app/services/disaster-declarations-summaries-v2.service.ts:7:26 - error TS2732: Cannot find module './../../../assets/DisasterDeclarationsSummariesV2.json'. Consider using '--resolveJsonModule' to import module with '.json' extension.

7 import * as secrets from './../../../assets/DisasterDeclarationsSummariesV2.json' // https://stackoverflow.com/questions/71098595/purpose-of-resolvejsonmodule
*/
//import * as secrets from './../../../assets/DisasterDeclarationsSummariesV2.json'
// https://stackoverflow.com/questions/71098595/purpose-of-resolvejsonmodule

@Injectable({
  providedIn: 'root'
})
export class DisasterDeclarationsSummariesV2Service implements OnInit, OnDestroy{

  disasterDeclarationsSummary!: DisasterDeclarationsSummary
  private disasterDeclarationsSummaryObservable$: Observable<DisasterDeclarationsSummary>
  disasterDeclarationsSummaries!: [DisasterDeclarationsSummaryType];
  api = "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries"
  apiFile = "./../../../assets/DisasterDeclarationsSummariesV2.json"
  //apiFile = "./../../../assets/FemaWebDisasterSummaries.json"

  private declarationsSummarySubject$!: BehaviorSubject<DisasterDeclarationsSummary>
 // declarationsSummaries:


  /**
   *
   * Optional alternative for testing, etc.: https://medium.com/@amcdnl/mocking-with-angular-more-than-just-unit-testing-cbb7908c9fcc
   * https://github.com/angular/angular/tree/main/packages/misc/angular-in-memory-web-api
   * as demonstrated at: https://angular.io/guide/http#setup-for-server-communication
   *
   * @param http
   */
  constructor(
    private httpClient: HttpClient,
    private webDisasterSummariesService: WebDisasterSummariesService,
    @Optional() @SkipSelf() existingService: DisasterDeclarationsSummariesV2Service,
    ) {

      if (existingService) {
        /**
         * see https://angular.io/guide/singleton-services
         * Use @Optional() @SkipSelf() in singleton constructors to ensure
         * future modules don't provide extra copies of this singleton service
         * per pg 84 of Angular Cookbook: do NOT add services to *.module.ts!
         */
        throwError(() => {
          console.error(`This singleton service has already been provided in the application. Avoid providing it again in child modules.`)
          new Error(`This singleton service has already been provided in the application. Avoid providing it again in child modules.`)
        })
      }

      // HttpClient service makes use of observables for all transactions
      // vs. https://developer.mozilla.org/en-US/docs/Web/API/fetch
      // https://stackoverflow.com/questions/47505072/why-should-i-use-httpclient-over-fetch

      console.log (`DisasterDeclarationsSummariesV2Service: Getting observable`)

      this.disasterDeclarationsSummaryObservable$ = this.httpClient.get<DisasterDeclarationsSummary>(`${this.api}$filter=state eq 'WA'`)
      //this.disasterDeclarationsSummaryObservable$ = this.httpClient.get<DisasterDeclarationsSummary>(`${this.apiFile}`)


      //!BUG: we don't have a good this.disasterDeclarationsSummary yet!!!
      this.declarationsSummarySubject$ = new BehaviorSubject(this.disasterDeclarationsSummary)
      this.updateDisasterDeclarationsSummary(this.disasterDeclarationsSummary)

      //debugger
      console.log (`DisasterDeclarationsSummariesV2Service: Got observable: ${this.disasterDeclarationsSummaryObservable$}`)
   }

    ngOnInit(): void {
      // fetch data async after constructior when async pipe subscribes to the disasters$ observable
      //debugger
      //console.log (`DisasterDeclarationsSummariesV2Service: Got observable: ${this.disasterDeclarationsSummaryObservable$}`)
      //this.disasterDeclarationsSummary =
    }

/**
  * notify observers of any changes (REVIEW: Is this likely?!)
  */
  public updateDisasterDeclarationsSummary(newDisasterDeclarationsSummary: DisasterDeclarationsSummary) {
    // Do any needed sanity/validation here
    //debugger
   //localStorage.setItem(this.storageLocalName, JSON.stringify(newSettings))
    this.disasterDeclarationsSummary = newDisasterDeclarationsSummary
    this.declarationsSummarySubject$.next(this.disasterDeclarationsSummary)
    console.log(`Notified subscribers of new Disaster Summaries object ${JSON.stringify(newDisasterDeclarationsSummary)} `)
  }

      /**
   * Expose Observable to 3rd parties, but not the actual subject (which could be abused)
   */
  public getDisasterDeclarationsSummariesV2ServiceObserver(): Observable<DisasterDeclarationsSummary> {
    return this.declarationsSummarySubject$.asObservable()
  }

    getSummaries() {
      this.disasterDeclarationsSummaryObservable$
    }

    ngOnDestroy() {

    }

}

/*
https://polcode.com/resources/blog/is-angular-still-worth-it-in-2022/

import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  getTitle$: Observable<string>;
  getTitleSubject: Subject<string> = new BehaviorSubject<string>('');

  constructor() {
    this.getTitle$ = this.getTitleSubject.asObservable();
  }

  setTitle(title: string): void {
    this.getTitleSubject.next(title);
  }
}
*/


/*
import { Component } from '@angular/core';
import { ArticleService } from "../services/article.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'articles';

  constructor(private articleService: ArticleService) {
    this.articleService.setTitle(this.title);
  }
}
*/
