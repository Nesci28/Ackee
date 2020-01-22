import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GraphBubbleComponent } from "./graph-bubble.component";
import { AppModule } from "../../../app.module";
import { APP_BASE_HREF } from "@angular/common";

describe("GraphBubbleComponent", () => {
  let component: GraphBubbleComponent;
  let fixture: ComponentFixture<GraphBubbleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphBubbleComponent);
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
