import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter
} from "@ng-bootstrap/ng-bootstrap";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { StateService } from "../../../services/state.service";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-date-picker-range",
  templateUrl: "./date-picker-range.component.html",
  styleUrls: ["./date-picker-range.component.scss"]
})
export class DatePickerRangeComponent extends BaseComponent implements OnInit {
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  disabled: boolean;

  form: FormGroup = new FormGroup({});

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private stateService: StateService
  ) {
    super();
  }

  ngOnInit() {
    this.initSubscription();
  }

  onDateSelection(date: NgbDate): void {
    this.stateService.start$.next(false);
    if (
      !this.stateService.fromDate$.value &&
      !this.stateService.toDate$.value
    ) {
      this.stateService.fromDate$.next(date);
    } else if (
      this.stateService.fromDate$.value &&
      !this.stateService.toDate$.value &&
      date.after(this.stateService.fromDate$.value)
    ) {
      this.stateService.toDate$.next(date);
      this.stateService.recalculate$.next(true);
    } else {
      this.stateService.toDate$.next(null);
      this.stateService.fromDate$.next(date);
    }
  }

  isHovered(date: NgbDate): boolean {
    return (
      this.stateService.fromDate$.value &&
      !this.stateService.toDate$.value &&
      this.hoveredDate &&
      date.after(this.stateService.fromDate$.value) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate): boolean {
    return (
      date.after(this.stateService.fromDate$.value) &&
      date.before(this.stateService.toDate$.value)
    );
  }

  isRange(date: NgbDate): boolean {
    return (
      date.equals(this.stateService.fromDate$.value) ||
      date.equals(this.stateService.toDate$.value) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate, input: string): NgbDate {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  setDate(state: string, date: NgbDate): void {
    if (state === "fromDate") {
      this.stateService.fromDate$.next(date);
    } else if (state === "toDate") {
      this.stateService.toDate$.next(date);
    }
  }

  initSubscription(): void {
    this.stateService.datePickerDisable$
      .pipe(takeUntil(this.destroy$))
      .subscribe((disabled: boolean) => {
        this.disabled = disabled;
      });

    this.stateService.fromDate$
      .pipe(takeUntil(this.destroy$))
      .subscribe((fromDate: NgbDate) => {
        this.fromDate = fromDate;
      });

    this.stateService.toDate$
      .pipe(takeUntil(this.destroy$))
      .subscribe((toDate: NgbDate) => {
        this.toDate = toDate;
      });
  }
}
