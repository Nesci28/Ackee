import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DatePickerComponent } from "./date-picker.component";
import { StateService } from "../../../services/state.service";
import { AppModule } from "../../../app.module";
import { APP_BASE_HREF } from "@angular/common";

describe("DatePickerComponent", () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  let stateService: StateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
    }).compileComponents();
  }));

  beforeEach(() => {
    stateService = TestBed.get(StateService);

    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should change the singleDate$ and set recalculate$ to true", () => {
      component.ngOnInit();

      component.singleDate.setValue("2020-01-21");
      expect(stateService.singleDate$.value).toBe("2020-01-21");
      expect(stateService.recalculate$.value).toBe(true);
    });
  });
});
