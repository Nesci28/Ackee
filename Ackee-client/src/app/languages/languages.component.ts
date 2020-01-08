import { Component, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { AppDomains } from "../models/app.model";
import { HttpService } from "../services/http.service";
import { StateService } from "../services/state.service";
import { BaseComponent } from "../shared/base/base.component";
import { languageList } from "./list";

@Component({
  selector: "app-languages",
  templateUrl: "./languages.component.html",
  styleUrls: ["./languages.component.scss"]
})
export class LanguagesComponent extends BaseComponent implements OnInit {
  domains: AppDomains[] = [];
  start: boolean = true;
  languages = [];
  data: any = { type: "", data: [] };

  constructor(
    private httpService: HttpService,
    private stateService: StateService
  ) {
    super();
  }

  async ngOnInit() {
    this.domains = this.stateService.domains;
    this.stateService.start$.next(true);

    this.stateService.start$
      .pipe(takeUntil(this.destroy$))
      .subscribe((start: boolean) => {
        this.start = start;
      });

    this.stateService.loading$.next(true);

    // Fetching the Data
    this.data = await this.httpService.getLanguages(this.stateService.domains);
    this.domains.forEach((domain: AppDomains, i: number) => {
      this.languages.push({ id: domain.id, data: [] });
      const data = this.data.data.filter((e: any) => e.id === domain.id)[0];
      data.data.forEach((language: any) => {
        this.languages[i].data.push({
          name: language.data.id,
          count: language.data.count
        });
      });
    });
    this.stateService.loading$.next(false);
  }

  getLoading(): boolean {
    return this.stateService.loading$.value;
  }

  showSpacer(index: number): boolean {
    if (window.innerWidth > 991 && index > 1) return true;
    if (window.innerWidth <= 991 && index > 0) return true;
    return false;
  }

  getLangFromjson(lang: string): string {
    return languageList[lang].name;
  }

  getlanguagesByDomain(domainId: string): any {
    return this.languages.filter(lang => lang.id === domainId)[0];
  }
}
