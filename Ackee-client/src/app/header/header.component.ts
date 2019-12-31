import { Component, OnInit } from "@angular/core";
import { StateService } from "../services/state.service";
import { State } from "../models/state.enum";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  State = State;

  constructor(private stateService: StateService) {}

  ngOnInit() {}

  getRoute(): string {
    return this.stateService.state$.value;
  }

  setRoute(route: State): void {
    this.stateService.state$.next(route);
  }

  getLoading(): boolean {
    return this.stateService.loading$.value;
  }
}
