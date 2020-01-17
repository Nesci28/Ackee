import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { RadioChoices, State } from "../../models/app.enum";
import { AppDomains } from "../../models/app.model";
import { Oses } from "../../models/backend.model";
import { ChartsService } from "../../services/charts.service";
import { HttpService } from "../../services/http.service";
import { StateService } from "../../services/state.service";
import { BaseComponent } from "../shared/base/base.component";

@Component({
  selector: "app-oses-or-platforms",
  templateUrl: "./oses-or-platforms.component.html",
  styleUrls: ["./oses-or-platforms.component.scss"]
})
export class OsesOrPlatformsComponent extends BaseComponent implements OnInit {
  domains: AppDomains[] = [];
  start: boolean = true;
  showSpacer: any;
  disabled: boolean;

  form: FormGroup = new FormGroup({
    numberOfDays: new FormControl(13, Validators.required),
    radioChoice: new FormControl("all", Validators.required)
  });

  data: Oses = { type: "", data: [] };

  chartLabels: string[][] = [[]];
  chartData: any[] = [];
  chartOptions: any[] = [];

  constructor(
    private httpService: HttpService,
    private stateService: StateService,
    private chartsService: ChartsService
  ) {
    super();
    this.showSpacer = stateService.showSpacer;
  }

  async ngOnInit() {
    this.domains = this.stateService.domains;
    this.stateService.start$.next(true);
    this.stateService.datePickerDisable$.next(true);

    this.stateService.start$
      .pipe(takeUntil(this.destroy$))
      .subscribe((start: boolean) => {
        this.start = start;
      });

    this.stateService.datePickerDisable$
      .pipe(takeUntil(this.destroy$))
      .subscribe((disabled: boolean) => {
        this.disabled = disabled;
        if (disabled) {
          this.numberOfDays.setValue("");
          this.numberOfDays.disable();
        } else {
          this.numberOfDays.setValue(this.stateService.numberOfDays$.value);
          this.numberOfDays.enable();
        }
      });

    this.stateService.loading$.next(true);

    // Fetching the Data
    // await this.getData();

    this.generateChart();
    this.stateService.loading$.next(false);
  }

  get numberOfDays() {
    return this.form.get("numberOfDays");
  }
  get radioChoice() {
    return this.form.get("radioChoice");
  }

  // getData(): any {
  //   this.data = this.httpService.getInfo(
  //     type,
  //     this.stateService.state$.value,
  //     this.stateService.convertNgbDateToString(
  //       this.stateService.fromDate$.value
  //     ),
  //     this.stateService.convertNgbDateToString(this.stateService.toDate$.value),
  //     domainId)
  // }

  inputChanged(): void {
    this.stateService.numberOfDays$.next(this.numberOfDays.value);
    this.stateService.getFromDate();
    this.generateChart();
  }

  radioChoiceChanged() {
    if (this.radioChoice.value === RadioChoices.all) {
      this.stateService.datePickerDisable$.next(true);
    } else if (this.radioChoice.value === RadioChoices.selected) {
      this.stateService.datePickerDisable$.next(false);
    }
    this.generateChart();
  }

  generateChart(): void {
    const finalData: any = {};
    this.domains.forEach((domain: AppDomains, i: number) => {
      finalData.id = domain.id;
      finalData.data = [];
      const data: any = this.data.data.filter(
        (e: any) => e.id === domain.id
      )[0];
      data.data.forEach((page: any) => {
        let count: number = 0;
        if (this.radioChoice.value === RadioChoices.selected) {
          page.created.forEach((createdDate: string) => {
            let date: any = new Date(createdDate);
            date = `${date.getMonth() +
              1}/${date.getDate()}/${date.getFullYear()}`;
            if (this.stateService.isBetweenSelectedDates(date)) {
              count += 1;
            }
          });
        }

        if (this.stateService.state$.value === State.oses) {
          if (
            this.radioChoice.value === RadioChoices.all ||
            (this.radioChoice.value === RadioChoices.selected && count > 0)
          ) {
            finalData.data.push({
              name: page.id,
              count:
                this.radioChoice.value === RadioChoices.all ? page.count : count
            });
          }
        } else if (this.stateService.state$.value === State.platforms) {
          if (
            this.radioChoice.value === RadioChoices.all ||
            (this.radioChoice.value === RadioChoices.selected && count > 0)
          ) {
            finalData.data.push({
              name: page.id,
              count:
                this.radioChoice.value === RadioChoices.all
                  ? page.created.length
                  : count
            });
          }
        }
      });

      // Getting the labels
      this.chartLabels[i] = this.chartsService.createChartPieLabel(finalData);
      const chartsObj = this.chartsService.configureChartPie(finalData);
      // Configuring the Chart
      this.chartData[i] = chartsObj.chartData[0];
      // this.chartOptions[i] = chartsObj.chartOptions[0];
    });
  }
}
