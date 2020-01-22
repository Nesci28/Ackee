import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";

import { AppModule } from "../../app.module";
import { RadioChoices } from "../../models/app.enum";
import { HttpService } from "../../services/http.service";
import { StateService } from "../../services/state.service";
import { EventsComponent } from "./events.component";

describe("EventsComponent", () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  let stateService: StateService;
  let httpService: HttpService;

  const mock = {
    type: "events",
    data: [{ groupName: "group", events: { test: 1 } }]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
    }).compileComponents();
  }));

  beforeEach(() => {
    stateService = TestBed.get(StateService);
    httpService = TestBed.get(HttpService);

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    stateService.domains = [{ id: "test-id", title: "test-title" }];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should initialize all the variables", async () => {
      jest.spyOn(httpService, "getInfo").mockReturnValue(of(mock));

      await component.ngOnInit();

      expect(component.data).toBe(mock.data);
      expect(component.chartLabels).toStrictEqual([["test"]]);
      expect(component.chartData[0][0].data).toStrictEqual([1]);
    });
  });

  describe("get Data", () => {
    it("should get the Data for all domains", async () => {
      jest.spyOn(httpService, "getInfo").mockReturnValue(of(mock));
      component.radioChoice.setValue(RadioChoices.all);
      await component.getData();
      expect(component.data).toBe(mock.data);
    });

    it("should get the Data for the specific domain", async () => {
      jest.spyOn(httpService, "getInfo").mockReturnValue(of(mock));
      component.radioChoice.setValue(RadioChoices.selected);
      await component.getData();
      expect(component.data).toBe(mock.data);
    });
  });

  describe("filterChartDataDomain", () => {
    it("should filter the chartData array", () => {
      component.loading = false;
      component.chartData = [
        { domainId: "test-id" },
        { domainId: "not-test-id" }
      ];
      const res = component.filterChartDataDomain();
      expect(res).toStrictEqual({ domainId: "test-id" });
    });
  });

  describe("selectChanged", () => {
    it("should change the charts variables", async () => {
      jest.spyOn(httpService, "getInfo").mockReturnValue(of(mock));
      component.radioChoice.setValue(RadioChoices.all);
      await component.selectChanged();
      expect(component.data).toBe(mock.data);
      expect(component.chartLabels).toStrictEqual([["test"]]);
      expect(component.chartData[0][0].data).toStrictEqual([1]);
    });
  });

  describe("radioChoiceChanged", () => {
    it("should set datePickerDisable$ to true if All Time is selected", () => {
      component.radioChoice.setValue(RadioChoices.all);
      component.radioChoiceChanged();
      expect(stateService.datePickerDisable$.value).toBe(true);
    });

    it("should set datePickerDisable$ to false if specific Dates have been selected", () => {
      component.radioChoice.setValue(RadioChoices.selected);
      component.radioChoiceChanged();
      expect(stateService.datePickerDisable$.value).toBe(false);
    });

    it("should change the charts variables", async () => {
      jest.spyOn(httpService, "getInfo").mockReturnValue(of(mock));
      component.radioChoice.setValue(RadioChoices.all);
      await component.radioChoiceChanged();
      expect(component.data).toBe(mock.data);
      expect(component.chartLabels).toStrictEqual([["test"]]);
      expect(component.chartData[0][0].data).toStrictEqual([1]);
    });
  });

  describe("showSpacer", () => {
    it("should return true if window is bigger than 992px and the index is greater than 1", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1080
      });
      const res = component.showSpacer(2);
      expect(res).toBe(true);
    });

    it("should return true if window is smaller than 991px and the index is greater than 0", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 800
      });
      const res = component.showSpacer(1);
      expect(res).toBe(true);
    });

    it("should return false in any other case", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 800
      });
      const res = component.showSpacer(0);
      expect(res).toBe(false);
    });
  });

  describe("getDomainTitle", () => {
    it("should return the title of the domain from the id", () => {
      component.domains = [{ id: "test-id", title: "test-title" }];
      component.domain.setValue("test-id");
      const res = component.getDomainTitle();
      expect(res).toBe("test-title");
    });
  });

  describe("subscriptions", () => {
    it("should subscribe to loading$", () => {
      stateService.loading$.next(true);
      expect(component.loading).toBe(true);
      stateService.loading$.next(false);
      expect(component.loading).toBe(false);
    });

    it("should subscribe to recalculate$ and if true, change the charts variables", async () => {
      jest.spyOn(httpService, "getInfo").mockReturnValue(of(mock));
      component.radioChoice.setValue(RadioChoices.all);

      stateService.recalculate$.next(true);
      fixture.whenStable().then(() => {
        expect(component.data).toBe(mock.data);
        expect(component.chartData[0][0].data).toStrictEqual([1]);
        expect(component.chartLabels).toStrictEqual([["test"]]);
      });
    });
  });
});
