import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { StateService } from "../services/state.service";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(private stateService: StateService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = this.stateService.token
      ? this.stateService.token
      : localStorage.getItem("token");

    if (token) {
      request = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token)
      });
    }

    if (!request.headers.has("Content-Type")) {
      request = request.clone({
        headers: request.headers.set("Content-Type", "application/json")
      });
    }

    request = request.clone({
      headers: request.headers.set("Accept", "application/json")
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      })
    );
  }
}
