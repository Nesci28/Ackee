import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { StateService } from "../../../services/state.service";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-date-picker",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.scss"]
})
export class DatePickerComponent extends BaseComponent implements OnInit {
  disabled: boolean;

  form: FormGroup = new FormGroup({
    singleDate: new FormControl("", Validators.required)
  });

  constructor(private stateService: StateService) {
    super();
  }

  ngOnInit() {
    this.singleDate.setValue(this.stateService.singleDate$.value);

    this.form.valueChanges.subscribe(_ => {
      this.stateService.singleDate$.next(this.singleDate.value);
    });

    this.stateService.datePickerDisable$
      .pipe(takeUntil(this.destroy$))
      .subscribe((disabled: boolean) => {
        this.disabled = disabled;
      });
  }

  get singleDate() {
    return this.form.get("singleDate");
  }
}
