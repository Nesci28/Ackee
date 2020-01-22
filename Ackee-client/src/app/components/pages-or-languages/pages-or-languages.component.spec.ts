import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PagesOrLanguagesComponent } from "./pages-or-languages.component";
import { StateService } from "../../services/state.service";
import { HttpService } from "../../services/http.service";
import { AppModule } from "../../app.module";
import { APP_BASE_HREF } from "@angular/common";
import { of } from "rxjs/internal/observable/of";
import { State, RadioChoices } from "../../models/app.enum";

describe("PagesOrLanguagesComponent", () => {
  let component: PagesOrLanguagesComponent;
  let fixture: ComponentFixture<PagesOrLanguagesComponent>;

  let stateService: StateService;
  let httpService: HttpService;

  const mockPages = {
    type: "pages",
    data: [
      {
        domainId: "test_id",
        siteLocation: "http://localhost:4200",
        data: [
          {
            page: "/",
            count: 2
          }
        ]
      }
    ]
  };

  const mockLanguages = {
    type: "languages",
    data: [
      {
        type: "language",
        data: {
          id: "en",
          domainId: "test_id",
          count: 5
        }
      }
    ]
  };

  const chartDataPages = [
    {
      domainId: "test_id",
      siteLocation: "http://localhost:4200",
      data: [
        {
          page: "/",
          count: 2
        }
      ]
    }
  ];

  const chartDataLanguages = [
    {
      domainId: "test_id",
      data: [
        {
          language: "English",
          count: 5
        }
      ]
    }
  ];

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

    fixture = TestBed.createComponent(PagesOrLanguagesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should initialize all the variables -> Pages", async () => {
      stateService.domains = [{ id: "test_id", title: "test_title" }];
      stateService.state$.next(State.pages);
      jest.spyOn(httpService, "getInfo").mockReturnValue(of(mockPages));

      await component.ngOnInit();

      expect(component.data).toBe(mockPages.data);
      expect(component.chartData).toStrictEqual(chartDataPages);
      expect(component.urls).toStrictEqual([["/"]]);
    });

    it("should initialize all the variables -> Languages", async () => {
      stateService.domains = [{ id: "test_id", title: "test_title" }];
      stateService.state$.next(State.languages);
      jest.spyOn(httpService, "getInfo").mockReturnValue(of(mockLanguages));

      await component.ngOnInit();

      expect(component.data).toBe(mockLanguages.data);
      expect(component.chartData).toStrictEqual(chartDataLanguages);
      expect(component.urls).toStrictEqual([]);
    });
  });

  describe("getData", () => {
    it("should get the Data for all domains", async () => {
      stateService.domains = [{ id: "test_id", title: "test_title" }];
      jest.spyOn(httpService, "getInfo").mockReturnValue(of(mockPages));
      component.radioChoice.setValue(RadioChoices.all);
      await component.getData();
      expect(component.data).toBe(mockPages.data);
    });

    it("should get the Data for the specific domain", async () => {
      jest.spyOn(httpService, "getInfo").mockReturnValue(of(mockPages));
      component.radioChoice.setValue(RadioChoices.selected);
      await component.getData();
      expect(component.data).toBe(mockPages.data);
    });
  });

  describe("filterChartDataDomain", () => {
    it("should filter the chartData array", () => {
      component.loading = false;
      component.chartData = [
        { domainId: "test-id" },
        { domainId: "not-test-id" }
      ];
      const res = component.filterChartDataDomain("test-id");
      expect(res).toStrictEqual({ domainId: "test-id" });
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
      stateService.domains = [{ id: "test_id", title: "test_title" }];
      stateService.state$.next(State.pages);
      jest.spyOn(httpService, "getInfo").mockReturnValue(of(mockPages));
      component.radioChoice.setValue(RadioChoices.all);
      await component.radioChoiceChanged();
      expect(component.data).toBe(mockPages.data);
      expect(component.chartData).toStrictEqual(chartDataPages);
    });
  });

  describe("selectChanged", () => {
    it("should filter the chartData to only contains the selected URL", () => {
      component.subUrl.setValue("test");
      component.chartData = chartDataPages;

      component.selectChanged(0);
      expect(component.originalUrls).toStrictEqual([[{ page: "/", count: 2 }]]);
    });

    it("should go back to normal if Root is selected", () => {
      component.subUrl.setValue("/");
      component.originalUrls = [{ page: "/", count: 2 }];
      component.chartData = [[]];

      component.selectChanged(0);
      expect(component.chartData[0].data).toStrictEqual({
        page: "/",
        count: 2
      });
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

  describe("subscriptions", () => {
    it("should subscribe to loading$", () => {
      stateService.loading$.next(true);
      expect(component.loading).toBe(true);
      stateService.loading$.next(false);
      expect(component.loading).toBe(false);
    });

    it("should subscribe to recalculate$ and if true, change the charts variables", async () => {
      jest.spyOn(httpService, "getInfo").mockReturnValue(of(mockPages));
      component.radioChoice.setValue(RadioChoices.all);

      stateService.recalculate$.next(true);
      fixture.whenStable().then(() => {
        expect(component.data).toBe(mockPages.data);
        expect(component.chartData).toStrictEqual(chartDataPages);
        expect(component.urls).toStrictEqual([["/"]]);
      });
    });
  });
});
