import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestdebitComponent } from './testdebit.component';

describe('TestdebitComponent', () => {
  let component: TestdebitComponent;
  let fixture: ComponentFixture<TestdebitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestdebitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestdebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
