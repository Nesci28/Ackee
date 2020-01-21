import { Component, Input, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { StateService } from "../../../services/state.service";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-graph-pie",
  templateUrl: "./graph-pie.component.html",
  styleUrls: ["./graph-pie.component.scss"]
})
export class GraphPieComponent extends BaseComponent implements OnInit {
  @Input() chartData: any;
  @Input() chartLabels: string;
  @Input() loadingType: boolean;

  loading: boolean;
  options: any;

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

  getHeight(): string {
    return this.stateService.getHeight();
  }

  createOptions(): void {
    this.options = {
      responsive: true,
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
            return tooltipItem[0].value;
          }
        }
      }
    };
  }

  showGraph(): boolean {
    if (!this.chartData) return false;
    return this.chartData[0].data.filter((el: number) => el > 0).length > 0;
  }
}
