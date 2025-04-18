import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerNotesEcComponent } from './charger-notes-ec.component';

describe('ChargerNotesEcComponent', () => {
  let component: ChargerNotesEcComponent;
  let fixture: ComponentFixture<ChargerNotesEcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargerNotesEcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargerNotesEcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
