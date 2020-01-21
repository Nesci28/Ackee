import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { AppDomains } from "../../models/app.model";
import { ChartsService } from "../../services/charts.service";
import { HttpService } from "../../services/http.service";
import { StateService } from "../../services/state.service";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { BaseComponent } from "../shared/base/base.component";
import { BackendResponse } from "../../models/backend.model";
import { RadioChoices } from "../../models/app.enum";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"]
})
export class EventsComponent extends BaseComponent implements OnInit {
  form: FormGroup = new FormGroup({
    domain: new FormControl("", Validators.required),
    radioChoice: new FormControl("all", Validators.required)
  });

  domains: AppDomains[];
  loading: boolean;
  data: any = [[]];
  chartLabels: any[];
  chartData: any[];

  constructor(
    private stateService: StateService,
    private chartsService: ChartsService,
    private httpService: HttpService
  ) {
    super();
  }

  async ngOnInit() {
    this.stateService.loading$.next(true);
    this.domains = this.stateService.domains;
    this.domain.setValue(this.domains[0].id);

    this.initSubscriptions();

    await this.getData();
    this.chartLabels = this.chartsService.createChartEventsLabel(this.data);
    this.chartData = this.chartsService.createChartEventSingle(this.data);
    this.stateService.loading$.next(false);
  }

  get domain() {
    return this.form.get("domain");
  }
  get radioChoice() {
    return this.form.get("radioChoice");
  }

  async getData(): Promise<void> {
    let data: BackendResponse;
    if (this.radioChoice.value === RadioChoices.all) {
      data = await this.httpService
        .getInfo(this.stateService.state$.value, "", "", "", this.domain.value)
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
        .getInfo(
          this.stateService.state$.value,
          tempFrom,
          tempTo,
          "",
          this.domain.value
        )
        .toPromise();
    }

    this.data = data.data;
  }

  filterChartDataDomain(): any {
    if (!this.loading) {
      return this.chartData.filter(
        data => data.domainId === this.domain.value
      )[0];
    }
  }

  async selectChanged(): Promise<void> {
    this.stateService.loading$.next(true);
    await this.getData();
    this.chartLabels = this.chartsService.createChartEventsLabel(this.data);
    this.chartData = this.chartsService.createChartEventSingle(this.data);
    this.stateService.loading$.next(false);
  }

  async radioChoiceChanged(): Promise<void> {
    this.stateService.loading$.next(true);
    if (this.radioChoice.value === RadioChoices.all) {
      this.stateService.datePickerDisable$.next(true);
    } else if (this.radioChoice.value === RadioChoices.selected) {
      this.stateService.datePickerDisable$.next(false);
    }
    await this.getData();
    this.chartLabels = this.chartsService.createChartEventsLabel(this.data);
    this.chartData = this.chartsService.createChartEventSingle(this.data);
    this.stateService.loading$.next(false);
  }

  showSpacer(index: number): boolean {
    return this.stateService.showSpacer(index);
  }

  getDomainTitle(): string {
    return this.domains.filter(domain => domain.id === this.domain.value)[0]
      .title;
  }

  initSubscriptions(): void {
    this.stateService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.loading = loading;
      });

    this.stateService.recalculate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (recalculate: boolean) => {
        if (recalculate) {
          this.stateService.loading$.next(true);
          await this.getData();
          this.chartLabels = this.chartsService.createChartEventsLabel(
            this.data
          );
          this.chartData = this.chartsService.createChartEventSingle(this.data);
          this.stateService.recalculate$.next(false);
          this.stateService.loading$.next(false);
        }
      });
  }
}
