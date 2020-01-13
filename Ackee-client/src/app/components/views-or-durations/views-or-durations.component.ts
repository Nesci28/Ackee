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
  Charts = Charts;

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
          this.inputChanged();
        }
      });

    this.stateService.singleDate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => {
        if (this.views.value !== "1") {
          this.configureChart();
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

  async inputChanged(): Promise<void> {
    this.stateService.loading$.next(true);
    this.configureChart();
    if (this.showBar() === Charts.bar) {
      this.stateService.numberOfDays$.next(this.numberOfDays.value);
      this.stateService.getFromDate();
    }
    this.createChartLabel();
    this.stateService.loading$.next(false);
  }

  async selectChanged(): Promise<void> {
    this.stateService.loading$.next(true);
    await this.getData();
    this.createChartLabel();
    this.configureChart();
    this.stateService.loading$.next(false);
  }

  async getData(): Promise<void> {
    let type: string;
    if (this.stateService.state$.value === State.views) {
      if (this.views.value === "1") type = ViewsEnum.unique;
      if (this.views.value === "2") type = ViewsEnum.total;
      if (this.views.value === "3") type = ViewsEnum.time;
    } else if (this.stateService.state$.value === State.durations) {
      if (this.views.value === "1") type = DurationsEnum.average;
      if (this.views.value === "2") type = DurationsEnum.detailed;
    }

    this.data = await this.httpService.getViewsOrDurations(
      type,
      this.stateService.state$.value,
      this.stateService.domains
    );
  }

  createChartLabel(): void {
    if (this.showBar() === Charts.bar) {
      this.chartLabels = this.chartsService.createChartBarLabel(
        this.numberOfDays.value
      );
    } else {
      this.chartLabels = this.chartsService.createChartBubbleOrLineLabel();
      console.log("this.chartLabels :", this.chartLabels);
    }
  }

  configureChart(): void {
    this.chartData = [];
    this.chartOptions = [];

    let chartsObj: any;
    if (this.showBar() === Charts.bar) {
      chartsObj = this.chartsService.configureChartBar(
        this.data,
        this.stateService.domains,
        this.numberOfDays.value
      );
      this.chartData = chartsObj.chartData;
    } else if (this.showBar() === Charts.bubble) {
      chartsObj = this.chartsService.configureChartBubble(
        this.data,
        this.stateService.singleDate$.value
      );
      const tempChartData = chartsObj.chartData;
      this.domains.forEach((domain: AppDomains) => {
        const data = tempChartData.filter(
          (el: any) => el.domainId === domain.id
        )[0].data;
        this.chartData.push(data);
      });
    } else if (this.showBar() === Charts.line) {
      chartsObj = this.chartsService.configureChartLine(
        this.data,
        this.stateService.singleDate$.value
      );
      this.chartData = chartsObj.chartData;
    }

    this.chartOptions = chartsObj.chartOptions;
  }

  filterChartDataDomain(domainId: string): any {
    return this.chartData.filter(data => data.domainId === domainId)[0].data;
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
      return ["Unique site views", "Total page views", "Visited Times"];
    } else if (this.stateService.state$.value === State.durations) {
      return ["Average durations", "Detailed durations"];
    }
  }

  showBar(): Charts {
    if (
      (this.stateService.state$.value === State.views &&
        this.views.value !== "3") ||
      (this.stateService.state$.value === State.durations &&
        this.views.value === "1")
    ) {
      return Charts.bar;
    } else if (
      this.stateService.state$.value === State.durations &&
      this.views.value === "2"
    ) {
      return Charts.bubble;
    } else {
      return Charts.line;
    }
  }

  showSpacer(index: number): boolean {
    if (this.views.value !== "2") return true;
    else if (this.views.value === "2") {
      if (window.innerWidth > 991 && index > 1) return true;
      if (window.innerWidth <= 991 && index > 0) return true;
      return false;
    }
  }
}
