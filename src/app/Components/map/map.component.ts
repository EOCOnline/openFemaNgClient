import { Component, OnInit } from '@angular/core';


// https://developer.trimblemaps.com/restful-apis/mapping/polygon/zip-code/
// https://pcmiler.alk.com/apis/rest/v1.0/Service.svc
// https://gis.stackexchange.com/questions/102740/creating-zip-code-level-choropleth-using-leaflet-js
// https://catalog.data.gov/dataset/tiger-line-shapefile-2019-2010-nation-u-s-2010-census-5-digit-zip-code-tabulation-area-zcta5-na

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
