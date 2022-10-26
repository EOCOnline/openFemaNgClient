import { metadataType } from './'

export type FemaWebDisasterSummaryType = {
  disasterNumber: number;
  totalNumberIaApproved: number | null;
  totalAmountIhpApproved: number | null;
  totalAmountHaApproved: number | null;
  totalAmountOnaApproved: number | null;
  totalObligatedAmountPa: number | null;
  totalObligatedAmountCatAb: number | null;
  totalObligatedAmountCatC2g: number | null;
  paLoadDate: Date | null;
  iaLoadDate: Date | null;
  totalObligatedAmountHmgp: number
  hash: string;
  id: string;
  lastRefresh: Date
}

export interface FemaWebDisasterSummary {
  metadata: metadataType;
  FemaWebDisasterSummaries:  [FemaWebDisasterSummaryType]
}
