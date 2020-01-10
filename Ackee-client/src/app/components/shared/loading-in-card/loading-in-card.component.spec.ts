import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingInCardComponent } from './loading-in-card.component';

describe('LoadingInCardComponent', () => {
  let component: LoadingInCardComponent;
  let fixture: ComponentFixture<LoadingInCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingInCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingInCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
