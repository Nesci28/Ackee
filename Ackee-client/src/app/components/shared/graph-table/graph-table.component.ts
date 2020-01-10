import { Component, OnInit, Input } from "@angular/core";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { AppDomains } from "../../../models/app.model";
import { StateService } from "../../../services/state.service";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-graph-table",
  templateUrl: "./graph-table.component.html",
  styleUrls: ["./graph-table.component.scss"]
})
export class GraphTableComponent extends BaseComponent implements OnInit {
  @Input() domain: AppDomains;
  @Input() pages: any;

  domains: AppDomains[];
  loading: boolean;
  showSpacer: any;

  constructor(private stateService: StateService) {
    super();
    this.showSpacer = stateService.showSpacer;
  }

  ngOnInit() {
    this.stateService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.loading = loading;
      });

    this.domains = this.stateService.domains;
  }

  getPagesByDomain(domainId: string): any {
    return this.pages.filter(lang => lang.id === domainId)[0];
  }
}
