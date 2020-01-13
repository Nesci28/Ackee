import { Component, OnInit, Input } from "@angular/core";
import { AppDomains } from "../../../models/app.model";
import { BaseComponent } from "../base/base.component";
import { StateService } from "../../../services/state.service";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

@Component({
  selector: "app-graph-line",
  templateUrl: "./graph-line.component.html",
  styleUrls: ["./graph-line.component.scss"]
})
export class GraphLineComponent extends BaseComponent implements OnInit {
  @Input() domain: AppDomains;
  @Input() chartData: any;
  @Input() chartLabels: string;
  @Input() loadingType: string;

  chartOptions: any;
  domains: AppDomains[];
  loading: boolean;

  constructor(private stateService: StateService) {
    super();
  }

  ngOnInit() {
    this.stateService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.loading = loading;
      });

    this.chartOptions = {
      responsive: true,
      drawBorder: false,
      gridLines: {
        drawBorder: false
      },
      layout: {
        padding: {
          top: 40
        }
      },
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              padding: 10,
              fontSize: 16,
              max: 23,
              stepSize: 1
            },
            gridLines: {
              display: false,
              drawBorder: false
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
        mode: "nearest",
        yAlign: "bottom",
        backgroundColor: "#fff",
        titleFontSize: 24,
        titleFontColor: "#333",
        titleAlign: "center",
        bodyFontColor: "#333",
        xPadding: 10,
        cornerRadius: 0,
        titleMarginBottom: 0,
        displayColors: false,
        callbacks: {
          title: (tooltipItem: any) => {
            return +tooltipItem[0].value === 0.1 ? "0" : tooltipItem[0].value;
          },
          label: (tooltipItem: any, data: any) => {
            const index = tooltipItem.index;
            return data.datasets[0].data[index].r;
          }
        }
      }
    };

    this.domains = this.stateService.domains;
  }

  showGraph(): boolean {
    return this.chartData.data.length === 0 ? false : true;
  }

  getHeight(): string {
    return this.stateService.getHeight();
  }

  checkIfChartDataHasData(): boolean {
    if (this.chartData[0]) {
      return this.chartData[0].data.filter(el => el !== 0).length > 0;
    }
    return false;
  }
}
