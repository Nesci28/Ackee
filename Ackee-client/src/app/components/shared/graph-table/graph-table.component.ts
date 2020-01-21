import { Component, Input, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { StateService } from "../../../services/state.service";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-graph-table",
  templateUrl: "./graph-table.component.html",
  styleUrls: ["./graph-table.component.scss"]
})
export class GraphTableComponent extends BaseComponent implements OnInit {
  @Input() chartData: any;
  @Input() siteLocation: string;

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

  getHeight(): string {
    return this.stateService.getHeight();
  }
}
