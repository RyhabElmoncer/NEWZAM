import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MettingModalComponent } from './metting-modal.component';

describe('MettingModalComponent', () => {
  let component: MettingModalComponent;
  let fixture: ComponentFixture<MettingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MettingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MettingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
