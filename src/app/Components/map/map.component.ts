import { HttpClient } from '@angular/common/http'
import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Observable, Subscription, throwError } from 'rxjs';

import { GoogleMap, MapMarker } from '@angular/google-maps' //https://github.com/angular/components/blob/main/src/google-maps/
import { MarkerClusterer } from '@googlemaps/markerclusterer'

import { DisasterDeclarationsSummary, DisasterDeclarationsSummaryType, DisasterTypes, DisasterDeclarationsSummariesV2Service, WebDisasterSummariesService } from '../../services';
import { Common } from ".."


/** Details:
   * https://github.com/angular/components/blob/main/src/google-maps/ (Angular wrapper for following library)
   * https://developers.google.com/maps/documentation/javascript
   * https://github.com/timdeschryver/timdeschryver.dev/blob/main/content/blog/google-maps-as-an-angular-component/index.md#methods-and-getters
   * https://stackblitz.com/edit/angular-9-google-maps-5v2cu8
   * https://developers.google.com/maps/documentation/javascript/marker-clustering
   */

/** Ideas:
 * https://googlemaps.github.io/js-markermanager/
 * https://github.com/googlemaps/js-markerwithlabel
 * https://github.com/googlemaps/js-typescript-guards
 * https://developers.google.com/maps/documentation/javascript/dds-boundaries/region-lookup
 * https://developers.google.com/maps/documentation/javascript/dds-boundaries/start
 */

//declare const google: any // declare tells compiler "this variable exists (from elsewhere) & can be referenced by other code. There's no need to compile this statement"

/*
google-maps: OLD
google.maps: BEST

GoogleMapsModule (their Angular wrapper) exports three components that we can use:
- GoogleMap: this is the wrapper around Google Maps, available via the google-map selector
- MapMarker: used to add markers on the map, available via the map-marker selector
- MapInfoWindow: the info window of a marker, available via the map-info-window selector
These already imported in app.module.ts
from https://timdeschryver.dev/blog/google-maps-as-an-angular-component

@google/markerclusterer: OLD
@googlemaps/markerclustererplus: OLD
@googlemaps/markerclusterer: BEST

https://github.com/angular/components/blob/main/src/google-maps/
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

// Fip codes to lat/long:
// https://www.smarty.com/articles/county-fips-codes

//standalone: true,
//imports: [CommonModule, RouterModule],

type latLngType = { lat: number; lng: number } | null
type fipsType = { lat: number; lng: number } | null

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  // Get reference to map components, for later use
  @ViewChild(GoogleMap, { static: false }) ngMap!: GoogleMap

  mouseLatLng!: google.maps.LatLngLiteral
  readonly FipsCodes = require('../../../assets/data/fips_mapB.json')
  //private zips!: number[]
  private fips!: number[]

  // this.ngMap: GoogleMap (Angular wrapper for the same underlying map!)
  // this.gMap: google.maps.Map (JavaScript core map) - made available in onMapInitialized()
  gMap!: google.maps.Map

  mapOptions: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    mapTypeId: google.maps.MapTypeId.TERRAIN,  // https://developers.google.com/maps/documentation/javascript/maptypes
    zoom: 4,
    maxZoom: 21,
    minZoom: 3,
    center: { lat: 40, lng: -100 },
  }

  infowindow = new google.maps.InfoWindow({ maxWidth: 150, })

  private declarationsSummariesSubscription!: Subscription
  disasterDeclarationsSummary!: DisasterDeclarationsSummary
  disasterArray!: DisasterDeclarationsSummaryType[]

  // Google MapMarker only wraps google.maps.LatLngLiteral (positions) - NOT google.maps.Marker: styles, behaviors, etc. -- But might be able to set marker options: see https://github.com/angular/components/blob/main/src/google-maps/README.md#the-options-input
  markers: google.maps.Marker[] = []
  markerCluster!: MarkerClusterer
  // markerPositions: google.maps.LatLngLiteral[] angular brain-dead wrapper
  markerClustererImagePath =
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
  //apiLoaded //: Observable<boolean> // used by template
  iconBase = "../../../assets/icons/"
  //  public zoom = 10


  constructor(
    readonly disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service,
    httpClient: HttpClient,
  ) {
    console.log(`======== Constructor() ============ Google Map, using version ${google.maps.version}`)

    this.declarationsSummariesSubscription = this.disasterDeclarationsSummariesV2Service.getDisasterDeclarationsSummariesV2ServiceObserver().subscribe({
      next: (newDisasterDeclarationsSummary) => {
        this.disasterDeclarationsSummary = newDisasterDeclarationsSummary
        this.displayDataSet()
      },
      error: (e) => console.error('declarationsSummariesSubscription got:' + e),
      complete: () => console.info('declarationsSummariesSubscription complete')
    })
    console.log(`MapViewComponent: Requested declarationsSummariesSubscription, awaiting results`)

    // fips[] : a sorted array of fips codes used (via a binary search) to rapidly find the row/index within the FipCodes object.
    // https://stackoverflow.com/a/46694321/18004414
    // https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as
    //this.fips = this.FipsCodes.map((item: { fip: any; }) => item.fip)

    // less 'elegant' - but faster...
    this.fips = []
    for (let i = 0; i < this.FipsCodes.length; i++) {
      this.fips.push(Number(this.FipsCodes[i].fip))
    }
    //TODO: Just save this to disk, rather than recalcing...
  }

  ngOnInit(): void {
    console.log("Map: ngOnInit()")
  }

  displayDataSet() {
    console.log(`MapViewComponent: Received new disasterDeclarationsSummary via subscription.`) // \n metadata: \n ${JSON.stringify(this.disasterDeclarationsSummary.metadata)}`)

    this.disasterArray = this.disasterDeclarationsSummary.DisasterDeclarationsSummaries
    this.startMapping()
  }

  /**
   * This routine is called by google once <google-map> (in the html) has been instanciated
   * @param mappy
   */
  // this.ngMap: GoogleMap (Angular wrapper for the same underlying map!)
  // this.gMap: google.maps.Map (JavaScript core map) - made available in onMapInitialized()
  onMapInitialized(mappy: google.maps.Map) {
    console.log(`onMapInitialized()`)
    this.gMap = mappy
    this.startMapping()
  }

  startMapping() {
    // called if we've Map OR Disasters, it only proceeds if both are valid...
    console.log(`startMapping: verify we've both map and disaster array...`)

    if (!this.disasterArray) {
      console.warn(`startMapping hasn't got disasters yet!`)
      return
    }

    if (!this.gMap) {
      console.error(`showMarkers() got null gMap`)
      return
    }

    console.log(`startMapping has reference to map and disasters, so all set. Onward...[on 'wrong' thread though?!]`)

    // https://github.com/googlemaps/js-markerclusterer
    // https://newbedev.com/google-markerclusterer-decluster-markers-below-a-certain-zoom-level
    this.markerCluster = new MarkerClusterer({
      map: this.gMap,
      markers: this.markers,
      // algorithm?: Algorithm,
      // renderer?: Renderer,
      // onClusterClick?: onClusterClickHandler,
    })

    this.buildMarkerArray()

    this.markerCluster.addMarkers(this.markers)
    console.log(`displayMarkers added ${this.disasterArray.length} markers`)

    // no ongoing activity?!
  }


  // ------------------------------------  Markers  ---------------------------------------

  // Deletes all markers in the array by removing references to them.
  // https://developers.google.com/maps/documentation/javascript/markers#remove
  // REVIEW: Need to explicitly set each marker to null? https://developers.google.com/maps/documentation/javascript/markers#remove
  removeAllMarkers() {
    console.log(`removeAllMarkers()`)
    // /this.hideMarkers()
    this.markers = []
    // this.gMap.clear();
    this.markerCluster.clearMarkers()
  }

  // tempI = 0
  fip2LatLng(fip: number): latLngType {
    let index = Common.binarySearchIterative(this.fips, fip)
    //  if (this.tempI++ < 10) { console.log(`fip2LatLng for ${fip} got index= ${index}`) }

    if (index == -1) {
      return null // no such fipcode...
    }
    //debugger
    //let latlng = new google.maps.LatLng(this.ZipCode.zip[index].lat, this.ZipCode.zip[index].lng)  //lat: 40, lng: -100
    let latlng = { lat: this.FipsCodes[index].lat, lng: this.FipsCodes[index].long }  //lat: 40, lng: -100
    //if (this.tempI++ < 10) { console.log(`zip2LatLng for ${JSON.stringify(this.FipsCodes[index])} markers`) }
    return latlng
  }

  buildMarkerArray() {
    console.log(`displayMarkers got ${this.disasterArray.length} disasters to display`)
    this.removeAllMarkers()

    //for (let disaster of this.disasterArray) {
    for (let i = 0; i < this.disasterArray.length; i++) {
      // !TODO: Could add filters here?
      let disaster = this.disasterArray[i]
      let fip: number = Number(disaster.fipsStateCode) * 1000 + Number(disaster.fipsCountyCode)
      let latlng = this.fip2LatLng(fip)
      if (latlng == null) {
        console.error(`Disaster declaration ${disaster.femaDeclarationString}: ${disaster.declarationTitle} had an fipCode ${disaster.fipsStateCode},${disaster.fipsCountyCode} that was not found in our FIPc listing! IGNORING.`)
        continue
      }
      if (i < 10) {
        console.log(`zip2LatLng got ${JSON.stringify(latlng)} for disaster fip code ${fip}`)
      }

      // Style="getDisasterColorStyle(disaster.incidentType)"
      let tooltipHtml =
        `${i} - ${disaster.incidentType}<br>
        ${disaster.femaDeclarationString}: ${disaster.declarationTitle}<br>
        ${disaster.placeCode} - ${disaster.designatedArea}, ${disaster.state} <br>`

      /*
        ${disaster.incidentBeginDate | date: 'shortDate'} to ${ disaster.incidentEndDate | date: 'shortDate' };
        Closed ${ disaster.disasterCloseoutDate | date: 'shortDate' } <br>
        FIPS: ${ disaster.fipsCountyCode } & ${ disaster.fipsStateCode };
        Request # ${ disaster.declarationRequestNumber } <br>
        <a href="/details/${i}" > See all detail fields < /a>`

        const svgMarker = {
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(15, 30),
  };
      */

      let labelText = disaster.femaDeclarationString
      let icon = this.iconBase + this.getDisasterTypeIcon(disaster.incidentType)
      let labelColor = this.getDisasterTypeColor(disaster.incidentType)

      if (i < 10) { console.log(`displayMarkers adding marker #${i} at ${JSON.stringify(latlng)} with ${tooltipHtml}, ${disaster.femaDeclarationString}, ${labelColor}, ${icon}`) }
      this.addMarker(latlng.lat, latlng.lng, tooltipHtml, disaster.femaDeclarationString, disaster.femaDeclarationString, labelColor, "14px", icon)
    }
  }

  // --------------------------------  addMarker  ------------------------------
  /**
   *
   * @param lat
   *
   * @param lng\u\0\calls
   * @param infoContent
   * @param labelText
   * @param title
   * @param labelColor
   * @param fontSize
   * @param icon
   * @param animation
   * @param msDelay
   */
  addMarker(lat: number, lng: number, infoContent = "", labelText = "", title = "", labelColor = "aqua", fontSize = "8px", icon = "unpublished_FILL0_wght400_GRAD0_opsz48.png", animation = google.maps.Animation.DROP, msDelay = 100) {

    //console.log(`addMarker`)

    //if (infoContent == "") { infoContent = `Manual Marker dropped ${lat}, ${lng} at ${Date()} ` }
    /*  Somehow this breaks following code!!!
        let myIcon5 = new google.maps.Icon({
          url: this.iconBase + icon,
          anchor: new google.maps.Point(5, 5),
        })
        */

    // https://developers.google.com/maps/documentation/javascript/examples/marker-symbol-custom
    const svgMarker = {
      //url: icon, //this.iconBase +
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: labelColor,
      fillOpacity: 0.7,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      //anchor: new google.maps.Point(5, 0),
    };


    // https://developers.google.com/maps/documentation/javascript/examples/marker-modern
    // https://material.angular.io/components/icon/overview
    // https://developers.google.com/fonts/docs/material_icons
    // https://fonts.google.com/icons
    if (lat && lng) {
      let time = Common.time()

      // https://developers.google.com/maps/documentation/javascript/reference/marker
      let m = new google.maps.Marker({
        // draggable: true,
        animation: animation,
        // map: this.gMap,
        position: { lat: lat, lng: lng },
        title: infoContent, // Hover/Rollover text

        // https://developers.google.com/maps/documentation/javascript/reference/marker#Icon
        // icon: this.iconBase + icon,  // works
        icon: svgMarker, // works
        //icon: icon, //svgMarker, // works
        // icon: google.maps.SymbolPath.CIRCLE,  // gets ignored
        /*
                icon_BROKEN: {  // gets ignored
                  // from: https://jsfiddle.net/geocodezip/voeqsw6j/
                  // & https://stackoverflow.com/questions/34001414/google-maps-api-v-3-changing-the-origin-of-custom-marker-icon
                  //path: this.iconBase + icon,
                  //url: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  labelOrigin: new google.maps.Point(10, 30),
                  //strokeColor: myPoint.color,
                  //fillColor: myPoint.color,
                  fillOpacity: 0.6,
                  scale: this.gMap.getZoom()! / 2,
                  strokeWeight: this.gMap.getZoom()! / 3,
                  //rotation: myPoint.heading,
                },
        */
        label: {
          // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
          //! BUG: a letter or number that appears inside a marker: We're putting a phrase in!!!
          // anchor: new google.maps.Point(50, 50),
          //labelOrigin: new google.maps.Point(0, 0),
          // origin: new google.maps.Point(5, 20), // refocuses map on this point, if set to lat/lng, not 100/200!
          // scaledSize: new google.maps.Size(50, 50),
          // label: this.labels[this.labelIndex++ % this.labels.length],
          text: labelText, // shows up along with icon
          // https://fonts.google.com/icons: rocket, join_inner, noise_aware, water_drop, etc.
          fontFamily: 'Jacques Francois Shadow', // 'Tourney', //"Material Icons",
          color: labelColor,
          fontSize: fontSize,
          //fontWeight: "bold",
        },
      })

      // infoWindow = tooltips
      m.addListener("click",   // this.toggleBounce)
        () => {
          //this.infowindow.setContent(`${ SpecialMsg } `)
          //`Manually dropped: ${ time } at ${ pos } `
          this.infowindow.setContent(infoContent)
          this.infowindow.open({
            // new google.maps.InfoWindow.open({
            //content: 'How now red cow.',
            anchor: m,
            //setPosition: event.latLng,
            //map: this.gMap,
            // shouldFocus: false,
          })
        }
      )
      //this.markerPositions.push(latLng.toJSON()); evil angular wrapper

      // Drop each marker - potentially with a bit of delay to create an anination effect
      //window.setTimeout(() => {

      this.markers.push(m)

      //}, msDelay)

    } else {
      console.error(`event.latLng is BAD. lat: ${lat}; lng: ${lng}. Can not add marker.`)
    }
    //this.refreshMarkerDisplay()
  }


  /**
   *
   *
   * https://github.com/googlemaps/js-markerclusterer - current!
   * https://github.com/angular/components/tree/master/src/google-maps/map-marker-clusterer -
   * Angular components doesn't encapulate options functionality: identical clones only: ugg.
   * MarkerClustererPlus Library - also old
  */
  refreshMap() {

    if (this.gMap) {
      //this.gMap.clear()
      // google.maps.event.trigger(this.gMap, 'resize');
      // this.gMap.setZoom(map.getZoom());
      this.gMap.panBy(0, 0);
    } else {
      console.warn(`ResetMap called, but gMap not created yet!`)
    }
    /*
        let data
        if (this.markerCluster) {
          this.markerCluster.clearMarkers();
        }
        var markers = [];

        var markerImage = new google.maps.MarkerImage(imageUrl,
          new google.maps.Size(24, 32));

        for (var i = 0; i < data.photos.length; ++i) {
          markers.push(new marker());
        }
        var zoom = parseInt(document.getElementById('zoom').value, 10);
        var size = parseInt(document.getElementById('size').value, 10);
        var style = parseInt(document.getElementById('style').value, 10);
        zoom = zoom === -1 ? null : zoom;
        size = size === -1 ? null : size;
        style = style === -1 ? null : style;

        markerClusterer = new MarkerClusterer(map, markers, {
          maxZoom: zoom,
          gridSize: size,
          styles: styles[style],
          imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });
        */
  }

  getDisasterTypeIcon(type: string) {
    return Common.getDisasterType(type)?.icon
  }

  getDisasterTypeColor(type: string) {
    return Common.getDisasterType(type)?.color
  }


  // ------------------ BOUNDS ---------------------------
  /*
    boundsToBound(bounds: LatLngBounds) {
      this.log.verbose(`Bounds conversion-- E: ${ bounds.getEast() }; N: ${ bounds.getNorth() }; W: ${ bounds.getWest() }; S: ${ bounds.getSouth() }; `)
      return { east: bounds.getEast(), north: bounds.getNorth(), south: bounds.getSouth(), west: bounds.getWest() }
    }

    recalcFieldBounds(reports: FieldReportsType) {
      this.log.verbose(`recalcFieldBounds got ${ reports.fieldReportArray.length } field reports`)
      //this.log.excessive(`OLD Value: E: ${ reports.bounds.getEast() }; N: ${ reports.bounds.getNorth() }; W: ${ reports.bounds.getWest() }; S: ${ reports.bounds.getSouth() }; `)

      if (!this.settings) {
        this.log.error('this.settings is undefined')
        throwError(() => new Error('this.settings is undefined'))
        return
      }
      let north
      let west
      let south
      let east

      if (reports.fieldReportArray.length) {
        north = reports.fieldReportArray[0].location.lat
        west = reports.fieldReportArray[0].location.lng
        south = reports.fieldReportArray[0].location.lat
        east = reports.fieldReportArray[0].location.lng

        // https://www.w3docs.com/snippets/javascript/how-to-find-the-min-max-elements-in-an-array-in-javascript.html
        // concludes with: "the results show that the standard loop is the fastest"

        for (let i = 1; i < reports.fieldReportArray.length; i++) {
          if (reports.fieldReportArray[i].location.lat > north) {
            north = Math.round(reports.fieldReportArray[i].location.lat * 10000) / 10000
          }
          if (reports.fieldReportArray[i].location.lat < south) {
            south = Math.round(reports.fieldReportArray[i].location.lat * 10000) / 10000
          }
          if (reports.fieldReportArray[i].location.lng > east) {
            east = Math.round(reports.fieldReportArray[i].location.lng * 10000) / 10000
          }
          if (reports.fieldReportArray[i].location.lng > west) {
            west = Math.round(reports.fieldReportArray[i].location.lng * 10000) / 10000
          }
        }
      } else {
        // no field reports yet! Rely on broadening processing below
        north = this.settings.defLat
        west = this.settings.defLng
        south = this.settings.defLat
        east = this.settings.defLng
      }

      this.log.info(`recalcFieldBounds got E:${ east } W:${ west } N:${ north } S:${ south } `)
      if (east - west < 2 * this.boundsMargin) {
        east += this.boundsMargin
        west -= this.boundsMargin
        this.log.info(`recalcFieldBounds BROADENED to E:${ east } W:${ west } `)
      }
      if (north - south < 2 * this.boundsMargin) {
        north += this.boundsMargin
        south -= this.boundsMargin
        this.log.info(`recalcFieldBounds BROADENED to N:${ north } S:${ south } `)
      }

      reports.bounds = new L.LatLngBounds([[south, west], [north, east]])//SW, NE
      this.log.excessive(`New bounds: E: ${ reports.bounds.getEast() }; N: ${ reports.bounds.getNorth() }; W: ${ reports.bounds.getWest() }; S: ${ reports.bounds.getSouth() }; `)
    }
  */

}
