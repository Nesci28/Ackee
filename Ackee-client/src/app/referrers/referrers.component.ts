import { Component, OnInit, AfterViewInit } from "@angular/core";
import { StateService } from "../services/state.service";

@Component({
  selector: "app-referrers",
  templateUrl: "./referrers.component.html",
  styleUrls: ["./referrers.component.scss"]
})
export class ReferrersComponent implements OnInit, AfterViewInit {
  constructor(private stateService: StateService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.stateService.loading$.next(false);
    });
  }
}
