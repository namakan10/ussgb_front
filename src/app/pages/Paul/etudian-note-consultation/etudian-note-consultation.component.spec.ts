import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudianNoteConsultationComponent } from './etudian-note-consultation.component';

describe('EtudianNoteConsultationComponent', () => {
  let component: EtudianNoteConsultationComponent;
  let fixture: ComponentFixture<EtudianNoteConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtudianNoteConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudianNoteConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
