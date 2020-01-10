import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { AppDomains } from "../../models/app.model";
import { Views } from "../../models/backend.model";
import { ChartsService } from "../../services/charts.service";
import { HttpService } from "../../services/http.service";
import { StateService } from "../../services/state.service";
import { BaseComponent } from "../shared/base/base.component";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { Charts, ViewsEnum, State, DurationsEnum } from "../../models/app.enum";

@Component({
  selector: "app-views-or-durations",
  templateUrl: "./views-or-durations.component.html",
  styleUrls: ["./views-or-durations.component.scss"]
})
export class ViewsOrDurationsComponent extends BaseComponent implements OnInit {
  domains: AppDomains[] = [];
  start: boolean = true;
  State = State;

  form: FormGroup = new FormGroup({
    numberOfDays: new FormControl(13, Validators.required),
    views: new FormControl("1")
  });

  data: Views = { type: "", data: [] };

  chartTitleName: string[];
  chartLabels: string[] = [];
  chartData: any[] = [];
  chartOptions: any[] = [];

  loading: boolean;

  constructor(
    private httpService: HttpService,
    private stateService: StateService,
    private chartsService: ChartsService
  ) {
    super();
  }

  async ngOnInit() {
    this.stateService.start$.next(true);
    this.stateService.datePickerDisable$.next(false);
    this.domains = this.stateService.domains;

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
    this.chartTitleName = ["General"];
    this.domains.forEach(domain => {
      this.chartTitleName.push(domain.title);
    });
    this.createChartLabel();
    await this.getData();
    this.configureChart();

    this.stateService.loading$.next(false);
  }

  get numberOfDays() {
    return this.form.get("numberOfDays");
  }
  get views() {
    return this.form.get("views");
  }

  async inputChanged(state?: boolean): Promise<void> {
    this.stateService.loading$.next(true);
    this.configureChart();
    if (!state) {
      this.stateService.numberOfDays$.next(this.numberOfDays.value);
      this.stateService.getFromDate();
    }
    this.createChartLabel();
    this.stateService.loading$.next(false);
  }

  async selectChanged(): Promise<void> {
    this.stateService.loading$.next(true);
    await this.getData();
    if (this.showBar()) {
      this.configureChart();
    } else {
      this.configureChart(Charts.bubble);
    }
    this.stateService.loading$.next(false);
  }

  async getData(): Promise<void> {
    const type =
      this.stateService.state$.value === State.views
        ? this.views.value === "1"
          ? ViewsEnum.unique
          : ViewsEnum.unique
        : this.views.value === "1"
        ? DurationsEnum.average
        : DurationsEnum.detailed;
    this.data = await this.httpService.getViewsOrDurations(
      type,
      this.stateService.state$.value,
      this.stateService.domains
    );
  }

  createChartLabel(type?: string): void {
    if (!type) {
      this.chartLabels = this.chartsService.createChartBarLabel(
        this.numberOfDays.value
      );
    } else {
      this.chartLabels = this.chartsService.createChartBubbleLabel();
    }
  }

  configureChart(type?: string): void {
    let chartsObj: any;
    if (!type) {
      chartsObj = this.chartsService.configureChartBar(
        this.data,
        this.stateService.domains,
        this.numberOfDays.value
      );
    } else {
      chartsObj = this.chartsService.configureChartBubble(
        this.data,
        this.stateService.singleDate$.value
      );
    }
    this.chartData = chartsObj.chartData;
    console.log("this.chartData :", this.chartData);
    this.chartOptions = chartsObj.chartOptions;
  }

  moveToMain(index: number): void {
    const originalMain = this.chartData[0];
    const originalTitle = this.chartTitleName[0];
    this.chartData[0] = this.chartData[index + 1];
    this.chartData[index + 1] = originalMain;
    this.chartTitleName[0] = this.chartTitleName[index + 1];
    this.chartTitleName[index + 1] = originalTitle;
  }

  getTitle(): string {
    if (this.stateService.state$.value === State.views) {
      return this.views.value === "1" ? "Site views" : "Page views";
    } else if (this.stateService.state$.value === State.durations) {
      return this.views.value === "1" ? "Average Durations" : "Easter Eggs";
    }
  }

  getOptions(): string[] {
    if (this.stateService.state$.value === State.views) {
      return ["Unique site views", "Total page views"];
    } else if (this.stateService.state$.value === State.durations) {
      return ["Average durations", "Detailed durations"];
    }
  }

  showBar(): boolean {
    return (
      this.stateService.state$.value === State.views ||
      (this.stateService.state$.value === State.durations &&
        this.views.value === "1")
    );
  }
}
