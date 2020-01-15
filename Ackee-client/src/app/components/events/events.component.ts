import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { AppDomains } from "../../models/app.model";
import { ChartsService } from "../../services/charts.service";
import { HttpService } from "../../services/http.service";
import { StateService } from "../../services/state.service";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { BaseComponent } from "../shared/base/base.component";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"]
})
export class EventsComponent extends BaseComponent implements OnInit {
  form: FormGroup = new FormGroup({
    domain: new FormControl("", Validators.required)
  });
  domains: AppDomains[];
  loading: boolean;
  data: any;
  chartLabels: any[];
  chartData: any[];
  showSpacer: any;

  constructor(
    private stateService: StateService,
    private chartsService: ChartsService,
    private httpService: HttpService
  ) {
    super();
    this.showSpacer = stateService.showSpacer;
  }

  async ngOnInit() {
    this.stateService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.loading = loading;
      });

    this.stateService.loading$.next(true);
    this.domains = this.stateService.domains;
    this.domain.setValue(this.domains[0].id);

    this.data = await this.fetchData();
    this.getChartVariables();
    this.stateService.loading$.next(false);
  }

  get domain() {
    return this.form.get("domain");
  }

  fetchData() {
    return this.httpService.getEvents(this.domain.value).toPromise();
  }

  async selectChanged(): Promise<void> {
    this.stateService.loading$.next(true);
    this.data = await this.fetchData();
    this.getChartVariables();
    this.stateService.loading$.next(false);
  }

  getChartVariables(): void {
    this.chartLabels = this.chartsService.createChartEventsLabel(this.data);
    this.chartData = this.chartsService.configureChartEvents(this.data);
  }
}
