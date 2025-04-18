import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionUesComponent } from './gestion-ues.component';

describe('GestionUesComponent', () => {
  let component: GestionUesComponent;
  let fixture: ComponentFixture<GestionUesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionUesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionUesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
