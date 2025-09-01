import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFreeComponent } from './list-free.component';

describe('ListFreeComponent', () => {
  let component: ListFreeComponent;
  let fixture: ComponentFixture<ListFreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
