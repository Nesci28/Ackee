import { Component, Input, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { StateService } from "../../../services/state.service";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-graph-line",
  templateUrl: "./graph-line.component.html",
  styleUrls: ["./graph-line.component.scss"]
})
export class GraphLineComponent extends BaseComponent implements OnInit {
  @Input() chartData: any;
  @Input() chartLabels: string;
  @Input() loadingType: string;

  loading: boolean;
  options: any;
  colors: any;

  constructor(private stateService: StateService) {
    super();
  }

  ngOnInit() {
    this.stateService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.loading = loading;
      });

    this.createOptions();
    this.createColors();
  }

  createColors(): void {
    this.colors = [
      {
        backgroundColor: "rgba(115,250,200,0.2)",
        borderColor: "#73fac8",
        pointBackgroundColor: "rgba(148,159,177,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#73fac8"
      }
    ];
  }

  createOptions(): void {
    this.options = {
      responsive: true,
      legend: {
        display: false
      },
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
  }
}
