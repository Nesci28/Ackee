import { Component } from "@angular/core";

import { State } from "../../models/app.enum";
import { StateService } from "../../services/state.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
  State = State;

  constructor(private stateService: StateService) {}

  getRoute(): string {
    return this.stateService.state$.value;
  }

  setRoute(route: State): void {
    if (route !== this.stateService.state$.value) {
      this.stateService.loading$.next(true);
      this.stateService.state$.next(route);
    }
  }

  getLoading(): boolean {
    return this.stateService.loading$.value;
  }
}
