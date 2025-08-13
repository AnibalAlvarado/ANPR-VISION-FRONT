import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateTypeIndex } from './rate-type-index';

describe('RateTypeIndex', () => {
  let component: RateTypeIndex;
  let fixture: ComponentFixture<RateTypeIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateTypeIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateTypeIndex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
