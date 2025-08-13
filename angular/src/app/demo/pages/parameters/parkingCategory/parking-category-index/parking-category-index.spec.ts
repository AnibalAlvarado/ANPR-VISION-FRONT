import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingCategoryIndex } from './parking-category-index';

describe('ParkingCategoryIndex', () => {
  let component: ParkingCategoryIndex;
  let fixture: ComponentFixture<ParkingCategoryIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingCategoryIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingCategoryIndex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
