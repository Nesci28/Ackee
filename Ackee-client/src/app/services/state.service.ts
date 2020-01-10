import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { AppDomains } from "../models/app.model";
import { State } from "../models/app.enum";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date";
import { NgbCalendar } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: "root"
})
export class StateService {
  token: string;
  domains: AppDomains[];
  state$: BehaviorSubject<State> = new BehaviorSubject<State>(State.login);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  numberOfDays$: BehaviorSubject<number> = new BehaviorSubject<number>(13);
  fromDate$: BehaviorSubject<NgbDate> = new BehaviorSubject<NgbDate>("" as any);
  toDate$: BehaviorSubject<NgbDate> = new BehaviorSubject<NgbDate>("" as any);
  start$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  datePickerDisable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  singleDate$: BehaviorSubject<NgbDate> = new BehaviorSubject<NgbDate>(
    "" as any
  );

  constructor(private calendar: NgbCalendar) {
    this.getFromDate();
    this.toDate$.next(this.calendar.getToday());

    this.singleDate$.next({ year: 2019, month: 12, day: 20 } as any);
  }

  getFromDate(): void {
    this.fromDate$.next(
      this.calendar.getNext(
        this.calendar.getToday(),
        "d",
        -this.numberOfDays$.value
      )
    );
  }

  showSpacer(index: number): boolean {
    if (window.innerWidth > 991 && index > 1) return true;
    if (window.innerWidth <= 991 && index > 0) return true;
    return false;
  }

  convertNgbDateToString(date: NgbDate): string {
    return `${date.month}/${date.day}/${date.year}`;
  }

  convertDateToString(date: Date): string {
    return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
  }

  isBetweenSelectedDates(date: string): boolean {
    const dateFrom = this.fromDate$.value;
    const dateTo = this.toDate$.value;

    const from = new Date(`${dateFrom.month}/${dateFrom.day}/${dateFrom.year}`);
    const to = new Date(`${dateTo.month}/${dateTo.day}/${dateTo.year}`);
    const check = new Date(date);

    return check > from && check < to;
  }
}
