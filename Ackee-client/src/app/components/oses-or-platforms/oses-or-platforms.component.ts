import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { RadioChoices } from "../../models/app.enum";
import { AppDomains } from "../../models/app.model";
import { BackendData, BackendResponse } from "../../models/backend.model";
import { ChartsService } from "../../services/charts.service";
import { HttpService } from "../../services/http.service";
import { StateService } from "../../services/state.service";
import { BaseComponent } from "../shared/base/base.component";

@Component({
  selector: "app-oses-or-platforms",
  templateUrl: "./oses-or-platforms.component.html",
  styleUrls: ["./oses-or-platforms.component.scss"]
})
export class OsesOrPlatformsComponent extends BaseComponent implements OnInit {
  domains: AppDomains[] = [];
  start: boolean = true;
  disabled: boolean;
  loading: boolean;

  form: FormGroup = new FormGroup({
    radioChoice: new FormControl("all", Validators.required)
  });

  data: BackendData[];

  chartLabels: string[][] = [[]];
  chartData: any[] = [];

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
    this.stateService.datePickerDisable$.next(true);
    this.domains = this.stateService.domains;

    this.initSubscriptions();

    await this.getData();
    this.chartLabels = this.chartsService.createChartPieLabel(this.data);
    this.chartData = this.chartsService.createChartPieAll(
      this.data,
      this.chartLabels
    );

    this.stateService.loading$.next(false);
  }

  get radioChoice() {
    return this.form.get("radioChoice");
  }

  async getData(): Promise<void> {
    let data: BackendResponse;
    if (this.radioChoice.value === RadioChoices.all) {
      data = await this.httpService
        .getInfo(this.stateService.state$.value)
        .toPromise();
    }
    if (this.radioChoice.value === RadioChoices.selected) {
      const tempFrom = this.stateService.convertNgbDateToString(
        this.stateService.fromDate$.value
      );
      const tempTo = this.stateService.convertNgbDateToString(
        this.stateService.toDate$.value
      );
      data = await this.httpService
        .getInfo(this.stateService.state$.value, tempFrom, tempTo)
        .toPromise();
    }

    this.data = data.data;
  }

  async radioChoiceChanged(): Promise<void> {
    this.stateService.loading$.next(true);
    if (this.radioChoice.value === RadioChoices.all) {
      this.stateService.datePickerDisable$.next(true);
    } else if (this.radioChoice.value === RadioChoices.selected) {
      this.stateService.datePickerDisable$.next(false);
    }
    await this.getData();
    this.chartLabels = this.chartsService.createChartPieLabel(this.data);
    this.chartData = this.chartsService.createChartPieAll(
      this.data,
      this.chartLabels
    );
    this.stateService.loading$.next(false);
  }

  showSpacer(index: number): boolean {
    return this.stateService.showSpacer(index);
  }

  initSubscriptions(): void {
    this.stateService.start$
      .pipe(takeUntil(this.destroy$))
      .subscribe((start: boolean) => {
        this.start = start;
      });

    this.stateService.datePickerDisable$
      .pipe(takeUntil(this.destroy$))
      .subscribe((disabled: boolean) => {
        this.disabled = disabled;
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
          await this.getData();
          this.chartLabels = this.chartsService.createChartPieLabel(this.data);
          this.chartData = this.chartsService.createChartPieAll(
            this.data,
            this.chartLabels
          );
          this.stateService.recalculate$.next(false);
          this.stateService.loading$.next(false);
        }
      });
  }
}
