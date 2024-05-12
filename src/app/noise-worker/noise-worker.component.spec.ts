import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoiseWorkerComponent } from './noise-worker.component';

describe('NoiseWorkerComponent', () => {
  let component: NoiseWorkerComponent;
  let fixture: ComponentFixture<NoiseWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoiseWorkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoiseWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
