import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { Charts } from "../models/app.enum";
import { AppDomains } from "../models/app.model";
import { Oses } from "../models/backend.model";
import { ChartsService } from "../services/charts.service";
import { HttpService } from "../services/http.service";
import { StateService } from "../services/state.service";
import { BaseComponent } from "../shared/base/base.component";

@Component({
  selector: "app-oses",
  templateUrl: "./oses.component.html",
  styleUrls: ["./oses.component.scss"]
})
export class OsesComponent extends BaseComponent implements OnInit {
  domains: AppDomains[] = [];
  start: boolean = true;

  form: FormGroup = new FormGroup({
    numberOfDays: new FormControl(13, Validators.required),
    views: new FormControl("")
  });

  data: Oses = { type: "", data: [] };

  dataArrAll: any[] = [];
  chartLabels: string[][] = [[]];
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
    this.domains = this.stateService.domains;
    this.stateService.start$.next(true);

    this.stateService.start$
      .pipe(takeUntil(this.destroy$))
      .subscribe((start: boolean) => {
        this.start = start;
      });

    this.stateService.loading$.next(true);
    // this.views.setValue("1");

    // Fetching the Data
    this.data = await this.httpService.getOses(this.stateService.domains);

    this.domains.forEach((domain: AppDomains, i: number) => {
      const data = this.data.data.filter((e: any) => e.id === domain.id)[0];
      // Getting the labels
      this.chartLabels[i] = this.chartsService.createChartLabel(
        Charts.pie,
        0,
        data
      );
      const chartsObj = this.chartsService.configureChart(
        Charts.pie,
        data,
        [],
        0
      );
      // Configuring the Chart
      this.chartData[i] = chartsObj.chartData[0];
      this.chartOptions[i] = chartsObj.chartOptions[0];
    });

    this.stateService.loading$.next(false);
  }

  getLoading(): boolean {
    return this.stateService.loading$.value;
  }

  getHeight(): string {
    let res: number;
    if (window.innerWidth < 576)
      res = Math.round(((window.innerWidth - 73) * 250) / 501);
    if (window.innerWidth > 575) res = 233;
    if (window.innerWidth > 767) res = 323;
    if (window.innerWidth > 991) res = 203;
    if (window.innerWidth > 1199) res = 248;
    return `${res}px`;
  }

  showSpacer(index: number): boolean {
    if (window.innerWidth > 991 && index > 1) return true;
    if (window.innerWidth <= 991 && index > 0) return true;
    return false;
  }
}
