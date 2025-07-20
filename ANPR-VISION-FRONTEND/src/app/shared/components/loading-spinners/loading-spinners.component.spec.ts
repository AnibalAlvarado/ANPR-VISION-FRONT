import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnersComponent } from './loading-spinners.component';

describe('LoadingSpinnersComponent', () => {
  let component: LoadingSpinnersComponent;
  let fixture: ComponentFixture<LoadingSpinnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
