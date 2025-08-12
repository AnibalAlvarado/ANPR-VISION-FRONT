import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormForm } from './form-form';

describe('FormForm', () => {
  let component: FormForm;
  let fixture: ComponentFixture<FormForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
