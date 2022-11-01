import { Injectable, OnDestroy, OnInit, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http'  // https://angular.io/guide/http
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { metadataType, DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService } from './'

/**
 * To import json files:
 * 1) Import statement requires "compilerOptions": {..., "resolveJsonModule": true, ... in tsconfig.json
 *    per https://mariusschulz.com/blog/importing-json-modules-in-typescript
 *    (acknowledging potential memory suck fo importing large json files)
 * 2) or prepend the data in your JSON file with export default, and then save the file as data.js
 *    instead of data.json, and then import it as a standard module: import {default as data} from './data.js'
 * 3) or use window.fetch
 *
 * Details: https://stackoverflow.com/questions/71098595/purpose-of-resolvejsonmodule
 */
import * as DeclSummary from './../../assets/DisasterDeclarationsSummariesV2.json'

/**
 * Since we have to do lots of these potentially
 * should we use <generics> or a Factory pattern as described at:
 * https://stackblitz.com/edit/rjlopezdev-injector?embed=1&file=src/app/food/food.component.html
 * or https://medium.com/@rjlopezdev/angular-tips-combine-abstract-factory-pattern-injector-to-inject-a-service-depends-on-f0787c6a7390
 * Each one could be a singleton for that particular type of API
 */


@Injectable({
  providedIn: 'root'
})
export class DisasterDeclarationsSummariesV2Service implements OnInit, OnDestroy{

  /**
   * Use a BehaviorSubject over a basic Observable, as later gets re-executed for each creation
   * https://stackoverflow.com/questions/39494058/behaviorsubject-vs-observable
   */

  disasterDeclarationsSummary!: DisasterDeclarationsSummary
  disasterDeclarationsSummaryObservable$!: Observable<DisasterDeclarationsSummary>
  disasterDeclarationsSummaries!: [DisasterDeclarationsSummaryType];
  api = "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries"
  apiFile = "./../../assets/DisasterDeclarationsSummariesV2.json"
  //apiFile = "./../../assets/FemaWebDisasterSummaries.json"

  //public dataObsevable: BehaviorSubject<boolean> = new BehaviorSubject<boolean> (null)


  private declarationsSummarySubject$!: BehaviorSubject<DisasterDeclarationsSummary>

   /**
   * Optional alternative - for testing, etc.:
   * https://medium.com/@amcdnl/mocking-with-angular-more-than-just-unit-testing-cbb7908c9fcc
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


      this.disasterDeclarationsSummaryObservable$ = this.httpClient.get<DisasterDeclarationsSummary>(`${this.api}`)

      this.declarationsSummarySubject$ = new BehaviorSubject(this.disasterDeclarationsSummary)

      this.disasterDeclarationsSummaryObservable$.subscribe({
          next: (v) => {
            // ! This gets -- but does NOT save the subscribed object!
            //console.log(v)
            console.error(`disaster: ${v.DisasterDeclarationsSummaries[0].femaDeclarationString}; state: ${v.DisasterDeclarationsSummaries[0].state}; #:${v.DisasterDeclarationsSummaries[0].disasterNumber}`)
          },
          error: (e) => console.error(`Subscription got error: ${e}`),
          complete: () => console.info('Subscription complete')
      })

      // this.declarationsSummarySubject$ = new BehaviorSubject(this.disasterDeclarationsSummary)
      // Now save the observable for others to grab...
      this.updateDisasterDeclarationsSummary(this.disasterDeclarationsSummary)
   }

    ngOnInit(): void {
      console.log(`DisasterDeclarationsSummariesV2Service - ngOnInit`)
    }

/**
  * notify observers of any changes (REVIEW: Is this likely?!)
  */
  public updateDisasterDeclarationsSummary(newDisasterDeclarationsSummary: DisasterDeclarationsSummary) {
    // Do any needed sanity/validation here
    //localStorage.setItem(this.storageLocalName, JSON.stringify(newSettings))
    this.disasterDeclarationsSummary = newDisasterDeclarationsSummary
    this.declarationsSummarySubject$.next(this.disasterDeclarationsSummary)
    console.log(`Notified subscribers of new Disaster Summaries object ${JSON.stringify(newDisasterDeclarationsSummary)} `)
  }

 /**
   * Expose Observable to 3rd parties, but not the actual subject (which could be abused)
   */
  public getDisasterDeclarationsSummariesV2ServiceObserver(): Observable<DisasterDeclarationsSummary> {
    return this.disasterDeclarationsSummaryObservable$
    //!return this.declarationsSummarySubject$.asObservable()
  }

    getSummaries() {
      this.disasterDeclarationsSummaryObservable$
    }

    test_UNUSED():DisasterDeclarationsSummary {
      // fails: Error: Should not import the named export 'DisasterDeclarationsSummaries'.'0' (imported as 'DeclSummary') from default-exporting module (only default export is available soon)
      // let Summary0 = DeclSummary.DisasterDeclarationsSummaries[0]
      // console.error `DisasterDeclarationsSummariesV2Service: ${Summary0.femaDeclarationString} -- ${Summary0.disasterNumber}`

      // works
      return DeclSummary
    }

    ngOnDestroy() {

    }
}
