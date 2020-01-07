import { Component, isDevMode, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

import { AppDomains } from "../models/app.model";
import { Domains, Token } from "../models/backend.model";
import { State } from "../models/app.enum";
import { HttpService } from "../services/http.service";
import { StateService } from "../services/state.service";
import { BaseComponent } from "../shared/base/base.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent extends BaseComponent implements OnInit {
  showError: boolean = false;

  form: FormGroup = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  });

  constructor(
    private httpService: HttpService,
    private stateService: StateService
  ) {
    super();
  }

  ngOnInit() {
    if (isDevMode()) {
      this.username.setValue("test");
      this.password.setValue("root");
      this.login();
    }
  }

  get username() {
    return this.form.get("username");
  }
  get password() {
    return this.form.get("password");
  }

  login(): void {
    this.showError = false;
    this.form.markAllAsTouched();
    if (this.username.valid && this.password.valid)
      this.httpService
        .token(this.username.value, this.password.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (token: Token) => {
            this.stateService.token = token.data.id;
            this.httpService
              .getDomains()
              .pipe(takeUntil(this.destroy$))
              .subscribe((domains: Domains) => {
                const resDomains: AppDomains[] = [];
                domains.data.forEach(domain => {
                  resDomains.push({
                    id: domain.data.id,
                    title: domain.data.title
                  });
                });
                this.stateService.domains = resDomains;
                this.stateService.state$.next(State.views);
              });
          },
          (_: any) => {
            this.showError = true;
          }
        );
  }

  getError(input: string): boolean {
    return (
      this.form.controls[input].touched && this.form.controls[input].invalid
    );
  }
}
