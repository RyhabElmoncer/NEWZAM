import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperLinearComponentComponent } from './stepper-linear-component.component';

describe('StepperLinearComponentComponent', () => {
  let component: StepperLinearComponentComponent;
  let fixture: ComponentFixture<StepperLinearComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperLinearComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperLinearComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
