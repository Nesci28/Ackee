import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OsesComponent } from "./oses.component";

describe("OsesComponent", () => {
  let component: OsesComponent;
  let fixture: ComponentFixture<OsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OsesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
