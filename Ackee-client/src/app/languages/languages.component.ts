import { Component, OnInit, AfterViewInit } from "@angular/core";
import { StateService } from "../services/state.service";

@Component({
  selector: "app-languages",
  templateUrl: "./languages.component.html",
  styleUrls: ["./languages.component.scss"]
})
export class LanguagesComponent implements OnInit, AfterViewInit {
  constructor(private stateService: StateService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.stateService.loading$.next(false);
    });
  }
}
