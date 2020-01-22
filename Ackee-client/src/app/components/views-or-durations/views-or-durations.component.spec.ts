import { APP_BASE_HREF } from "@angular/common";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppModule } from "../../app.module";
import { HttpService } from "../../services/http.service";
import { StateService } from "../../services/state.service";
import { ViewsOrDurationsComponent } from "./views-or-durations.component";

describe("ViewsOrDurationsComponent", () => {
  let component: ViewsOrDurationsComponent;
  let fixture: ComponentFixture<ViewsOrDurationsComponent>;

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

    fixture = TestBed.createComponent(ViewsOrDurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it("should create", () => {
  //   expect(component).toBeTruthy();
  // });

  // describe("ngOnInit", () => {
  //   it("should initialize all the variables -> Views", async () => {
  //     stateService.domains = [{ id: "test_id", title: "test_title" }];
  //     stateService.state$.next(State.views);
  //     component.views.setValue("1");
  //     stateService.fromDate$.next({ year: 2020, month: 1, day: 13 } as NgbDate);
  //     stateService.toDate$.next({ year: 2020, month: 1, day: 16 } as NgbDate);
  //     jest.spyOn(httpService, "getInfo").mockReturnValue(of(mockViews));

  //     await component.ngOnInit();

  //     expect(component.graphType).toBe(Charts.bar);
  //     expect(component.chartLabels).toStrictEqual(chartLabelsViews);
  //     expect(component.data).toBe(mockViews.data);
  //     expect(component.chartData).toStrictEqual(chartDataViews);
  //   });
  // });

  // describe("filterChartDataDomain", () => {
  //   it("should filter the chartData array", () => {
  //     component.loading = false;
  //     component.chartData = [
  //       { domainId: "test-id", data: ["good"] },
  //       { domainId: "not-test-id", data: ["bad"] }
  //     ];
  //     const res = component.filterChartDataDomain("test-id");
  //     expect(res).toStrictEqual(["good"]);
  //   });
  // });
});
