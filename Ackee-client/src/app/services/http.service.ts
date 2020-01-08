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

  addDomain(title: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/domains`, { title });
  }

  deleteDomain(domain: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.url}/domains/${domain}`);
  }

  async getOses(domains: AppDomains[]): Promise<any> {
    const res: any = { type: "", data: [] };
    await Promise.all(
      domains.map(async domain => {
        const data: any = await this.httpClient
          .get<Views>(`${environment.url}/domains/${domain.id}/oses`)
          .toPromise();
        res.type = data.type;
        const subArr = { id: domain.id, data: [] };
        data.data.forEach((e: any) => {
          subArr.data.push(e);
        });
        res.data.push(subArr);
      })
    );
    return res;
  }

  async getPlatforms(domains: AppDomains[]): Promise<any> {
    const res: any = { type: "", data: [] };
    await Promise.all(
      domains.map(async domain => {
        const data: any = await this.httpClient
          .get<Views>(`${environment.url}/domains/${domain.id}/platforms`)
          .toPromise();
        res.type = data.type;
        const subArr = {
          id: domain.id,
          data: [{ XL: 0 }, { L: 0 }, { M: 0 }, { S: 0 }, { XS: 0 }]
        };
        data.data.forEach((e: any) => {
          if (e.id.platform >= 1200) subArr.data[0].XL += 1;
          else if (e.id.platform >= 992) subArr.data[1].L += 1;
          else if (e.id.platform >= 768) subArr.data[2].M += 1;
          else if (e.id.platform >= 576) subArr.data[3].S += 1;
          else if (e.id.platform < 576) subArr.data[4].XS += 1;
        });
        res.data.push(subArr);
      })
    );
    return res;
  }

  async getLanguages(domains: AppDomains[]): Promise<any> {
    const res: any = { type: "", data: [] };
    await Promise.all(
      domains.map(async domain => {
        const data: any = await this.httpClient
          .get<Views>(`${environment.url}/domains/${domain.id}/languages`)
          .toPromise();
        res.type = data.type;
        const subArr = { id: domain.id, data: [] };
        data.data.forEach((e: any) => {
          subArr.data.push(e);
        });
        res.data.push(subArr);
      })
    );
    return res;
  }

  async getPages(domains: AppDomains[]): Promise<any> {
    const res: any = { type: "", data: [] };
    await Promise.all(
      domains.map(async domain => {
        const data: any = await this.httpClient
          .get<Views>(`${environment.url}/domains/${domain.id}/pages`)
          .toPromise();
        res.type = data.type;
        const subArr = { id: domain.id, data: [] };
        data.data.forEach((e: any) => {
          subArr.data.push(e);
        });
        res.data.push(subArr);
      })
    );
    return res;
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
