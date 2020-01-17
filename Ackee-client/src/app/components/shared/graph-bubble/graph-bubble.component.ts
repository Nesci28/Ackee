import { Component, Input, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { StateService } from "../../../services/state.service";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-graph-bubble",
  templateUrl: "./graph-bubble.component.html",
  styleUrls: ["./graph-bubble.component.scss"]
})
export class GraphBubbleComponent extends BaseComponent implements OnInit {
  @Input() chartData: any;
  @Input() chartLabels: string;
  @Input() loadingType: string;

  options: any;
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

    this.createOptions();
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
            const value =
              +tooltipItem[0].value === 0.1 ? "0" : tooltipItem[0].value;
            return `${value}`;
          },
          label: (tooltipItem: any, data: any) => {
            const index = tooltipItem.index;
            return `${tooltipItem.label.padStart(2, "0")}:00 - ${
              data.datasets[0].data[index].r
            }`;
          }
        }
      }
    };
  }
}
