import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GraphBarComponent } from "./graph-bar.component";
import { StateService } from "../../../services/state.service";
import { AppModule } from "../../../app.module";
import { APP_BASE_HREF } from "@angular/common";

describe("GraphBarComponent", () => {
  let component: GraphBarComponent;
  let fixture: ComponentFixture<GraphBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should generate Options", () => {
      component.ngOnInit();
      expect(typeof component.options).toBe("object");
    });
  });
});
