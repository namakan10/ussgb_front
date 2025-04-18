import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculeNoteGeneraleEcComponent } from './calcule-note-generale-ec.component';

describe('CalculeNoteGeneraleEcComponent', () => {
  let component: CalculeNoteGeneraleEcComponent;
  let fixture: ComponentFixture<CalculeNoteGeneraleEcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculeNoteGeneraleEcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculeNoteGeneraleEcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
