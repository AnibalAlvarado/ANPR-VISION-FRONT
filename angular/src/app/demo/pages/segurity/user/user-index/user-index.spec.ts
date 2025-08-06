import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIndex } from './user-index';

describe('UserIndex', () => {
  let component: UserIndex;
  let fixture: ComponentFixture<UserIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserIndex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
