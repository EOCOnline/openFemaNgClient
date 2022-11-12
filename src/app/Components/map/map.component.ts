import { CommonModule } from '@angular/common';
import { DisasterDeclarationsSummaryType, DisasterTypes, WebDisasterSummariesService } from 'src/app/services';
import { RouterModule } from '@angular/router';
//import { ListViewComponent } from '..';
import { DOCUMENT, JsonPipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'

import { Common } from ".."
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { GoogleMap } from '@angular/google-maps';
import { DisasterDeclarationsSummary } from '../../services/disaster-declarations-summaries-v2.interface';

//standalone: true,
//imports: [CommonModule, RouterModule],

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  //providers:[DisasterDeclarationsSummariesV2Service],
})
export class MapComponent implements OnInit {
  @Input() disasters!: DisasterDeclarationsSummary
  // Get reference to map components, for later use
  @ViewChild(GoogleMap, { static: false }) ngMap!: GoogleMap
  @ViewChild(GoogleMap, { static: false }) overviewNgMap!: GoogleMap
  /** Details:
   * https://github.com/timdeschryver/timdeschryver.dev/blob/main/content/blog/google-maps-as-an-angular-component/index.md#methods-and-getters
   * https://github.com/angular/components/blob/master/src/google-maps/google-map/README.md
   * https://stackblitz.com/edit/angular-9-google-maps-5v2cu8?file=src%2Fapp%2Fapp.component.ts
   */

  mouseLatLng!: google.maps.LatLngLiteral

  // this.ngMap: GoogleMap (Angular wrapper for the same underlying map!)
  // this.gMap: google.maps.Map (JavaScript core map) - made available in onMapInitialized()
  gMap!: google.maps.Map

  mapOptions: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    mapTypeId: google.maps.MapTypeId.TERRAIN,  // https://developers.google.com/maps/documentation/javascript/maptypes
    zoom: 12,
    maxZoom: 21,
    minZoom: 4,
    //draggableCursor: 'crosshair', //https://www.w3.org/TR/CSS21/ui.html#propdef-cursor has others...
    //heading: 90,
  }

  //infowindow = new google.maps.InfoWindow({ maxWidth: 150, })

  disasterArray!: DisasterDeclarationsSummaryType[]
  // Google MapMarker only wraps google.maps.LatLngLiteral (positions) - NOT google.maps.Marker: styles, behaviors, etc. -- But might be able to set marker options?
  markers: google.maps.Marker[] = []
  markerCluster!: MarkerClusterer
  // markerPositions: google.maps.LatLngLiteral[] angular brain-dead wrapper
  markerClustererImagePath =
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
  // markerOptions = { draggable: false }

  labelIndex = 0;
  apiLoaded //: Observable<boolean> // used by template

  iconBase = "../../../assets/icons/"

  //  protected map!: Map
  //  public location!: LocationType
  //  public center = { lat: 0, lng: 0 }
  //  public mouseLatLng = this.center // google.maps.LatLngLiteral |
  public zoom = 10 // actual zoom level of main map
  //  public zoomDisplay = 10 // what's displayed below main map


  constructor(
    //readonly webDisasterSummariesService: WebDisasterSummariesService,
    httpClient: HttpClient,
    @Inject(DOCUMENT) protected document: Document
  ) {
    console.log(`======== Constructor() ============ Google Map, using version ${google.maps.version}`)

    // https://github.com/angular/components/tree/master/src/google-maps/map-marker-clusterer
    // this.markerPositions = []; evil angular wrapper

    // https://github.com/googlemaps/js-markerclusterer
    // use default algorithm and renderer
    /*

    constructor MarkerClusterer(map: google.maps.Map, markers?: google.maps.Marker[] | undefined, options?: MarkerClustererOptions | undefined): MarkerClusterer
Class for clustering markers on a Google Map.

See googlemaps.github.io/v3-utility-library/classes/_google_markerclustererplus.markerclusterer.html

*/

    // https://developers.google.com/maps/documentation/javascript/examples/map-latlng-literal
    // https://developers.google.com/maps/documentation/javascript/reference/coordinates

    // this.circleCenter: google.maps.LatLngLiteral = {lat: this.settings.defLat, lng: this.settings.defLng};
    // https://github.com/angular/components/tree/master/src/google-maps
    // this.apiLoaded = httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${SettingsService.secrets[3].key}`, 'callback')
    // this.apiLoaded = true
    /*
    httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=YOUR_API_HERE`, "callback")
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
    */
    // google.maps.event.addDomListener(window, 'load', this.initMap);
    // this.LoadMap()
    //super('MyName')

    this.apiLoaded = true  //! bogus...
    /*) {
      if (!this.index) {
        this.index = -1
      }
      */
  }

  ngOnInit(): void {
    console.log("ngOnInit()")
    //this.center = { lat: this.settings.defLat, lng: this.settings.defLng }
    //this.mouseLatLng = this.center


  }
  // ---------------- Init Main Map -----------------

  /**
 *
 * @returns
 */
  initMainMap() {
    console.log("(Abstract) initMainMap()")

    // if (!this.webDisasterSummariesService) {
    //   console.error(`initMainMap(): webDisasterSummariesService not yet initialized while initializing the Map!`)
    //   return
    // }


    // Auto-center maps on bounding coordinates centroid of all markers, then zoom map to show all points
    // this.center = { lat: this.settings ? this.settings.defLat : 0, lng: this.settings ? this.settings.defLng : 0 }
    // this.mouseLatLng = this.center
    // this.zoom = this.settings ? this.settings.google.defZoom : 15
    // this.zoomDisplay = this.settings ? this.settings.google.defZoom : 15


    if (!this.disasterArray) {
      console.error(`initMainMap(): disasterArray not yet initialized !`)
      return
    }

    if (this.gMap) {
      /*
      ERROR TypeError: Cannot read properties of undefined (reading 'setCenter')
      at GmapComponent.initMainMap (gmap.component.ts:237:15)
      */

      //this.gMap.setCenter({ lat: this.settings ? this.settings.defLat : 0, lng: this.settings ? this.settings.defLng : 0 })
      //this.gMap.setZoom(this.settings ? this.settings.google.defZoom : 15)
      this.gMap.fitBounds(this.disasterArray.boundsToBound(this.fieldReports!.bounds))
      //      this.gMap.setMapTypeId("roadmap")
      //this.gMap.setMapTypeId('terrain')
    } else {
      console.error(`initMainMap(): this.gMap NOT INitialized yet! `)
    }
  }

  /**
   *
   * @param mappy
   */
  // this.ngMap: GoogleMap (Angular wrapper for the same underlying map!)
  // this.gMap: google.maps.Map (JavaScript core map) - made available in onMapInitialized()
  onMapInitialized(mappy: google.maps.Map) {
    console.log(`onMapInitialized()`)

    this.gMap = mappy
    // Listen in on mouse moves/zooms
    //this.captureGMoveAndZoom(this.gMap)

    // gets: core.mjs:6485 ERROR TypeError: bounds.getEast is not a function at FieldReportService.boundsToBound (field-report.service.ts:193:56)
    // this.gMap.fitBounds(this.fieldReportService.boundsToBound(this.fieldReports!.bounds))

    // https://github.com/googlemaps/js-markerclusterer
    // https://newbedev.com/google-markerclusterer-decluster-markers-below-a-certain-zoom-level
    this.markerCluster = new MarkerClusterer({
      map: this.gMap,
      markers: this.markers,
      // algorithm?: Algorithm,
      // renderer?: Renderer,
      // onClusterClick?: onClusterClickHandler,
    })

    this.getAndDisplayDisasterReports() // REVIEW: Works with NO Markers?


    //  console.log("into updateDisasterReports()")

    this.updateDisasterReports()

  }
  /* TODO: Emit update for subscribers: instead of always reloading at init stage...
      this.disasterArray = this.fieldReportService.getDisasterReports().valueChanges.subscribe(x => {
        console.log(`Subscription to location got: ${x}`)
      })
      */

  getAndDisplayDisasterReports() {

  }

  updateDisasterReports() {

  }
  // ------------------------------------  Markers  ---------------------------------------

  // !REVIEW: Need to explicitly set each marker to null? https://developers.google.com/maps/documentation/javascript/markers#remove
  clearMarkers() {
    this.markers = []
  }

  displayMarkers() {
    console.log(`(Abstract) displayMarkers()`)

    let latlng
    let infoContent
    let labelText
    let title
    let icon
    let labelColor
    let disaster: DisasterDeclarationsSummaryType

    let disasterTypes = DisasterTypes //
    // REVIEW: Might this mess with existing disaster's? (User instructed NOT to rename existing statuses...)
    console.log(`displayMarkers got ${this.disasterArray.length} field reports to display`)

    if (!this.disasterArray) {
      console.error(`displayMarkers() BUT No disasterArray yet!`)
      return
    }

    //! this.addMarker(this.fieldReports[i].location.lat, this.fieldReports[i].location.lng, this.fieldReports[i].status)


    //! TODO: Start by hiding/clearing existing markers & rebuilding....
    //this.markerCluster.clearMarkers()
    this.removeAllMarkers()

    //if (!this.disasterArray.length) {
    //this.removeAllMarkers()
    //this.markerCluster.removeMarkers(this.markers)
    //}

    // this.markerCluster.addMarkers(this.markers)

    for (let i = 0; i < this.disasterArray.length; i++) {

      // !TODO: Add filters: Only show selected teams, for last hours:minutes, with status XYZ,
      // or assume any selection/filtering in the Reports page...

      disaster = this.disasterArray[i]

      let zipCode = disaster.placeCode // Or FIPS County Code?

      let latlng = zip2LatLng(zipCode)


      //latlng = new google.maps.LatLng(disaster.location.lat, disaster.location.lng)
      title = `${disaster.callsign} (${disaster.status}) at ${disaster.date} at lat ${disaster.location.lat}, lng ${disaster.location.lng} with "${disaster.notes}".`
      //title = infoContent

      //! TODO: Provide a better icon generating mechanism...available via Dependency Injection/service?!
      labelText = disaster.callsign

      for (let j = 0; j < disasterTypes.length; j++) {
        if (disasterTypes[j].status != disaster.status) continue
        icon = disasterTypes[j].icon
        labelColor = disasterTypes[j].color
        break
      }

      // console.log(`displayMarkers adding marker #${i} at ${JSON.stringify(latlng)} with ${labelText}, ${title}, ${labelColor}`)

      this.addMarker(latlng.lat(), latlng.lng(), title, labelText, title, labelColor, "14px", icon)
    }

    // this.showMarkers() //! This directly adds to map - not in clusters...
    this.markerCluster.addMarkers(this.markers)

    console.log(`displayMarkers added ${this.disasterArray.length} markers`)
  }

  zip2LatLng(zipCode: string) {

    latlng = new google.maps.LatLng(-122, 47)
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

    if (infoContent == "") {
      infoContent = `Manual Marker dropped ${lat}, ${lng} at ${Date()}`
    }
    /*  Somehow this breaks following code!!!
        let myIcon5 = new google.maps.Icon({
          url: this.iconBase + icon,
          anchor: new google.maps.Point(5, 5),
        })
        */

    // https://developers.google.com/maps/documentation/javascript/examples/marker-symbol-custom
    const svgMarker = {
      //url: this.iconBase + icon,
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "blue",
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
      let time = Utility.time()

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
      console.error("event.latLng is BAD; can not add marker..")
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

  /**
     *
     * @returns
     */
  // Shows any markers currently in the array.
  showMarkers(): void {
    if (!this.gMap) {
      console.error(`showMarkers() got null gMap`)
      return
    }
    this.markers.forEach((i) => i.setMap(this.gMap))
  }

  // Deletes all markers in the array by removing references to them.
  removeAllMarkers() {
    console.log(`removeAllMarkers()`)
    this.hideMarkers()
    this.markers = []
    // this.gMap.clear();
    this.markerCluster.clearMarkers()
  }


  // Deletes all markers in the array by removing references to them
  // https://developers.google.com/maps/documentation/javascript/markers#remove
  removeAllMarkers2() {
    console.log(`(Abstract) removeAllMarkers()`)
    this.hideMarkers()
    // this.clearMarkers = [] // BUG: this won't work!
    // this.map.clear();
    // this.markerCluster.clearMarkers()
  }


  calcBackgroundColor(type: string) {
    return Common.calcBackgroundColor(type)
  }
}
