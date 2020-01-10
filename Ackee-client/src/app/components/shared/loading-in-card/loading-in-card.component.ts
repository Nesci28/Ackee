import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-loading-in-card",
  templateUrl: "./loading-in-card.component.html",
  styleUrls: ["./loading-in-card.component.scss"]
})
export class LoadingInCardComponent implements OnInit {
  @Input() type: string;

  constructor() {}

  ngOnInit() {}

  getHeight(): string {
    let res: number;
    if (window.innerWidth < 576)
      res = Math.round(((window.innerWidth - 32) * 331) / 541);
    if (window.innerWidth > 575) res = 314;
    if (window.innerWidth > 767) res = 404;
    if (window.innerWidth > 991) res = 524;
    if (window.innerWidth > 1199) res = 624;
    return this.type === "main" ? `${res}px` : `${Math.round(res / 2)}px`;
  }
}
