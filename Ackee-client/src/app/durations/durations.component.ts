import { Component, OnInit } from "@angular/core";

import { BaseComponent } from "../shared/base/base.component";

@Component({
  selector: "app-durations",
  templateUrl: "./durations.component.html",
  styleUrls: ["./durations.component.scss"]
})
export class DurationsComponent extends BaseComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
