
import { metadataType } from './'
// export enum FieldReportSource { Voice, Packet, APRS, Email }


// TODO: grab this automatically from:
// https://www.fema.gov/api/open/v1/OpenFemaDatasetFields?$filter=openFemaDataset%20eq%20%27DisasterDeclarationsSummaries%27%20and%20datasetVersion%20eq%202

// https://app.swaggerhub.com/apis-docs/perepechko-alex/OpenFEMA/0.1#/default/get_api_open_v2_DisasterDeclarationsSummaries


// Should align with & explained by https://www.fema.gov/openfema-data-page/disaster-declarations-summaries-v2
//! Review: Above had to be changed as follows to import json file of summaries (see items below with comments)
export type DisasterDeclarationsSummaryType = {
  femaDeclarationString: string;
  disasterNumber: number;
  state: string;
  declarationType: string;
  declarationDate: string; // Date;
  fyDeclared: number;
  incidentType: string;
  declarationTitle: string;
  ihProgramDeclared: boolean;
  iaProgramDeclared: boolean;
  paProgramDeclared: boolean;
  hmProgramDeclared: boolean;
  incidentBeginDate: string; // Date;
  incidentEndDate: string | null; // Date;
  disasterCloseoutDate: string | null; // Date;
  fipsStateCode: string;
  fipsCountyCode: string;
  placeCode: string;
  designatedArea: string;
  declarationRequestNumber: string; // number;
  lastIAFilingDate: string | null; // Date;
  lastRefresh: string; // Date
  hash: string;
  id: string;
}

export interface DisasterDeclarationsSummary {
  metadata: metadataType;
  DisasterDeclarationsSummaries: DisasterDeclarationsSummaryType[]
}

// https://www.colorsandfonts.com/color-system
// https://fonts.google.com/icons?icon.query=disaster&icon.style=Outlined
export const DisasterTypes = [
  { type: 'Coastal Storm', color: '#80DEEA', icon: 'waves', display: true },
  { type: 'Earthquake', color: '#FFFF00', icon: 'landslide', display: true },
  { type: 'Fire', color: '#FF6E40', icon: 'forest', display: true },
  { type: 'Flood', color: '#8C9EFF', icon: 'flood', display: true },
  { type: 'Hurricane', color: '#CE93D8', icon: 'cyclone', display: true },
  { type: 'Severe Ice Storm', color: '#B2EBF2', icon: 'ac_unit', display: true },
  { type: 'Severe Storm', color: 'lightblue', icon: 'storm', display: true },
  { type: 'Snowstorm', color: '#E0E0E0', icon: 'snowing', display: true },
  { type: 'Tornado', color: '#E1BEE7', icon: 'tornado', display: true },
  { type: 'Volcano', color: '#F42D2D', icon: 'volcano', display: true },

  { type: 'Other', color: '#EEEEEE', icon: 'sentiment_dissatisfied', display: true },
]

