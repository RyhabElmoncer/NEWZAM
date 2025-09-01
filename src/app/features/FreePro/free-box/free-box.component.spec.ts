import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeBoxComponent } from './free-box.component';

describe('FreeBoxComponent', () => {
  let component: FreeBoxComponent;
  let fixture: ComponentFixture<FreeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
