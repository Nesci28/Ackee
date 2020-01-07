import { Component, OnInit, AfterViewInit } from "@angular/core";
import { StateService } from "../services/state.service";

@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.scss"]
})
export class PagesComponent implements OnInit, AfterViewInit {
  constructor(private stateService: StateService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.stateService.loading$.next(false);
    });
  }
}
