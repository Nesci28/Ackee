import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GraphPieComponent } from "./graph-pie.component";
import { AppModule } from "../../../app.module";
import { APP_BASE_HREF } from "@angular/common";

describe("GraphPieComponent", () => {
  let component: GraphPieComponent;
  let fixture: ComponentFixture<GraphPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphPieComponent);
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

  describe("getHeight", () => {
    it("should return a number (test case 1)", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 574
      });
      expect(component.getHeight()).toBe("251px");
    });

    it("should return a number (test case 2)", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 576
      });
      expect(component.getHeight()).toBe("233px");
    });

    it("should return a number (test case 3)", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768
      });
      expect(component.getHeight()).toBe("323px");
    });

    it("should return a number (test case 4)", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 992
      });
      expect(component.getHeight()).toBe("203px");
    });

    it("should return a number (test case 5)", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1200
      });
      expect(component.getHeight()).toBe("248px");
    });
  });

  describe("showGraph", () => {
    it("should return false", () => {
      component.chartData = undefined;
      expect(component.showGraph()).toBe(false);
    });

    it("should return false", () => {
      component.chartData = [{ data: [1] }];
      expect(component.showGraph()).toBe(true);
    });
  });
});
