import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoadingInCardComponent } from "./loading-in-card.component";

describe("LoadingInCardComponent", () => {
  let component: LoadingInCardComponent;
  let fixture: ComponentFixture<LoadingInCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingInCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingInCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
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

    it("should return a number (test case 6)", () => {
      component.type = "main";
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 992
      });
      expect(component.getHeight()).toBe("443px");
    });

    it("should return a number (test case 7)", () => {
      component.type = "main";
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1200
      });
      expect(component.getHeight()).toBe("533px");
    });
  });
});
