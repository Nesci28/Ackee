import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SettingsComponent } from "./settings.component";
import { StateService } from "../../services/state.service";
import { HttpService } from "../../services/http.service";
import { AppModule } from "../../app.module";
import { APP_BASE_HREF } from "@angular/common";
import { of } from "rxjs/internal/observable/of";
import { State } from "../../models/app.enum";

describe("SettingsComponent", () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  let stateService: StateService;
  let httpService: HttpService;

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

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(localStorage, "getItem").and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, "setItem").and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, "removeItem").and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, "clear").and.callFake(mockLocalStorage.clear);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should initialize the Tracker name", () => {
      stateService.domains = [{ id: "test_id", title: "test_title" }];
      jest
        .spyOn(httpService, "getTrackerName")
        .mockReturnValue(of({ name: "test_tracker" }));

      component.ngOnInit();

      expect(component.trackerName.value).toBe("Tracker Name: test_tracker");
    });
  });

  describe("logOut", () => {
    it("should remove the token from the localStorage and go to the login page", () => {
      localStorage.setItem("token", "test_token");

      component.logOut();

      expect(localStorage.getItem("token")).toBe(null);
      expect(stateService.state$.value).toBe(State.login);
    });
  });

  describe("open", () => {
    it("shoudd setup the Modal accordingly if a domain is specified", () => {
      component.open("", { id: "test_id", title: "test_title" });
      expect(component.title.value).toBe("test_title");
      expect(component.id.value).toBe("test_id");
    });

    it("shoudd setup the Modal accordingly if no domain is specified", () => {
      component.open("");
      expect(component.title.value).toBe("");
    });
  });
});
