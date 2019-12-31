import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
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

  getViews(type: string, id: string): any {
    return this.httpClient.get<any>(
      `${environment.url}/domains/${id}/views?type=${type}`
    );
  }
}
