import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualitesDetailComponent } from './actualites-detail.component';

describe('ActualitesDetailComponent', () => {
  let component: ActualitesDetailComponent;
  let fixture: ComponentFixture<ActualitesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualitesDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualitesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
