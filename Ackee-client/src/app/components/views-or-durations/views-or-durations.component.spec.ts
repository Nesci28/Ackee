import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ViewsOrDurationsComponent } from "./views-or-durations.component";

describe("ViewsOrDurationsComponent", () => {
  let component: ViewsOrDurationsComponent;
  let fixture: ComponentFixture<ViewsOrDurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewsOrDurationsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsOrDurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
