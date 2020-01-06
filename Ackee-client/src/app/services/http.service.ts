import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

import { AppDomains } from "../models/app.model";
import { View, Views } from "../models/backend.model";
import { Observable } from "rxjs/internal/Observable";

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
      `${environment.url}/getTrackerName`
    );
  }

  renameDomain(domain: string, title): Observable<any> {
    return this.httpClient.put<any>(`${environment.url}/domains/${domain}`, {
      title
    });
  }

  deleteDomain(domain: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.url}/domains/${domain}`);
  }

  async getViews(type: string, domains: AppDomains[]): Promise<Views> {
    const res: any = { type: "", data: [] };
    await Promise.all(
      domains.map(async domain => {
        const data: any = await this.httpClient
          .get<Views>(
            `${environment.url}/domains/${domain.id}/views?type=${type}`
          )
          .toPromise();
        res.type = data.type;
        const subArr = { id: domain.id, data: [] };
        data.data.forEach((e: View) => {
          subArr.data.push(e.data);
        });
        res.data.push(subArr);
      })
    );
    return res;
  }

  async getDurations(type: string, domains: AppDomains[]): Promise<Views> {
    const res: any = { type: "", data: [] };
    await Promise.all(
      domains.map(async domain => {
        const data: any = await this.httpClient
          .get<Views>(
            `${environment.url}/domains/${domain.id}/durations?type=${type}`
          )
          .toPromise();
        res.type = data.type;
        const subArr = { id: domain.id, data: [] };
        data.data.forEach((e: View) => {
          subArr.data.push(e.data);
        });
        res.data.push(subArr);
      })
    );
    return res;
  }
}
