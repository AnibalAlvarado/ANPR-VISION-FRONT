import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndUserComponent } from './end-user-component';

describe('EndUserComponent', () => {
  let component: EndUserComponent;
  let fixture: ComponentFixture<EndUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
