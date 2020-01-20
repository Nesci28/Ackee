import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

import { AppDomains } from "../models/app.model";
import { View, Views } from "../models/backend.model";
import { Observable } from "rxjs/internal/Observable";
import { State } from "../models/app.enum";

import { languageList } from "../../assets/list";
import { StateService } from "./state.service";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  constructor(
    private httpClient: HttpClient,
    private stateService: StateService
  ) {}

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
  ): any {
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
  ): any {
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

  // async getOsesOrPlatforms(domains: AppDomains[], state: string): Promise<any> {
  //   const res: any = { type: "", data: [] };
  //   await Promise.all(
  //     domains.map(async domain => {
  //       const data: any = await this.httpClient
  //         .get<Views>(`${environment.url}/domains/${domain.id}/${state}`)
  //         .toPromise();
  //       res.type = data.type;
  //       let subArr: any;
  //       if (state === State.oses) {
  //         subArr = { id: domain.id, data: [] };
  //         data.data.forEach((e: any) => {
  //           subArr.data.push(e);
  //         });
  //       } else if (state === State.platforms) {
  //         subArr = {
  //           id: domain.id,
  //           data: [
  //             { id: { platform: "X-Small" }, count: 0, created: [] },
  //             { id: { platform: "Small" }, count: 0, created: [] },
  //             { id: { platform: "Medium" }, count: 0, created: [] },
  //             { id: { platform: "Large" }, count: 0, created: [] },
  //             { id: { platform: "X-Large" }, count: 0, created: [] }
  //           ]
  //         };
  //         data.data.forEach((e: any) => {
  //           if (e.id.platform >= 1200) {
  //             subArr.data[0].count += e.created.length;
  //             subArr.data[0].created.push(...e.created);
  //           } else if (e.id.platform >= 992) {
  //             subArr.data[1].count += e.created.length;
  //             subArr.data[1].created.push(...e.created);
  //           } else if (e.id.platform >= 768) {
  //             subArr.data[2].count += e.created.length;
  //             subArr.data[2].created.push(...e.created);
  //           } else if (e.id.platform >= 576) {
  //             subArr.data[3].count += e.created.length;
  //             subArr.data[3].created.push(...e.created);
  //           } else if (e.id.platform < 576) {
  //             subArr.data[4].count += e.created.length;
  //             subArr.data[4].created.push(...e.created);
  //           }
  //         });
  //       }
  //       res.data.push(subArr);
  //     })
  //   );
  //   return res;
  // }

  // async getPagesOrLanguages(
  //   domains: AppDomains[],
  //   state: string
  // ): Promise<any> {
  //   const res: any = { type: "", data: [] };
  //   await Promise.all(
  //     domains.map(async domain => {
  //       const data: any = await this.httpClient
  //         .get<Views>(`${environment.url}/domains/${domain.id}/${state}`)
  //         .toPromise();
  //       res.type = data.type;
  //       const subArr = { id: domain.id, data: [] };
  //       data.data.forEach((e: any) => {
  //         if (state === State.languages) {
  //           e.data.id = languageList[e.data.id].nativeName.split(",")[0];
  //         }
  //         subArr.data.push(e);
  //       });
  //       res.data.push(subArr);
  //     })
  //   );
  //   return res;
  // }

  // async getViewsOrDurations(
  //   type: string,
  //   state: string,
  //   domains: AppDomains[]
  // ): Promise<Views> {
  //   const res: any = { type: "", data: [] };
  //   await Promise.all(
  //     domains.map(async domain => {
  //       const data: any = await this.httpClient
  //         .get<Views>(
  //           `${environment.url}/domains/${domain.id}/${state}?type=${type}`
  //         )
  //         .toPromise();
  //       res.type = data.type;
  //       const subArr = { id: domain.id, data: [] };
  //       data.data.forEach((e: View) => {
  //         subArr.data.push(e.data);
  //       });
  //       res.data.push(subArr);
  //     })
  //   );
  //   return res;
  // }
}
