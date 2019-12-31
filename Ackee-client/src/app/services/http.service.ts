import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

import { AppDomains } from "../models/app.model";
import { View, Views } from "../models/backend.model";
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
        const subArr = [];
        data.data.forEach((e: View) => {
          subArr.push(e.data);
        });
        res.data.push(subArr);
      })
    );
    return res;
  }
}
