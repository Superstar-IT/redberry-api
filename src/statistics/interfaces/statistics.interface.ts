export interface StatSummaryInterface {
  confirmed: number;
  recovered: number;
  death: number;
}

export interface CountryStatInterface {
  id: number;
  country: string;
  code: string;
  confirmed: number;
  recovered: number;
  critical: number;
  deaths: number;
  created_at: Date;
  updated_at: Date;
}
