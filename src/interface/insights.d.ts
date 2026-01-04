export type SearchConsoleDimension = 'query' | 'page' | 'country' | 'device' | 'date';

export type SearchConsoleRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type SearchConsoleDataset = {
  dimension: SearchConsoleDimension[];
  rows: SearchConsoleRow[];
};

export type SearchConsoleSnapshot = {
  siteUrl: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  byQuery: SearchConsoleDataset;
  byPage: SearchConsoleDataset;
  byCountry: SearchConsoleDataset;
  byDevice: SearchConsoleDataset;
  byDate: SearchConsoleDataset;
};

export type InsightsApiResponse =
  | {
      ok: true;
      data: SearchConsoleSnapshot;
    }
  | {
      ok: false;
      error: string;
    };
