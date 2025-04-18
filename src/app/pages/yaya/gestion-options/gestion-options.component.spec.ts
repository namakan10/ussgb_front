import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionOptionsComponent } from './gestion-options.component';

describe('GestionOptionsComponent', () => {
  let component: GestionOptionsComponent;
  let fixture: ComponentFixture<GestionOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
