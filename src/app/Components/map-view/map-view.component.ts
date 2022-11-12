/// <reference types="@types/google.maps" />

import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription, throwError } from 'rxjs';

import { GoogleMap } from '@angular/google-maps'
import { MarkerClusterer } from '@googlemaps/markerclusterer'

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service } from 'src/app/services'
import { Common } from "../"

declare const google: any // declare tells compiler "this variable exists (from elsewhere) & can be referenced by other code. There's no need to compile this statement"
/*
google-maps: OLD
google.maps: BEST

GoogleMapsModule (their Angular wrapper) exports three components that we can use:
- GoogleMap: this is the wrapper around Google Maps, available via the google-map selector
- MapMarker: used to add markers on the map, available via the map-marker selector
- MapInfoWindow: the info window of a marker, available via the map-info-window selector

@google/markerclusterer: OLD
@googlemaps/markerclustererplus: OLD
@googlemaps/markerclusterer: BEST

  https://googlemaps.github.io/js-markerclusterer/
  https://developers.google.com/maps/support/
  https://angular-maps.com/
  https://github.com/atmist/snazzy-info-window#html-structure // Customizable google map info windows
  https://angular-maps.com/api-docs/agm-core/interfaces/lazymapsapiloaderconfigliteral
 https://github.com/timdeschryver/timdeschryver.dev/blob/main/content/blog/google-maps-as-an-angular-component/index.md
 TODO: Allow geocoding: https://rapidapi.com/blog/google-maps-api-react/
 Option doc: https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions

 per https://stackoverflow.com/a/44339169/18004414
 https://developers.google.com/maps/documentation/javascript/overview supports client-side usage
 https://console.cloud.google.com/google/maps-apis/ does *NOT* support client side usage?!
*/

// Zip codes to lat/long:
// https://developer.trimblemaps.com/restful-apis/mapping/polygon/zip-code/
// https://pcmiler.alk.com/apis/rest/v1.0/Service.svc
// https://gis.stackexchange.com/questions/102740/creating-zip-code-level-choropleth-using-leaflet-js
// https://catalog.data.gov/dataset/tiger-line-shapefile-2019-2010-nation-u-s-2010-census-5-digit-zip-code-tabulation-area-zcta5-na

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
  providers: [DisasterDeclarationsSummariesV2Service],
})
export class MapViewComponent implements OnInit, OnDestroy {
  // @Input('data') disasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]
  //@Input('data') disasters!: DisasterDeclarationsSummaryType[]

  private declarationsSummariesSubscription!: Subscription
  private disasterDeclarationsSummary!: DisasterDeclarationsSummary
  //disasterDeclarationsSummaries!: DisasterDeclarationsSummaryType[]

  constructor(
    //private httpClient: HttpClient,
    private disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service,
  ) {

    // Following works: based on reading an actual JSON file
    /*
    let myTest = disasterDeclarationsSummariesV2Service.test()
      console.error (`MapViewComponent: ${JSON.stringify(myTest.DisasterDeclarationsSummaries[0])}`)
    */

    console.log(`MapViewComponent: Getting declarationsSummariesSubscription`)

    this.declarationsSummariesSubscription = disasterDeclarationsSummariesV2Service.getDisasterDeclarationsSummariesV2ServiceObserver().subscribe({
      next: (newDisasterDeclarationsSummary) => {
        this.disasterDeclarationsSummary = newDisasterDeclarationsSummary
        this.displayDataSet()
        //debugger
      },
      error: (e) => console.error('declarationsSummariesSubscription got:' + e),
      complete: () => console.info('declarationsSummariesSubscription complete')
    })

    console.log(`MapViewComponent: Got declarationsSummariesSubscription, awaiting results`)
  }

  ngOnInit(): void {
    // fetch data async after constructior when async pipe subscribes to the disasters$ observable
    // debugger
    console.error(`MapViewComponent: Got observable: ${this.disasterDeclarationsSummary}   ${JSON.stringify(this.disasterDeclarationsSummary)}`)
  }

  displayDataSet() {
    console.log(`MapViewComponent: Received new disasterDeclarationsSummary via subscription. \n metadata: \n ${JSON.stringify(this.disasterDeclarationsSummary.metadata)}`)
    console.log(`MapViewComponent: Received new disasterDeclarationsSummary via subscription. \n DisasterDeclarationsSummaries: \n ${JSON.stringify(this.disasterDeclarationsSummary.DisasterDeclarationsSummaries)}`)

    this.disasterDeclarationsSummaries = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
  }

  ngOnDestroy(): void {
    this.declarationsSummariesSubscription?.unsubscribe()
  }

}
