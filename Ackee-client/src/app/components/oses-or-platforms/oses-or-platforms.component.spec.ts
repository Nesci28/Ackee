import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OsesOrPlatformsComponent } from "./oses-or-platforms.component";

describe("OsesOrPlatformsComponent", () => {
  let component: OsesOrPlatformsComponent;
  let fixture: ComponentFixture<OsesOrPlatformsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OsesOrPlatformsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsesOrPlatformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
