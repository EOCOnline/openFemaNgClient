// Standard/common FEMA interfaces (used in multiple other data sets) go here

// import { LocationType } from './location.interface'
// export enum FieldReportSource { Voice, Packet, APRS, Email }

export type metadataType = {
  skip: number;
  filter: string;
  orderby: string;
  select: null | string;
  rundate: string;
  entityname: string; // DisasterDeclarationsSummaries
  version: string;
  top: number;
  count: number;
  format: string; // json
  metadata: boolean;
  url: string; //   /api/open/v2/DisasterDeclarationsSummaries?$format=json
}

