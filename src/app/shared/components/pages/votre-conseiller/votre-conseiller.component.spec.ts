import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotreConseillerComponent } from './votre-conseiller.component';

describe('VotreConseillerComponent', () => {
  let component: VotreConseillerComponent;
  let fixture: ComponentFixture<VotreConseillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotreConseillerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotreConseillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
