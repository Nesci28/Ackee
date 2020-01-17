import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

interface Data {
  id: string;
  created: string;
  updated: string;
  title?: string;
}

export interface Token {
  type: string;
  data: Data;
}

interface DomainsData {
  type: string;
  data: Data;
}

export interface Domains {
  type: string;
  data: DomainsData[];
}

export interface ViewsData {
  id: { day: number; month: number; year: number };
  count?: number;
  average?: number;
}

export interface View {
  type: string;
  data: ViewsData;
}

export interface Views {
  type: string;
  data: ViewsData[];
}

export interface OsesData {
  id: { osName: string };
  count: number;
  created: string[];
}

export interface Oses {
  type: string;
  data: OsesData[];
}

export interface BackendDate {
  day: number;
  month: number;
  year: number;
}

export interface InsideBackendData {
  id: { year: number; month: number; day: number; hour?: number };
  domainId?: string;
  count?: number;
  average?: number;
  time?: number;
}
export interface BackendData {
  type: string;
  data: InsideBackendData;
}

export interface BackendResponse {
  type: string;
  data: BackendData[];
}
