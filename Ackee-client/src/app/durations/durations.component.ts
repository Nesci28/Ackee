import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { AppDomains } from "../models/app.model";
import { Views } from "../models/backend.model";
import { ChartsService } from "../services/charts.service";
import { HttpService } from "../services/http.service";
import { StateService } from "../services/state.service";
import { BaseComponent } from "../shared/base/base.component";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { Charts } from "../models/app.enum";

@Component({
  selector: "app-durations",
  templateUrl: "./durations.component.html",
  styleUrls: ["./durations.component.scss"]
})
export class DurationsComponent extends BaseComponent implements OnInit {
  domains: AppDomains[] = [];
  start: boolean;
  form: FormGroup = new FormGroup({
    numberOfDays: new FormControl(13, Validators.required),
    durations: new FormControl("")
  });

  data: Views = { type: "", data: [] };

  dataArrAll: any[] = [];
  chartLabels: string[] = [];
  chartData: any[] = [];
  chartOptions: any[] = [];
  label: { id: number; xLabel: string } = {} as any;

  constructor(
    private httpService: HttpService,
    private stateService: StateService,
    private chartsService: ChartsService
  ) {
    super();
  }

  async ngOnInit() {
    this.stateService.start$.next(true);

    this.stateService.start$
      .pipe(takeUntil(this.destroy$))
      .subscribe((start: boolean) => {
        this.start = start;
      });

    this.stateService.numberOfDays$
      .pipe(takeUntil(this.destroy$))
      .subscribe((numberOfDays: number) => {
        this.numberOfDays.setValue(numberOfDays);
        if (!this.start) {
          this.inputChanged(true);
        }
      });

    this.stateService.loading$.next(true);
    this.domains = this.stateService.domains;
    this.durations.setValue("1");

    // Getting the labels
    this.chartLabels = this.chartsService.createChartLabel(
      Charts.bar,
      this.stateService.numberOfDays$.value
    );
    // Fetching the Data
    this.data = await this.httpService.getDurations(
      "average",
      this.stateService.domains
    );

    // Configuring the Chart
    const chartsObj = this.chartsService.configureChart(
      Charts.bar,
      this.data,
      this.stateService.domains,
      this.stateService.numberOfDays$.value
    );
    this.chartData = chartsObj.chartData;
    this.chartOptions = chartsObj.chartOptions;

    this.stateService.loading$.next(false);
  }

  get numberOfDays() {
    return this.form.get("numberOfDays");
  }
  get durations() {
    return this.form.get("durations");
  }

  async inputChanged(state?: boolean): Promise<void> {
    this.stateService.loading$.next(true);
    this.chartLabels = this.chartsService.createChartLabel(
      Charts.bar,
      this.numberOfDays.value
    );

    const chartsObj = this.chartsService.configureChart(
      Charts.bar,
      this.data,
      this.stateService.domains,
      this.numberOfDays.value
    );
    this.chartData = chartsObj.chartData;
    this.chartOptions = chartsObj.chartOptions;
    if (!state) {
      this.stateService.numberOfDays$.next(this.numberOfDays.value);
      this.stateService.getFromDate();
    }
    this.stateService.loading$.next(false);
  }

  async selectChanged(): Promise<void> {
    this.stateService.loading$.next(true);
    if (this.durations.value === "1") {
      this.data = await this.httpService.getDurations(
        "average",
        this.stateService.domains
      );
    } else {
      this.data = await this.httpService.getDurations(
        "detailed",
        this.stateService.domains
      );
    }
    const chartsObj = this.chartsService.configureChart(
      Charts.bar,
      this.data,
      this.stateService.domains,
      this.stateService.numberOfDays$.value
    );
    this.chartData = chartsObj.chartData;
    this.chartOptions = chartsObj.chartOptions;

    this.stateService.loading$.next(false);
  }

  getLoading(): boolean {
    return this.stateService.loading$.value;
  }
}
