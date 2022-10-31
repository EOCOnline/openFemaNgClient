
import { metadataType } from './'
// export enum FieldReportSource { Voice, Packet, APRS, Email }


// TODO: grab this automatically from:
// https://www.fema.gov/api/open/v1/OpenFemaDatasetFields?$filter=openFemaDataset%20eq%20%27DisasterDeclarationsSummaries%27%20and%20datasetVersion%20eq%202

// Should align with & explained by https://www.fema.gov/openfema-data-page/disaster-declarations-summaries-v2

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
  disasterCloseoutDate: string | null;
  fipsStateCode:  string;
  fipsCountyCode:  string;
  placeCode:  string;
  designatedArea:  string;
  declarationRequestNumber:  string;
  lastIAFilingDate: string | null;
  hash:  string;
  id:  string;
  lastRefresh:  string; // Date
}

export interface DisasterDeclarationsSummary {
  metadata: metadataType;
  DisasterDeclarationsSummaries: DisasterDeclarationsSummaryType[]
}
/*
type real = ({ femaDeclarationString: string; disasterNumber: number; state: string; declarationType: string; declarationDate: string; fyDeclared: number; incidentType: string; declarationTitle: string; ... 15 more ...; lastRefresh: string; } | { ...; } | { ...; } | { ...; } | { ...; })[]
// is not assignable to type 'DisasterDeclarationsSummaryType[]'.

//Type '
type mine = { femaDeclarationString: string; disasterNumber: number; state: string; declarationType: string; declarationDate: string; fyDeclared: number; incidentType: string; declarationTitle: string; ... 15 more ...; lastRefresh: string; } | { ...; } | { ...; } | { ...; } | { ...; }
//' is not assignable to type 'DisasterDeclarationsSummaryType'.

// Type '
type third = { femaDeclarationString: string; disasterNumber: number; state: string; declarationType: string; declarationDate: string; fyDeclared: number; incidentType: string; declarationTitle: string; ... 15 more ...; lastRefresh: string; }
//' is not assignable to type 'DisasterDeclarationsSummaryType'.

// Types of property 'declarationDate' are incompatible.
// Type 'string' is not assignable to type 'Date'.
*/
