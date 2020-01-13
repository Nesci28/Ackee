import { Component, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { State } from "./models/app.enum";
import { StateService } from "./services/state.service";
import { BaseComponent } from "./components/shared/base/base.component";
import { HttpService } from "./services/http.service";
import { Domains } from "./models/backend.model";
import { AppDomains } from "./models/app.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent extends BaseComponent implements OnInit {
  title = "Ackee-client";
  state: State;
  State = State;
  start: boolean = true;

  constructor(
    private stateService: StateService,
    private httpService: HttpService
  ) {
    super();
  }

  ngOnInit() {
    if (localStorage.getItem("token") && localStorage.getItem("state")) {
      this.httpService
        .getDomains()
        .pipe(takeUntil(this.destroy$))
        .subscribe((domains: Domains) => {
          const resDomains: AppDomains[] = [];
          domains.data.forEach(domain => {
            resDomains.push({
              id: domain.data.id,
              title: domain.data.title
            });
          });
          this.stateService.domains = resDomains;
          this.stateService.state$.next(localStorage.getItem("state") as State);
          this.start = false;
        });
    }

    this.stateService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: State) => {
        this.state = state;
        if (!this.start) {
          localStorage.setItem("state", state);
        }
      });
  }
}
