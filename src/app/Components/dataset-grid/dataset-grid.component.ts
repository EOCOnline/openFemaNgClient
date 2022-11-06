import { DOCUMENT, formatDate } from '@angular/common'
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, Pipe, PipeTransform, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms'
import { Observable, subscribeOn, Subscription, throwError } from 'rxjs'

import { HttpClient } from "@angular/common/http";
import { GridOptions, SelectionChangedEvent } from 'ag-grid-community'
// , TeamService
import { AgGridModule } from 'ag-grid-angular';

import { DisasterDeclarationsSummaryType, DisasterDeclarationsSummary, WebDisasterSummariesService, DisasterDeclarationsSummariesV2Service } from 'src/app/services'

@Component({
  selector: 'app-dataset-grid',
  templateUrl: './dataset-grid.component.html',
  styleUrls: ['./dataset-grid.component.scss']
})
export class DatasetGridComponent implements OnInit, OnDestroy {

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
    flex: 1, //https://ag-grid.com/angular-data-grid/column-sizing/#column-flex
    minWidth: 50,
    editable: true,
    //singleClickEdit: true,
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

    console.log(`DatasetGridComponent: Got observable: ${this.disasterDeclarationsSummary}   ${JSON.stringify(this.disasterDeclarationsSummary)}`)

    /*
        femaDeclarationString:  string;
        disasterNumber: number;
        state:  string;
        declarationType:  string;
        declarationDate:  string; // Date;
        fyDeclared: number;
        incidentType:  string;
        declarationTitle:  string;
        ihProgramDeclared: boolean;
        iaProgramDeclared: boolean;
        paProgramDeclared: boolean;
        hmProgramDeclared: boolean;
        incidentBeginDate: string; // Date;
        incidentEndDate: string | null; // Date;
        disasterCloseoutDate: string | null; // Date;
        fipsStateCode:  string;
        fipsCountyCode:  string;
        placeCode:  string;
        designatedArea:  string;
        declarationRequestNumber:  string; // number;
        lastIAFilingDate: string | null; // Date;
        lastRefresh:  string; // Date
        hash:  string;
        id:  string;
    */
    this.columnDefs = [
      { headerName: "Declaration", field: "femaDeclarationString", headerTooltip: 'femaDeclarationString', width: 3, flex: 5 },
      { headerName: "#", field: "disasterNumber", tooltipField: "disasterNumber", flex: 5 },
      { headerName: "State", field: "state", flex: 5 }, //, maxWidth: 200
      { headerName: "Decl Type", field: "declarationType", tooltipField: "declarationType", flex: 5 }, //, maxWidth: 200
      { headerName: "Date", field: "declarationDate", tooltipField: "declarationDate", flex: 5 }, //, maxWidth: 200
      { headerName: "Inc Type", field: "incidentType", tooltipField: "incidentType", flex: 5 }, //, maxWidth: 200
      /*
      {
        headerName: "Lat", field: "lat", cellClass: 'number-cell', flex: 1,
        valueGetter: (params: { data: FieldReportType }) => { return Math.round(params.data.location.lat * 10000) / 10000.0 }
      },
      {
        headerName: "Lng", field: "lng", cellClass: 'number-cell', flex: 1,
        valueGetter: (params: { data: FieldReportType }) => { return Math.round(params.data.location.lng * 10000) / 10000.0 },
      },
      { headerName: "Reported", headerTooltip: 'Report date', valueGetter: this.myDateGetter, flex: 2 },
      { headerName: "Elapsed", headerTooltip: 'Hrs:Min:Sec since report', valueGetter: this.myMinuteGetter, flex: 2 },
      {
        headerName: "Status", field: "status", flex: 5,
        cellStyle: (params: { value: string; }) => {
          //this.fieldReportStatuses.forEach(function(value) { (params.value === value.status) ? { backgroundColor: value.color }  : return(null) }
          for (let i = 0; i < this.fieldReportStatuses.length; i++) {
            if (params.value === this.fieldReportStatuses[i].status) {
              return { backgroundColor: this.fieldReportStatuses[i].color }
            }
          }
          return null
        }
        //cellClassRules: this.cellClassRules() }, //, maxWidth: 150
      },
      { headerName: "Notes", field: "notes", flex: 50 }, //, maxWidth: 300
      */
    ];

    if (this.gridApi) {
      this.gridApi.refreshCells()
    } else {
      console.log("DatasetGridComponent: no this.gridApi yet in ngOnInit()")
    }
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
