import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleIndex } from './role-index';

describe('RoleIndex', () => {
  let component: RoleIndex;
  let fixture: ComponentFixture<RoleIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleIndex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
