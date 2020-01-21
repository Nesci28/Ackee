import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HeaderComponent } from "./header.component";
import { AppModule } from "../../app.module";
import { APP_BASE_HREF } from "@angular/common";
import { StateService } from "../../services/state.service";
import { State } from "../../models/app.enum";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

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

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("setRoute", () => {
    it("should change the route by doing a next on state$", () => {
      stateService.state$.next(State.views);
      component.setRoute(State.durations);
      expect(stateService.state$.value).toBe(State.durations);
    });
  });
});
