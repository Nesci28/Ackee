import { APP_BASE_HREF } from "@angular/common";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppModule } from "./app.module";
import { ViewsOrDurationsComponent } from "./components/views-or-durations/views-or-durations.component";
import { HttpService } from "./services/http.service";
import { StateService } from "./services/state.service";

describe("AppComponent", () => {
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

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
