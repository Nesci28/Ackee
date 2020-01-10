import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PagesOrLanguagesComponent } from "./pages-or-languages.component";

describe("PagesOrLanguagesComponent", () => {
  let component: PagesOrLanguagesComponent;
  let fixture: ComponentFixture<PagesOrLanguagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PagesOrLanguagesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesOrLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
