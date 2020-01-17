import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { RadioChoices, State } from "../../models/app.enum";
import { AppDomains } from "../../models/app.model";
import { HttpService } from "../../services/http.service";
import { StateService } from "../../services/state.service";
import { BaseComponent } from "../shared/base/base.component";

@Component({
  selector: "app-pages-or-languages",
  templateUrl: "./pages-or-languages.component.html",
  styleUrls: ["./pages-or-languages.component.scss"]
})
export class PagesOrLanguagesComponent extends BaseComponent implements OnInit {
  State = State;
  domains: AppDomains[] = [];
  start: boolean = true;
  showSpacer: any;
  disabled: boolean;

  pages = [];
  data: any = { type: "", data: [] };
  urls: any[] = [];
  originalUrls: any[] = [];

  form: FormGroup = new FormGroup({
    subUrl: new FormControl("All"),
    numberOfDays: new FormControl(13, Validators.required),
    radioChoice: new FormControl("all", Validators.required)
  });

  constructor(
    private httpService: HttpService,
    private stateService: StateService
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

    this.stateService.numberOfDays$
      .pipe(takeUntil(this.destroy$))
      .subscribe((numberOfDays: number) => {
        if (!this.start) {
          this.numberOfDays.setValue(numberOfDays);
          this.inputChanged(true);
        }
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
    // this.data = await this.httpService.getPagesOrLanguages(
    //   this.stateService.domains,
    //   this.stateService.state$.value
    // );
    this.domains.forEach((domain: AppDomains, i: number) => {
      this.pages.push({ id: domain.id, data: [] });
      const data = this.data.data.filter((e: any) => e.id === domain.id)[0];
      data.data.forEach((page: any) => {
        this.pages[i].data.push({
          name: page.data.id,
          count: page.data.count
        });
      });
    });
    // Setting up the sup Domains List
    this.generateSubUrls();
    this.stateService.loading$.next(false);
  }

  get subUrl() {
    return this.form.get("subUrl");
  }
  get numberOfDays() {
    return this.form.get("numberOfDays");
  }
  get radioChoice() {
    return this.form.get("radioChoice");
  }

  inputChanged(state?: boolean): void {
    if (!state) {
      this.stateService.numberOfDays$.next(this.numberOfDays.value);
      this.stateService.getFromDate();
    }
    this.generateTableData();
    this.generateSubUrls();
  }

  radioChoiceChanged() {
    if (this.radioChoice.value === RadioChoices.all) {
      this.stateService.datePickerDisable$.next(true);
    } else if (this.radioChoice.value === RadioChoices.selected) {
      this.stateService.datePickerDisable$.next(false);
    }
    this.generateTableData();
    this.generateSubUrls();
  }

  generateSubUrls(): void {
    this.urls = [];
    this.pages.forEach((page: any, i: number) => {
      page.data.forEach((e: any) => {
        if (this.stateService.state$.value === State.pages) {
          if (!this.urls[i]) {
            this.urls[i] = new Set();
          }
          this.urls[i].add("All");
          const url1 = e.name.split("//").pop();
          const url2 = url1.split("/").pop();
          if (url1 !== url2) {
            this.urls[i].add(url2);
          }
        }
      });
    });
  }

  selectChanged(index: number): void {
    if (this.subUrl.value !== "All") {
      if (!this.originalUrls[index]) {
        this.originalUrls[index] = JSON.parse(
          JSON.stringify(this.pages[index].data)
        );
      }
      this.pages[index].data = this.pages[index].data.filter((el: any) =>
        el.name.includes(this.subUrl.value)
      );
    } else {
      this.pages[index].data = JSON.parse(
        JSON.stringify(this.originalUrls[index])
      );
    }
  }

  generateTableData(): void {
    this.pages = [];
    this.domains.forEach((domain: AppDomains, i: number) => {
      this.pages.push({ id: domain.id, data: [] });
      const data = this.data.data.filter((e: any) => e.id === domain.id)[0];
      data.data.forEach((page: any) => {
        let count: number = 0;
        if (this.radioChoice.value === RadioChoices.selected) {
          page.data.created.forEach((createdDate: string) => {
            let date: any = new Date(createdDate);
            date = `${date.getMonth() +
              1}/${date.getDate()}/${date.getFullYear()}`;
            if (this.stateService.isBetweenSelectedDates(date)) {
              count += 1;
            }
          });
        }

        if (
          this.radioChoice.value === RadioChoices.all ||
          (this.radioChoice.value === RadioChoices.selected && count > 0)
        ) {
          this.pages[i].data.push({
            name: page.data.id,
            count:
              this.radioChoice.value === RadioChoices.all
                ? page.data.count
                : count
          });
        }
      });
    });
  }
}
