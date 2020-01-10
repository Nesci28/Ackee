import { Component, Input, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { StateService } from "../../../services/state.service";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-graph-bar",
  templateUrl: "./graph-bar.component.html",
  styleUrls: ["./graph-bar.component.scss"]
})
export class GraphBarComponent extends BaseComponent implements OnInit {
  @Input() optionValue: string;
  @Input() chartData: any;
  @Input() chartLabels: string[];
  @Input() chartOptions: any;
  @Input() loadingType: string;

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
  }
}
