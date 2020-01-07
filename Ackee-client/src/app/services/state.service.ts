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

  constructor(private calendar: NgbCalendar) {
    this.getFromDate();
    this.toDate$.next(this.calendar.getToday());
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
}
