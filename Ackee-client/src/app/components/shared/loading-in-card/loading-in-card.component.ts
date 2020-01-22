import { Component, Input } from "@angular/core";

@Component({
  selector: "app-loading-in-card",
  templateUrl: "./loading-in-card.component.html",
  styleUrls: ["./loading-in-card.component.scss"]
})
export class LoadingInCardComponent {
  @Input() type: string;

  constructor() {}

  getHeight(): string {
    let res: number;
    if (window.innerWidth < 576)
      res = Math.round((window.innerWidth - 32 - 40) / 2);
    if (window.innerWidth > 575) res = 233;
    if (window.innerWidth > 767) res = 323;
    if (window.innerWidth > 991) res = this.type === "main" ? 443 : 203;
    if (window.innerWidth > 1199) res = this.type === "main" ? 533 : 248;
    return `${res}px`;
  }
}
