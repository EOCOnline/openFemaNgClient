import { Component, OnInit } from '@angular/core';
import { Common } from "../"

// https://developer.trimblemaps.com/restful-apis/mapping/polygon/zip-code/
// https://pcmiler.alk.com/apis/rest/v1.0/Service.svc
// https://gis.stackexchange.com/questions/102740/creating-zip-code-level-choropleth-using-leaflet-js
// https://catalog.data.gov/dataset/tiger-line-shapefile-2019-2010-nation-u-s-2010-census-5-digit-zip-code-tabulation-area-zcta5-na

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  calcBackgroundColor(type: string) {
    return Common.calcBackgroundColor(type)
  }


}
