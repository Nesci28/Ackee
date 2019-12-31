interface Data {
  id: string;
  created?: string;
  updated?: string;
  title?: string;
}

export interface AppDomains {
  id: string;
  title: string;
}

export interface AppViews {
  daysAgo: number;
  count: number;
}
