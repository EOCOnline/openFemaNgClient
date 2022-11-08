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
//import * as DeclSummary from './../../assets/data/DisasterDeclarationsSummariesV2.json'

/**
 * Since we have to do lots of these potentially
 * should we use <generics> or a Factory pattern as described at:
 * https://stackblitz.com/edit/rjlopezdev-injector?embed=1&file=src/app/food/food.component.html
 * or https://medium.com/@rjlopezdev/angular-tips-combine-abstract-factory-pattern-injector-to-inject-a-service-depends-on-f0787c6a7390
 * Each one could be a singleton for that particular type of API
 */

/**
 * To interact with OpenFEMA API server we have some options:
 *
 * fetch(): Promise
 * - fully standard, no Angular wrappings, simplest
 * - good for one-time download (as we are doing)
 *
 * HttpClient - Angular's solution, better for ongoing interaction with an API server: GET/POST/etc.
 * - or for a service posting data periodically over time
 *
 * basic Observable gets reexecuted for each recreation & won't show any previous emission from API
 * BehaviorSubject always returns a result on creation
 * https://stackoverflow.com/questions/39494058/behaviorsubject-vs-observable
 *
 * HttpClient service makes use of observables for all transactions
 * vs. https://developer.mozilla.org/en-US/docs/Web/API/fetch
 * https://stackoverflow.com/questions/47505072/why-should-i-use-httpclient-over-fetch
 * https://stackoverflow.com/questions/39494058/behaviorsubject-vs-observable
 *
 * For our 'simple' just get the data, we use fetch.
 */

@Injectable({
  providedIn: 'root'
})
export class DisasterDeclarationsSummariesV2Service implements OnInit, OnDestroy {

  apiURL = "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries"
  apiFile = "./../../assets/DisasterDeclarationsSummariesV2.json"

  disasterDeclarationsSummary!: DisasterDeclarationsSummary
  disasterDeclarationsSummaryObservable$!: Observable<DisasterDeclarationsSummary>
  //disasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]
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

    console.log(`DisasterDeclarationsSummariesV2Service Constructor`)
    //let disasterDeclarationsSummary1 = this.useFetch()
    let disasterDeclarationsSummary2 = this.useHttpClient()
    let disasterDeclarationsSummary3 = this.useBehaviorSubject()

    //debugger
  }

  useHttpClient() {
    // Ang Dev w/ TS, pg 278
    // call from ngOnInit?
    this.httpClient.get<DisasterDeclarationsSummary>(this.apiURL)
      .subscribe({
        next: (v) => {
          // ! This gets -- but does NOT save the subscribed object!
          //console.log(v)
          console.log(`disaster via HttpClient: ${v.DisasterDeclarationsSummaries[0].femaDeclarationString}; state: ${v.DisasterDeclarationsSummaries[0].state}; #:${v.DisasterDeclarationsSummaries[0].disasterNumber}`)
          return v
        },
        error: (e) => console.error(`Subscription via HttpClient got error: ${e}`),
        complete: () => console.info('Subscription via HttpClient complete')
      }
        // // https://rxjs.dev/deprecations/subscribe-arguments: use only one argument
        // v => console.error(`disaster via httpClient: ${v.DisasterDeclarationsSummaries[0].femaDeclarationString}; state: ${v.DisasterDeclarationsSummaries[0].state}; #:${v.DisasterDeclarationsSummaries[0].disasterNumber}`),
        // (err: HttpErrorResponse) => console.error(`disaster via httpClient error: ${err}`)
      )
    //return v
  }


  useBehaviorSubject() {
    console.log(`DisasterDeclarationsSummariesV2Service useBehaviorSubject`)
    this.disasterDeclarationsSummaryObservable$ = this.httpClient.get<DisasterDeclarationsSummary>(`${this.apiURL}`)
    this.declarationsSummarySubject$ = new BehaviorSubject(this.disasterDeclarationsSummary)
    // this.declarationsSummarySubject$ = new BehaviorSubject(this.httpClient.get<DisasterDeclarationsSummary>(this.apiURL)   )

    this.disasterDeclarationsSummaryObservable$.subscribe({
      next: (v) => {
        // ! This gets -- but does NOT save the subscribed object!
        //console.log(v)
        console.log(`disaster via BSubject: ${v.DisasterDeclarationsSummaries[0].femaDeclarationString}; state: ${v.DisasterDeclarationsSummaries[0].state}; #:${v.DisasterDeclarationsSummaries[0].disasterNumber}`)
      },
      error: (e) => console.error(`Subscription via BSubject got error: ${e}`),
      complete: () => console.info('Subscription via BSubject complete')
    })

    // this.declarationsSummarySubject$ = new BehaviorSubject(this.disasterDeclarationsSummary)
    // Now save the observable for others to grab...
    this.updateDisasterDeclarationsSummary(this.disasterDeclarationsSummary)
    return this.disasterDeclarationsSummary
  }

  /*
      // https://www.delftstack.com/howto/typescript/typescript-fetch/
      fetchDisasterDeclarationsSummary<T>(resourceUrl: string): Promise<T> {
        // return fetch(resourceUrl).then(response => {
        //     // fetching the reponse body data
        //     // return response.json<T>() //error TS2558: Expected 0 type arguments, but got 1
        //     this.disasterDeclarationsSummary = response.json<T>()
        //   })
      }

      useFetch(): DisasterDeclarationsSummary | null {
        console.log (`DisasterDeclarationsSummariesV2Service useFetch`)
        this.fetchDisasterDeclarationsSummary<DisasterDeclarationsSummary>(`${this.apiURL}`)
          .then((summaryItem: DisasterDeclarationsSummary) => {
            // assigning the response data `summaryItem` directly to `myNewToDo` variable which is
            // of Todo type
            let allSummaries:DisasterDeclarationsSummary = summaryItem
            for (let i=0; i<5; i++) {
              let sumry = allSummaries.DisasterDeclarationsSummaries[i]
              console.log(`\n ${i}) disasterNumber: ${sumry.disasterNumber}  femaDeclarationString: ${sumry.femaDeclarationString};  declarationType: ${sumry.declarationType};  declarationDate: ${sumry.declarationDate};  state: ${sumry.state}`);
            }
            return allSummaries
          })
          return null
      }
  */

  /*

  //   try {
  //      const posts = await this.apiService.get('/posts');
          // work with posts
  //    } catch (error) {
          // handle error
  //    }
  //    console.log('this happens **after** the request completes');




    formatMovie(movie: any): Movie {
      return { title: movie.title, id: movie.id };
    }

    class MovieService {
      getMovies(genre: string): Promise<Movie[]> {
        return fetch(`https://www.movies.com/${genre}`)
            .then(res => res.json())
            .then(res => res.map((movie: any) => formatMovie(movie))
      }
    }

    const apiClient = new MovieService();
    //log list of movies
    apiClient.getMovies('sci-fi').then(movies => console.log(movies));
  }
  */

  ngOnInit(): void {
    console.log(`DisasterDeclarationsSummariesV2Service - ngOnInit`)
  }

  /**
    * notify observers of any changes (REVIEW: This is only updated every ~week or less?)
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

  // For this dataset, can return the whole thing at once if desired (NOTE: server returns ONLY 1000 records by default)
  getSummaries(): DisasterDeclarationsSummary {
    return this.disasterDeclarationsSummary
  }

  // For this dataset, can return the whole thing at once if desired (NOTE: server returns ONLY 1000 records by default)
  getSummary(index = 0): DisasterDeclarationsSummaryType {
    return this.disasterDeclarationsSummary.DisasterDeclarationsSummaries[index]
  }

  /*
    test_UNUSED(): DisasterDeclarationsSummary {
      //fails: Error: Should not import the named export 'DisasterDeclarationsSummaries'.'0' (imported as 'DeclSummary') from default-exporting module (only default export is available soon)
      //let Summary0 = DeclSummary.DisasterDeclarationsSummaries[0]
      //console.error `DisasterDeclarationsSummariesV2Service: ${Summary0.femaDeclarationString} -- ${Summary0.disasterNumber}`

      //works
      return DeclSummary
    }
  */

  ngOnDestroy() {

  }
}
