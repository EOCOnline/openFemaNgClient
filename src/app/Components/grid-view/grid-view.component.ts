import { DOCUMENT, formatDate } from '@angular/common'
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, Pipe, PipeTransform, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms'
import { Observable, subscribeOn, Subscription, throwError } from 'rxjs'

import { HttpClient } from "@angular/common/http";
import { GridOptions, SelectionChangedEvent } from 'ag-grid-community'
// , TeamService
import { AgGridModule } from 'ag-grid-angular';

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service, DisasterTypes } from 'src/app/services'
import { Common } from "../"

@Component({
  selector: 'grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss']
})
export class GridViewComponent implements OnInit, OnDestroy {

  private declarationsSummariesSubscription!: Subscription
  // private fieldReportStatuses: FieldReportStatusType[] = []
  // fieldReportStatuses!: Observable<FieldReportStatusType[]> //TODO:
  public disasterDeclarationsSummary!: DisasterDeclarationsSummary
  public disasterDeclarationsSummaries: DisasterDeclarationsSummaryType[] = []
  // private fieldReports: FieldReportsType | undefined

  public columnDefs!: any
  private gridColumnApi
  private gridApi: any
  //private getRowNodeId;

  private backupRowData: any[] = []
  rowData: any[] | null = null // set rowData to null or undefined to show loading panel by default

  private defaultColDef = {
    //flex: 3, //https://ag-grid.com/angular-data-grid/column-sizing/#column-flex
    //minWidth: 50,
    // editable: true,
    // singleClickEdit: true,
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true
  }

  // https://www.ag-grid.com/angular-data-grid/grid-interface/#grid-options-1
  // https://blog.ag-grid.com/how-to-get-the-data-of-selected-rows-in-ag-grid/
  // NOT monitored for changes on the fly: https://stackoverflow.com/questions/52519129/ag-grid-and-angular-how-to-switch-grid-options-dynamically/52519796#52519796
  gridOptions: GridOptions = {
    // PROPERTIES
    //rowSelection: "multiple",

    // https://www.ag-grid.com/javascript-data-grid/row-pagination/#pagination-properties
    pagination: true,
    paginationAutoPageSize: true, // if set overrides paginationPageSize & forces it back to this on changes...
    //paginationPageSize: 5,
    // suppressScrollOnNewData: true, // grid to NOT scroll to the top, on page changes

    // EVENT handlers
    // onRowClicked: event => console.log('A row was clicked'),
    // onSelectionChanged: (event: SelectionChangedEvent) => this.onRowSelection(event),

    // CALLBACKS
    // getRowHeight: (params) => 25

    defaultColDef: this.defaultColDef,
    // set rowData to null or undefined to show loading panel by default
    rowData: this.rowData,
  }


  constructor(
    //readonly webDisasterSummariesService: WebDisasterSummariesService,
    private http: HttpClient,
    private disasterDeclarationsSummariesV2Service: DisasterDeclarationsSummariesV2Service,
    @Inject(DOCUMENT) private document: Document,
  ) {
    // Whats source for data: service (YES); NO: DatasetViewerComponent?

    console.log(`DatasetGridComponent: constructor`)

    this.gridApi = ""
    this.gridColumnApi = ""

    // https://angular.io/tutorial/toh-pt4#call-it-in-ngoninit states subscribes should happen in OnInit()
    this.declarationsSummariesSubscription = disasterDeclarationsSummariesV2Service.getDisasterDeclarationsSummariesV2ServiceObserver().subscribe({
      next: (newDisasterDeclarationsSummary) => {
        this.disasterDeclarationsSummary = newDisasterDeclarationsSummary
        //this.displayDataSet()
        this.gotNewData(newDisasterDeclarationsSummary.DisasterDeclarationsSummaries)
        //debugger
      },
      error: (e) => console.error('declarationsSummariesSubscription got:' + e),
      complete: () => console.info('declarationsSummariesSubscription complete')
    })

    console.log(`DatasetGridComponent: Got declarationsSummariesSubscription, awaiting results`)
  }

  ngOnInit(): void {
    console.log(`DatasetGridComponent: ngOnInit()`)
    //console.log(`DatasetGridComponent: Got observable: ${this.disasterDeclarationsSummary}   ${JSON.stringify(this.disasterDeclarationsSummary)}`)

    this.columnDefs = [
      {
        headerName: "Type", field: "incidentType", headerTooltip: 'incidentType', width: 30,
        cellStyle: (params: { value: string; }) => { return this.calcBackgroundColor(params.value) }
      },
      {
        headerName: "Declaration", field: "femaDeclarationString", headerTooltip: 'femaDeclarationString',
        cellRenderer: function (params: any) { //{ data: DisasterDeclarationsSummaryType }
          return `<a href="/details/${params.rowIndex}">${params.data.femaDeclarationString}</a>`
        },
        width: 60
      },
      {
        headerName: "Title", field: "declarationTitle", headerTooltip: 'declarationTitle',
        cellRenderer: function (params: any) { //{ data: DisasterDeclarationsSummaryType }
          return `<a href="/details/${params.rowIndex}">${params.data.declarationTitle}</a>`
        },
        width: 200
      },
      { headerName: "County", field: "designatedArea", headerTooltip: 'designatedArea', width: 100 },
      { headerName: "State", field: "state", width: 5 },
      { headerName: "Zip", field: "placeCode", headerTooltip: 'placeCode', width: 30 },
      { headerName: "BeginDate", field: "incidentBeginDate", headerTooltip: 'incidentBeginDate', valueGetter: this.myDateGetter, width: 25 },
      { headerName: "EndDate", field: "incidentEndDate", headerTooltip: 'incidentEndDate', valueGetter: this.myDateGetter, width: 25 },
      { headerName: "Declared", field: "declarationDate", tooltipField: "declarationDate", valueGetter: this.myDateGetter, width: 25 },
      { headerName: "Closed", field: "disasterCloseoutDate", tooltipField: "disasterCloseoutDate", valueGetter: this.myDateGetter, width: 25 },
      { headerName: "FIPS Cty", field: "fipsCountyCode", tooltipField: "fipsCountyCode", width: 10 },
      { headerName: "FIPS St", field: "fipsStateCode", tooltipField: "fipsStateCode", width: 5 },
      { headerName: "Req #", field: "declarationRequestNumber", tooltipField: "declarationRequestNumber", width: 10 },
    ];

    if (this.gridApi) {
      this.gridApi.refreshCells()
    } else {
      console.log("DatasetGridComponent: no this.gridApi yet in ngOnInit()")
    }
  }

  calcBackgroundColor(type: string) {
    return Common.calcBackgroundColor(type)
  }


  /**
   * Given a fieldReport, finds the date, and returns it as 'Sun Jan-01 23:00:00'
   * @param params
   * @returns
   */
  myDateGetter = (params: { data: DisasterDeclarationsSummaryType }) => {
    const weekday = ["Sun ", "Mon ", "Tue ", "Wed ", "Thu ", "Fri ", "Sat "]
    let dt = 'unknown date'
    let d: Date = new Date(params.data.declarationDate)
    //this.log.excessive(`Day is: ${d.toISOString()}`, this.id)
    //this.log.excessive(`WeekDay is: ${d.getDay}`, this.id)

    try {  // TODO: Use the date pipe instead?
      //weekday[d.getDay()] +
      dt = formatDate(d, 'shortDate', 'en-US')
      //this.log.excessive(`Day is: ${params.data.date.toISOString()}`, this.id)
    } catch (error: any) {
      dt = `Bad date format: Error name: ${error.name}; msg: ${error.message}`
    }

    // https://www.w3schools.com/jsref/jsref_obj_date.asp
    //this.log.excessive(`Day is: ${params.data.date.toISOString()}`, this.id)
    /*
        if (this.isValidDate(d)) {
          dt = weekday[d.getDay()] + formatDate(d, 'yyyy-MM-dd HH:MM:ss', 'en-US')
          this.log.excessive(`Day is: ${params.data.date.toISOString()}`, this.id)
        }
    */
    return dt
  }

  displayDataSet_UNUSED() {
    console.log(`DatasetGridComponent: displayDataSet()`)
    // use gotNewData() instead...
  }

  onGridReady = (params: any) => {
    console.error("DatasetGridComponent: onGridReady()")

    this.gridApi = params.api
    console.log(`onGridReady() gridApi: ${this.gridApi}`)

    this.gridColumnApi = params.columnApi
    console.log(`onGridReady() gridColumnApi: ${this.gridColumnApi}`)

    // https://ag-grid.com/angular-data-grid/column-sizing/#example-default-resizing
    params.api.sizeColumnsToFit()

    // TODO: use this line, or onFirstDataRendered()?
    if (this.gridApi) {
      this.gridApi.refreshCells()
    } else {
      console.log("no this.gridApi yet in onGridReady()")
    }

    // set initial pagination size
    // paginationAutoPageSize: true
    // this.gridApi.paginationAutoPageSize(true) // also see: onRowsPerPage

    let rows: DisasterDeclarationsSummary | null = null
    for (let sec = 0; sec++; sec < 10) {
      rows = this.disasterDeclarationsSummariesV2Service.getSummaries()
      console.log(`got sec=${sec}`)
      if (rows) {
        console.log("DatasetGridComponent onGridReady(): Got rows!")
        break
      }
    }

    if (rows) {
      console.log("DatasetGridComponent onGridReady(): Set rows...")
      this.gotNewData(rows.DisasterDeclarationsSummaries)
    }

    console.log("onGridReady() done")
  }

  onGridReady2_UNUSED(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get(
        "https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json"
      )
      .subscribe((data: any) => {
        data.length = 10;
        data = data.map((row: any, index: number) => {
          return { ...row, id: index + 1 };
        });
        this.backupRowData = data;
        this.rowData = data;
      });
  }

  onFirstDataRendered(params: any) {
    console.log("DatasetGridComponent: onFirstDataRendered()")

    // following should not be needed, duplicate of onGridReady()...
    this.gridApi = params.api
    //console.log(`onGridReady() gridApi: ${this.gridApi}`)
    this.gridColumnApi = params.columnApi

    //params.api.sizeColumnsToFit();
    this.refreshGrid()
  }

  //onFirstDataRendered(params: any) {
  refreshGrid() {
    // https://blog.ag-grid.com/refresh-grid-after-data-change/
    if (this.gridApi) {
      this.gridApi.refreshCells()
      this.gridApi.sizeColumnsToFit()
    } else {
      console.warn(`DatasetGridComponent: refreshGrid(): gridApi not established yet!`)
    }
  }

  reloadPage() {
    console.error(`DatasetGridComponent: NOT Reloading window!`)
    //window.location.reload()
  }

  gotNewData(newData: DisasterDeclarationsSummaryType[]) {
    console.warn(`DatasetGridComponent: New collection of ${newData.length} DisasterDeclarationsSummaryTypes observed.`)
    console.log(`DatasetGridComponent: ${JSON.stringify(newData[0])}`)


    this.disasterDeclarationsSummaries = newData
    this.rowData = newData
    //this.fieldReportArray = newData.fieldReportArray
    this.refreshGrid()
    //this.reloadPage()  // TODO: needed? - creates endless loop!
  }

  ngOnDestroy(): void {
    this.declarationsSummariesSubscription?.unsubscribe()
  }

}
