import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerNotesComponent } from './charger-notes.component';

describe('ChargerNotesComponent', () => {
  let component: ChargerNotesComponent;
  let fixture: ComponentFixture<ChargerNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargerNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargerNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
