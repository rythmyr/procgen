import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Renderer3dComponent } from './renderer3d.component';

describe('Renderer3dComponent', () => {
  let component: Renderer3dComponent;
  let fixture: ComponentFixture<Renderer3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Renderer3dComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Renderer3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
