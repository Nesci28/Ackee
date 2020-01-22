import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DatePickerRangeComponent } from "./date-picker-range.component";
import { StateService } from "../../../services/state.service";
import { AppModule } from "../../../app.module";
import { APP_BASE_HREF } from "@angular/common";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

describe("DatePickerRangeComponent", () => {
  let component: DatePickerRangeComponent;
  let fixture: ComponentFixture<DatePickerRangeComponent>;

  let stateService: StateService;

  const fromDate = {
    year: 2020,
    month: 1,
    day: 20,
    after: (params: any) => false,
    before: (params: any) => false,
    equals: (params: any) => false
  };

  const toDate = {
    year: 2020,
    month: 1,
    day: 21,
    after: (params: any) => true,
    before: (params: any) => false,
    equals: (params: any) => true
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

    fixture = TestBed.createComponent(DatePickerRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("onDateSelection", () => {
    it("should change the fromDate$ value", () => {
      stateService.fromDate$.next(undefined);
      stateService.toDate$.next(undefined);

      component.onDateSelection(fromDate as NgbDate);
      expect(stateService.fromDate$.value).toStrictEqual(fromDate);
    });

    it("should change the fromDate$ value", () => {
      stateService.fromDate$.next(fromDate as NgbDate);
      stateService.toDate$.next(undefined);
      component.onDateSelection(toDate as NgbDate);
      expect(stateService.toDate$.value).toStrictEqual(toDate);
      expect(stateService.recalculate$.value).toBe(true);
    });

    it("should change the fromDate$ value and change the toDate$ value to null", () => {
      stateService.fromDate$.next(toDate as NgbDate);
      stateService.toDate$.next(undefined);

      component.onDateSelection(fromDate as NgbDate);
      expect(stateService.fromDate$.value).toBe(fromDate);
      expect(stateService.toDate$.value).toBe(null);
    });
  });

  describe("isHovered", () => {
    it("should return true or false", () => {
      stateService.fromDate$.next(fromDate as NgbDate);
      stateService.toDate$.next(undefined);
      component.hoveredDate = fromDate as NgbDate;
      expect(component.isHovered(toDate as NgbDate)).toBe(false);
    });
  });

  describe("isInside", () => {
    it("should return true or false", () => {
      stateService.fromDate$.next(fromDate as NgbDate);
      stateService.toDate$.next(toDate as NgbDate);
      expect(component.isInside(toDate as NgbDate)).toBe(false);
    });
  });

  describe("isRange", () => {
    it("should return true or false", () => {
      stateService.fromDate$.next(fromDate as NgbDate);
      stateService.toDate$.next(toDate as NgbDate);
      expect(component.isRange(fromDate as NgbDate)).toBe(false);
    });
  });

  describe("setDate", () => {
    it("should set fromDate", () => {
      component.setDate("fromDate", fromDate as NgbDate);
      expect(stateService.fromDate$.value).toStrictEqual(fromDate);
    });

    it("should set toDate", () => {
      component.setDate("toDate", toDate as NgbDate);
      expect(stateService.toDate$.value).toStrictEqual(toDate);
    });
  });
});
