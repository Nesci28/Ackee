import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphBubbleComponent } from './graph-bubble.component';

describe('GraphBubbleComponent', () => {
  let component: GraphBubbleComponent;
  let fixture: ComponentFixture<GraphBubbleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphBubbleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
