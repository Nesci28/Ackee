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
