import { Component, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { State } from "./models/app.enum";
import { StateService } from "./services/state.service";
import { BaseComponent } from "./components/shared/base/base.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent extends BaseComponent implements OnInit {
  title = "Ackee-client";
  state: State;
  State = State;

  constructor(private stateService: StateService) {
    super();
  }

  ngOnInit() {
    this.stateService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: State) => (this.state = state));
  }
}
