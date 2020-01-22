import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { Charts, DurationsEnum, State, ViewsEnum } from "../../models/app.enum";
import { AppDomains } from "../../models/app.model";
import {
  Views,
  BackendData,
  BackendResponse
} from "../../models/backend.model";
import { ChartsService } from "../../services/charts.service";
import { HttpService } from "../../services/http.service";
import { StateService } from "../../services/state.service";
import { BaseComponent } from "../shared/base/base.component";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

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

  graphType: Charts;

  form: FormGroup = new FormGroup({
    views: new FormControl("1")
  });

  data: BackendData[];

  chartTitleName: string[];
  chartLabels: string[] = [];
  chartData: any[] = [];

  loading: boolean;

  fromDate: NgbDate;
  toDate: NgbDate;

  constructor(
    private httpService: HttpService,
    private stateService: StateService,
    private chartsService: ChartsService
  ) {
    super();
  }

  async ngOnInit() {
    this.stateService.loading$.next(true);
    this.stateService.start$.next(true);
    this.stateService.datePickerDisable$.next(false);
    this.domains = this.stateService.domains;

    this.initSubscriptions();

    this.chartTitleName = ["General"];
    this.domains.forEach(domain => {
      this.chartTitleName.push(domain.title);
    });

    this.chooseWhichGraphType();
    this.createChartLabel();
    await this.getData();
    this.createChartData();

    this.stateService.loading$.next(false);
  }

  get views() {
    return this.form.get("views");
  }

  async getData(domainId?: string): Promise<void> {
    let subType: string;
    if (this.stateService.state$.value === State.views) {
      if (this.views.value === "1") subType = ViewsEnum.unique;
      if (this.views.value === "2") subType = ViewsEnum.total;
      if (this.views.value === "3") subType = ViewsEnum.time;
    } else if (this.stateService.state$.value === State.durations) {
      if (this.views.value === "1") subType = DurationsEnum.average;
      if (this.views.value === "2") subType = DurationsEnum.detailed;
    }

    const dfTemp =
      subType === ViewsEnum.time || subType === DurationsEnum.detailed
        ? this.stateService.singleDate$.value
        : this.stateService.fromDate$.value;
    const dateFrom = this.stateService.convertNgbDateToString(dfTemp);
    const dtTemp =
      subType === ViewsEnum.time || subType === DurationsEnum.detailed
        ? this.stateService.singleDate$.value
        : this.stateService.toDate$.value;
    const dateTo = this.stateService.convertNgbDateToString(dtTemp);

    let data: BackendResponse;
    if (this.stateService.state$.value === State.views) {
      data = await this.httpService
        .getInfo(
          this.stateService.state$.value,
          dateFrom,
          dateTo,
          subType,
          domainId
        )
        .toPromise();
    } else if (this.stateService.state$.value === State.durations) {
      data = await this.httpService
        .postInfo(
          this.stateService.state$.value,
          dateFrom,
          dateTo,
          subType,
          this.domains.map(domain => domain.id)
        )
        .toPromise();
    }

    this.data = data.data;
  }

  createChartLabel(): void {
    if (this.graphType === Charts.bar) {
      this.chartLabels = this.chartsService.createChartLabelDate(
        this.fromDate,
        this.toDate
      );
    } else if (
      this.graphType === Charts.line ||
      this.graphType === Charts.bubble
    ) {
      this.chartLabels = this.chartsService.createChartLabelTime();
    }
  }

  createChartData(): void {
    this.chartData = [];
    if (this.graphType === Charts.bar) {
      this.chartData = this.chartsService.createChartBarDataAll(
        this.data,
        this.domains,
        this.chartLabels
      );
    } else if (this.graphType === Charts.line) {
      this.chartData = this.chartsService.createChartBarLineAll(
        this.data,
        this.domains,
        this.chartLabels
      );
    } else if (this.graphType === Charts.bubble) {
      this.chartData = this.chartsService.createChartBarBubbleAll(
        this.data,
        this.domains,
        this.chartLabels
      );
    }
  }

  async selectChanged(): Promise<void> {
    this.stateService.loading$.next(true);
    this.chooseWhichGraphType();
    this.createChartLabel();
    await this.getData();
    this.createChartData();
    this.stateService.loading$.next(false);
  }

  filterChartDataDomain(domainId: string): any {
    if (!this.loading) {
      return this.chartData.filter(data => data.domainId === domainId)[0].data;
    }
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

  chooseWhichGraphType(): void {
    if (
      (this.stateService.state$.value === State.views &&
        this.views.value !== "3") ||
      (this.stateService.state$.value === State.durations &&
        this.views.value === "1")
    ) {
      this.graphType = Charts.bar;
    } else if (
      this.stateService.state$.value === State.durations &&
      this.views.value === "2"
    ) {
      this.graphType = Charts.bubble;
    } else {
      this.graphType = Charts.line;
    }
  }

  showSpacer(index: number): boolean {
    if (this.graphType !== Charts.bubble) return true;
    if (
      this.graphType === Charts.bubble &&
      window.innerWidth > 991 &&
      index > 1
    )
      return true;
    if (
      this.graphType === Charts.bubble &&
      window.innerWidth <= 991 &&
      index > 0
    )
      return true;
    return false;
  }

  initSubscriptions(): void {
    this.stateService.start$
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: boolean) => {
        this.start = e;
      });

    this.stateService.singleDate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => {
        if (this.views.value !== "1") this.createChartData();
      });

    this.stateService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.loading = loading;
      });

    this.stateService.fromDate$
      .pipe(takeUntil(this.destroy$))
      .subscribe((fromDate: NgbDate) => {
        this.fromDate = fromDate;
      });

    this.stateService.toDate$
      .pipe(takeUntil(this.destroy$))
      .subscribe((toDate: NgbDate) => {
        this.toDate = toDate;
      });

    this.stateService.recalculate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (recalculate: boolean) => {
        if (recalculate) {
          this.stateService.loading$.next(true);
          this.createChartLabel();
          await this.getData();
          this.createChartData();
          this.stateService.recalculate$.next(false);
          this.stateService.loading$.next(false);
        }
      });
  }
}
