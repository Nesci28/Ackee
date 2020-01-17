export interface AppDomains {
  id: string;
  title: string;
}

export interface AppViews {
  daysAgo: number;
  count: number;
}

export interface GraphData {
  data: number[];
  backgroundColor: string | string[];
  hoverBackgroundColor: string;
  hoverBorderColor: string;
}

export interface Graph {
  domainId: string;
  data?: GraphData;
}
