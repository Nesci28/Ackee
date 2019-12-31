import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { AppDomains } from "../models/app.model";
import { Views } from "../models/backend.model";
import { ChartsService } from "../services/charts.service";
import { HttpService } from "../services/http.service";
import { StateService } from "../services/state.service";
import { BaseComponent } from "../shared/base/base.component";

@Component({
  selector: "app-views",
  templateUrl: "./views.component.html",
  styleUrls: ["./views.component.scss"]
})
export class ViewsComponent extends BaseComponent implements OnInit {
  numberOfDays: number = 13;
  domains: AppDomains[] = [];

  form: FormGroup = new FormGroup({
    views: new FormControl("")
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
    this.stateService.loading$.next(true);
    this.domains = this.stateService.domains;
    this.views.setValue("1");

    // Getting the labels
    this.chartLabels = this.chartsService.createChartLabel(this.numberOfDays);
    // Fetching the Data
    this.data = await this.httpService.getViews(
      "unique",
      this.stateService.domains
    );
    // Configuring the Chart
    const chartsObj = this.chartsService.configureChart(
      this.data,
      this.stateService.domains.length,
      this.numberOfDays,
      this.label
    );
    this.chartData = chartsObj.chartData;
    this.chartOptions = chartsObj.chartOptions;

    this.stateService.loading$.next(false);
  }

  get views() {
    return this.form.get("views");
  }

  async selectChanged(): Promise<void> {
    this.stateService.loading$.next(true);
    if (this.views.value === "1") {
      this.data = await this.httpService.getViews(
        "unique",
        this.stateService.domains
      );
    } else {
      this.data = await this.httpService.getViews(
        "total",
        this.stateService.domains
      );
    }
    const chartsObj = this.chartsService.configureChart(
      this.data,
      this.stateService.domains.length,
      this.numberOfDays,
      this.label
    );
    this.chartData = chartsObj.chartData;
    this.chartOptions = chartsObj.chartOptions;

    this.stateService.loading$.next(false);
  }

  getLoading(): boolean {
    return this.stateService.loading$.value;
  }
}
