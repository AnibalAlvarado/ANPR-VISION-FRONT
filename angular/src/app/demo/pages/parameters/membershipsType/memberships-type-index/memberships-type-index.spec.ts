import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipsTypeIndex } from './memberships-type-index';

describe('MembershipsTypeIndex', () => {
  let component: MembershipsTypeIndex;
  let fixture: ComponentFixture<MembershipsTypeIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipsTypeIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipsTypeIndex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
