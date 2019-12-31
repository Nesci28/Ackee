import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { AppDomains } from "../models/app.model";
import { Views } from "../models/backend.model";
import { HttpService } from "../services/http.service";
import { StateService } from "../services/state.service";
import { BaseComponent } from "../shared/base/base.component";

@Component({
  selector: "app-views",
  templateUrl: "./views.component.html",
  styleUrls: ["./views.component.scss"]
})
export class ViewsComponent extends BaseComponent implements OnInit {
  domains: AppDomains[] = [];

  form: FormGroup = new FormGroup({
    views: new FormControl("")
  });

  dataArrAll: any[] = [];
  chartLabels: string[] = [];
  chartData: any[] = [];
  chartOptions: any[] = [];
  chartSubTitle: string[] = [];
  label: { id: number; xLabel: string } = {} as any;

  constructor(
    private httpService: HttpService,
    private stateService: StateService
  ) {
    super();
  }

  async ngOnInit() {
    this.domains = this.stateService.domains;

    this.stateService.loading$.next(true);
    this.views.setValue("1");
    for (let i = 14; i >= 1; i--) {
      this.chartLabels.push((new Date().getDate() - i).toString());
    }

    await this.getViewsFromAPI("unique");
    await this.configureChart();
  }

  get views() {
    return this.form.get("views");
  }

  async selectChanged(): Promise<void> {
    this.stateService.loading$.next(false);
    if (this.views.value === "1") {
      await this.getViewsFromAPI("unique");
    } else {
      await this.getViewsFromAPI("total");
    }
    await this.configureChart();
    this.stateService.loading$.next(true);
  }

  async getViewsFromAPI(type: string): Promise<void> {
    await this.resetDataArr();
    this.dataArrAll[0] = [
      0.1,
      0.1,
      0.1,
      0.1,
      0.1,
      0.1,
      0.1,
      0.1,
      0.1,
      0.1,
      0.1,
      0.1,
      0.1,
      0.1
    ];
    this.setChartOptions(0);
    this.stateService.domains.forEach((domain: AppDomains, i: number) => {
      if (!this.dataArrAll[i + 1]) {
        this.setChartOptions(i + 1);
        this.dataArrAll[i + 1] = [
          0.1,
          0.1,
          0.1,
          0.1,
          0.1,
          0.1,
          0.1,
          0.1,
          0.1,
          0.1,
          0.1,
          0.1,
          0.1,
          0.1
        ];
      }
      this.httpService
        .getViews(type, domain.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((view: Views) => {
          if (view.data.length > 0) {
            view.data.forEach((data: any) => {
              const diffDays = this.getDiffDays(data);
              if (this.dataArrAll[i + 1][diffDays] === 0.1)
                this.dataArrAll[i + 1][diffDays] = 0;
              if (this.dataArrAll[0][diffDays] === 0.1)
                this.dataArrAll[0][diffDays] = 0;
              this.dataArrAll[i + 1][diffDays] += data.data.count;
              this.dataArrAll[0][diffDays] += data.data.count;
            });
          }
        });
    });
  }

  configureChart(): void {
    setTimeout(() => {
      this.chartData = [];
      this.dataArrAll.forEach((data: number[], i: number) => {
        this.chartData.push([
          {
            data: data,
            backgroundColor: [
              "#6e7373",
              "#6e7373",
              "#6e7373",
              "#6e7373",
              "#6e7373",
              "#6e7373",
              "#6e7373",
              "#6e7373",
              "#6e7373",
              "#6e7373",
              "#6e7373",
              "#6e7373",
              "#6e7373",
              "#6e7373"
            ],
            hoverBackgroundColor: "#73fac8",
            hoverBorderColor: "#73fac8"
          }
        ]);
        this.chartOptions[i].scales.yAxes[0].ticks.max = Math.max(...data);
        if (this.chartOptions[i].scales.yAxes[0].ticks.max === 0.1) {
          this.chartOptions[i].scales.yAxes[0].ticks.max = 4;
        } else {
          if ((this.chartOptions[i].scales.yAxes[0].ticks.max & 1) !== 0) {
            this.chartOptions[i].scales.yAxes[0].ticks.max +=
              Math.round(this.chartOptions[i].scales.yAxes[0].ticks.max * 0.1) +
              1;
          } else {
            this.chartOptions[i].scales.yAxes[0].ticks.max += Math.round(
              this.chartOptions[i].scales.yAxes[0].ticks.max * 0.1
            );
          }
        }
      });
      this.stateService.loading$.next(false);
    }, 500);
  }

  setChartOptions(i: number): void {
    this.chartOptions.push({
      responsive: true,
      drawBorder: false,
      gridLines: {
        drawBorder: false
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              padding: 10,
              fontSize: 16
            },
            gridLines: {
              display: true,
              drawBorder: false
            }
          }
        ]
      },
      tooltips: {
        enabled: true,
        mode: "x-axis",
        yAlign: "bottom",
        backgroundColor: "#fff",
        titleFontSize: 20,
        titleFontColor: "#333",
        xPadding: 10,
        cornerRadius: 0,
        titleMarginBottom: 0,
        callbacks: {
          title: tooltipItem => {
            return +tooltipItem[0].value === 0.1 ? "0" : tooltipItem[0].value;
          },
          label: tooltipItem => {
            this.label.id = tooltipItem.index;
            this.label.xLabel = tooltipItem.xLabel;
            return;
          }
        }
      },
      hover: {
        onHover: () => {
          this.chartSubTitle[i] = this.label.xLabel;
          // TODO: Update Color on hover
          // this.chartData[i][0].backgroundColor.forEach((_, j: number) => {
          //   this.chartData[i][0].backgroundColor[j] = "#6e7373";
          // });
          // this.chartData[i][0].backgroundColor[this.label.id] = "#73fac8";
        }
      }
    });
  }

  // Helpers
  resetDataArr(): void {
    this.dataArrAll.forEach((data, i) => {
      data.forEach((_, j) => {
        this.dataArrAll[i][j] = 0.1;
      });
    });
  }

  getLoading(): boolean {
    return this.stateService.loading$.value;
  }

  getDiffDays(data: any): number {
    const day = new Date(
      data.data.id.year,
      data.data.id.month,
      data.data.id.day
    );
    const today = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    );

    return Math.round(Math.abs((+day - +today) / (24 * 60 * 60 * 1000)));
  }
}
