import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { StateService } from "../../../services/state.service";

@Component({
  selector: "app-date-picker",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.scss"]
})
export class DatePickerComponent implements OnInit {
  form: FormGroup = new FormGroup({
    singleDate: new FormControl("", Validators.required)
  });

  constructor(private stateService: StateService) {}

  ngOnInit() {
    this.singleDate.setValue(this.stateService.singleDate$.value);

    this.form.valueChanges.subscribe(_ => {
      this.stateService.singleDate$.next(this.singleDate.value);
    });
  }

  get singleDate() {
    return this.form.get("singleDate");
  }
}
