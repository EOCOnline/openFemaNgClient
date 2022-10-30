
import { metadataType } from './'
// export enum FieldReportSource { Voice, Packet, APRS, Email }


// TODO: grab this automatically from:
// https://www.fema.gov/api/open/v1/OpenFemaDatasetFields?$filter=openFemaDataset%20eq%20%27DisasterDeclarationsSummaries%27%20and%20datasetVersion%20eq%202

export type DisasterDeclarationsSummaryType = {
  femaDeclarationString:  string;
  disasterNumber: number;
  state:  string;
  declarationType:  string;
  declarationDate:  Date;
  fyDeclared: string;
  incidentType:  string;
  declarationTitle:  string;
  ihProgramDeclared: boolean;
  iaProgramDeclared: boolean;
  paProgramDeclared: boolean;
  hmProgramDeclared: boolean;
  incidentBeginDate: Date;
  incidentEndDate: Date | null;
  disasterCloseoutDate: null | Date;
  fipsStateCode:  number;
  fipsCountyCode:  number;
  placeCode:  number;
  designatedArea:  string;
  declarationRequestNumber:  number;
  lastIAFilingDate: Date | null;
  hash:  string;
  id:  string;
  lastRefresh:  Date
}

export interface DisasterDeclarationsSummary {
  metadata: metadataType,
  DisasterDeclarationsSummaries:  [DisasterDeclarationsSummaryType]
}
