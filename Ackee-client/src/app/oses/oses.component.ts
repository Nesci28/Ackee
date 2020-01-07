import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { Charts } from "../models/app.enum";
import { AppDomains } from "../models/app.model";
import { Oses, OsesData } from "../models/backend.model";
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
    this.stateService.start$.next(true);

    this.stateService.start$
      .pipe(takeUntil(this.destroy$))
      .subscribe((start: boolean) => {
        this.start = start;
      });

    // this.stateService.numberOfDays$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((numberOfDays: number) => {
    //     this.numberOfDays.setValue(numberOfDays);
    //     if (!this.start) {
    //       this.inputChanged(true);
    //     }
    //   });

    this.stateService.loading$.next(true);
    this.domains = this.stateService.domains;
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
      console.log("this.chartData[i] :", this.chartData[i]);
    });

    this.stateService.loading$.next(false);
  }

  getLoading(): boolean {
    return this.stateService.loading$.value;
  }
}
