
import { metadataType } from './'
// export enum FieldReportSource { Voice, Packet, APRS, Email }


// TODO: grab this automatically from:
// https://www.fema.gov/api/open/v1/OpenFemaDatasetFields?$filter=openFemaDataset%20eq%20%27DisasterDeclarationsSummaries%27%20and%20datasetVersion%20eq%202

// Should align with & explained by https://www.fema.gov/openfema-data-page/disaster-declarations-summaries-v2
//! Review: Above had to be changed as follows to import json file of summaries (see items below with comments)
export type DisasterDeclarationsSummaryType = {
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
}

export interface DisasterDeclarationsSummary {
  metadata: metadataType;
  DisasterDeclarationsSummaries: DisasterDeclarationsSummaryType[]
}
