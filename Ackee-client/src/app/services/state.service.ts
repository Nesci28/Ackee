import { Injectable } from "@angular/core";
import { NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date";
import { BehaviorSubject } from "rxjs";

import { State } from "../models/app.enum";
import { AppDomains } from "../models/app.model";

@Injectable({
  providedIn: "root"
})
export class StateService {
  token: string;
  domains: AppDomains[];
  state$: BehaviorSubject<State> = new BehaviorSubject<State>(State.login);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  fromDate$: BehaviorSubject<NgbDate> = new BehaviorSubject<NgbDate>("" as any);
  toDate$: BehaviorSubject<NgbDate> = new BehaviorSubject<NgbDate>("" as any);
  start$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  datePickerDisable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  singleDate$: BehaviorSubject<NgbDate> = new BehaviorSubject<NgbDate>(
    "" as any
  );
  recalculate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private calendar: NgbCalendar) {
    this.getFromDate();
    this.toDate$.next(this.calendar.getToday());

    const today = new Date();
    this.singleDate$.next({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    } as any);
  }

  getFromDate(): void {
    this.fromDate$.next(
      this.calendar.getNext(this.calendar.getToday(), "d", -13)
    );
  }

  showSpacer(index: number): boolean {
    if (window.innerWidth > 991 && index > 1) return true;
    if (window.innerWidth <= 991 && index > 0) return true;
    return false;
  }

  convertNgbDateToString(date: NgbDate): string {
    return `${date.year}-${date.month
      .toString()
      .padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`;
  }

  getHeight(): string {
    let res: number;
    if (window.innerWidth < 576)
      res = Math.round((window.innerWidth - 32 - 40) / 2);
    if (window.innerWidth > 575) res = 233;
    if (window.innerWidth > 767) res = 323;
    if (window.innerWidth > 991) res = 203;
    if (window.innerWidth > 1199) res = 248;
    return `${res}px`;
  }
}
