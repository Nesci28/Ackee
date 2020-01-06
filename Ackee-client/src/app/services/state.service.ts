import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { AppDomains } from "../models/app.model";
import { State } from "../models/state.enum";

@Injectable({
  providedIn: "root"
})
export class StateService {
  state$: BehaviorSubject<State> = new BehaviorSubject<State>(State.login);
  token: string;
  domains: AppDomains[];
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  numberOfDays: BehaviorSubject<number> = new BehaviorSubject<number>(13);

  constructor() {}
}
