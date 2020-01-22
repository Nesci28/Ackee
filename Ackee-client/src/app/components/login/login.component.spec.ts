import { APP_BASE_HREF } from "@angular/common";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";

import { AppModule } from "../../app.module";
import { HttpService } from "../../services/http.service";
import { StateService } from "../../services/state.service";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let stateService: StateService;
  let httpService: HttpService;

  const mockDomains = {
    type: "domains",
    data: [
      {
        type: "domain",
        data: {
          id: "test_id",
          title: "test_title",
          created: "2019-12-19T18:08:57.855Z",
          updated: "2020-01-04T17:24:02.976Z"
        }
      }
    ]
  };

  const mockToken = {
    type: "token",
    data: {
      id: "test_token"
    }
  };

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

    fixture = TestBed.createComponent(LoginComponent);
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
    it("should automatically login if localStorage has a token", () => {
      localStorage.setItem("token", "test");
      jest.spyOn(httpService, "getDomains").mockReturnValue(of(mockDomains));
      component.ngOnInit();
      expect(stateService.domains).toStrictEqual([
        {
          id: "test_id",
          title: "test_title"
        }
      ]);
    });

    it("should automatically login if the app is in dev mode and no token is present in the localStorage", () => {
      localStorage.removeItem("token");
      const res = jest.spyOn(component, "login");
      jest.spyOn(httpService, "getDomains").mockReturnValue(of(mockDomains));
      component.ngOnInit();
      expect(res).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login with a valid username and password", () => {
      component.username.setValue("test_username");
      component.password.setValue("test_password");
      jest.spyOn(httpService, "token").mockReturnValue(of(mockToken));
      jest.spyOn(httpService, "getDomains").mockReturnValue(of(mockDomains));
      component.login();
      expect(localStorage.getItem("token")).toBe("test_token");
      expect(stateService.domains).toStrictEqual([
        {
          id: "test_id",
          title: "test_title"
        }
      ]);
    });

    // it("should show the error if something is wrong", () => {
    //   component.username.setValue("test_username");
    //   component.password.setValue("test_password");
    //   jest.spyOn(httpService, "token").mockImplementation(() => {
    //     throw new Error("error");
    //   });
    //   component.login();
    //   expect(component.showError).toBe(true);
    // });
  });
});
