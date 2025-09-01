import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricitegazComponent } from './offresIndependants.component';

describe('ElectricitegazComponent', () => {
  let component: ElectricitegazComponent;
  let fixture: ComponentFixture<ElectricitegazComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricitegazComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricitegazComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
