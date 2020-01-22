import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GraphLineComponent } from "./graph-line.component";
import { AppModule } from "../../../app.module";
import { APP_BASE_HREF } from "@angular/common";

describe("GraphLineComponent", () => {
  let component: GraphLineComponent;
  let fixture: ComponentFixture<GraphLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphLineComponent);
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
      expect(typeof component.colors).toBe("object");
    });
  });
});
