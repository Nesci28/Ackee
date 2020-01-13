import { Component, OnInit, Input } from "@angular/core";

import { StateService } from "../../../services/state.service";
import { AppDomains } from "../../../models/app.model";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { BaseComponent } from "../base/base.component";
import { Charts } from "../../../models/app.enum";

@Component({
  selector: "app-graph-pie",
  templateUrl: "./graph-pie.component.html",
  styleUrls: ["./graph-pie.component.scss"]
})
export class GraphPieComponent extends BaseComponent implements OnInit {
  @Input() domain: AppDomains;
  @Input() chartData: any;
  @Input() chartLabels: string;
  @Input() chartOptions: any;

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

    this.domains = this.stateService.domains;
  }

  getHeight(): string {
    return this.stateService.getHeight();
  }

  showGraph(): boolean {
    if (!this.chartData) return false;
    return this.chartData[0].data.filter((el: number) => el > 0).length > 0;
  }
}
