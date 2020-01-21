import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { StateService } from "../../services/state.service";
import { HttpService } from "../../services/http.service";
import { AppModule } from "../../app.module";
import { APP_BASE_HREF } from "@angular/common";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let stateService: StateService;
  let httpService: HttpService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
    }).compileComponents();
  }));

  beforeEach(() => {
    stateService = TestBed.get(StateService);
    httpService = TestBed.get(HttpService);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
    spyOn(localStorage, "getItem").and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, "setItem").and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, "removeItem").and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, "clear").and.callFake(mockLocalStorage.clear);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should automatically login if the token is valid", () => {});
    // TODO: Fix localStorage setItem Token
  });
});
