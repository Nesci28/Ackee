import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "src/environments/environment";

import { StateService } from "./state.service";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  token(username: string, password: string): any {
    return this.httpClient.post<any>(`${environment.url}/tokens`, {
      username,
      password
    });
  }

  getDomains(): any {
    return this.httpClient.get<any>(`${environment.url}/domains`);
  }

  getTrackerName(): Observable<{ name: string }> {
    return this.httpClient.get<{ name: string }>(
      `${environment.url}/tracker.name`
    );
  }

  getEvents(domainId: string): any {
    return this.httpClient.get<any>(
      `${environment.url}/domains/${domainId}/events`
    );
  }

  renameDomain(domain: string, title: string): Observable<any> {
    return this.httpClient.put<any>(`${environment.url}/domains/${domain}`, {
      title
    });
  }

  addDomain(title: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/domains`, { title });
  }

  deleteDomain(domain: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.url}/domains/${domain}`);
  }

  getInfo(
    type: string,
    dateFrom?: string,
    dateTo?: string,
    subType?: string,
    domainId?: string
  ): Observable<any> {
    const url = domainId ? `domains/${domainId}/` : "";
    let df: any, dt: any;
    if (dateFrom && dateTo) {
      df = dateFrom;
      dt = new Date(dateTo);
      dt.setDate(dt.getDate() + 1);
      dt = dt.toISOString().slice(0, 10);
    }

    const params =
      subType && df && dt
        ? `?type=${subType}&dateFrom=${df}&dateTo=${dt}`
        : df && dt
        ? `?dateFrom=${df}&dateTo=${dt}`
        : "";
    return this.httpClient.get<any>(
      `${environment.url}/${url}${type}${params}`
    );
  }

  postInfo(
    type: string,
    dateFrom: string,
    dateTo: string,
    subType: string,
    domainsIds: string[]
  ): Observable<any> {
    const df = dateFrom;
    let dt: any = new Date(dateTo);
    dt.setDate(dt.getDate() + 1);
    dt = dt.toISOString().slice(0, 10);

    const params =
      subType && df && dt
        ? `?type=${subType}&dateFrom=${df}&dateTo=${dt}`
        : df && dt
        ? `?dateFrom=${df}&dateTo=${dt}`
        : "";
    return this.httpClient.post<any>(`${environment.url}/${type}${params}`, {
      domainsIds
    });
  }
}
