import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { RadioChoices, State } from "../../models/app.enum";
import { AppDomains } from "../../models/app.model";
import { BackendData, BackendResponse } from "../../models/backend.model";
import { ChartsService } from "../../services/charts.service";
import { HttpService } from "../../services/http.service";
import { StateService } from "../../services/state.service";
import { BaseComponent } from "../shared/base/base.component";

@Component({
  selector: "app-pages-or-languages",
  templateUrl: "./pages-or-languages.component.html",
  styleUrls: ["./pages-or-languages.component.scss"]
})
export class PagesOrLanguagesComponent extends BaseComponent implements OnInit {
  State = State;
  domains: AppDomains[] = [];
  start: boolean = true;
  disabled: boolean;
  loading: boolean;
  state: State;

  pages = [];
  urls: any[] = [];
  originalUrls: any[] = [];

  data: BackendData[];
  chartData: any = [];

  form: FormGroup = new FormGroup({
    subUrl: new FormControl("/"),
    radioChoice: new FormControl("all", Validators.required)
  });

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
    this.state = this.stateService.state$.value;

    this.initSubscriptions();

    await this.getData();
    this.createChartData();
    this.generateSubUrls();

    this.stateService.loading$.next(false);
  }

  get subUrl() {
    return this.form.get("subUrl");
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

  createChartData(): void {
    this.chartData = [];
    this.chartData = this.chartsService.createChartTableAll(
      this.data,
      this.domains
    );
  }

  filterChartDataDomain(domainId: string): any {
    if (!this.loading) {
      return this.chartData.filter(data => data.domainId === domainId)[0];
    }
  }

  async radioChoiceChanged() {
    this.stateService.loading$.next(true);
    this.chartData = [];
    if (this.radioChoice.value === RadioChoices.all) {
      this.stateService.datePickerDisable$.next(true);
    } else if (this.radioChoice.value === RadioChoices.selected) {
      this.stateService.datePickerDisable$.next(false);
    }
    await this.getData();
    this.createChartData();
    this.generateSubUrls();
    this.stateService.loading$.next(false);
  }

  generateSubUrls(): void {
    if (this.stateService.state$.value === State.pages) {
      this.urls = [];
      this.chartData.forEach((domainData: any) => {
        let urls = new Set();
        urls.add("/");
        domainData.data.forEach((data: any) => {
          const arr = data.page.split("/").filter(String);
          if (arr.length > 0) urls.add([...arr]);
        });

        this.urls.push([...urls]);
      });
    }
  }

  selectChanged(index: number): void {
    if (this.subUrl.value !== "/") {
      if (!this.originalUrls[index]) {
        this.originalUrls[index] = JSON.parse(
          JSON.stringify(this.chartData[index].data)
        );
      }
      this.chartData[index].data = this.chartData[
        index
      ].data.filter((el: any) => el.page.includes(this.subUrl.value));
    } else {
      this.chartData[index].data = JSON.parse(
        JSON.stringify(this.originalUrls[index])
      );
    }
  }

  showSpacer(index: number): boolean {
    if (window.innerWidth > 991 && index > 1) return true;
    if (window.innerWidth <= 991 && index > 0) return true;
    return false;
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

    this.stateService.recalculate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (recalculate: boolean) => {
        if (recalculate) {
          this.stateService.loading$.next(true);
          await this.getData();
          this.createChartData();
          this.stateService.recalculate$.next(false);
          this.stateService.loading$.next(false);
        }
      });
  }
}
