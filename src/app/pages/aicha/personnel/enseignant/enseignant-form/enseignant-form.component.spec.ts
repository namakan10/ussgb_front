import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnseignantFormComponent } from './enseignant-form.component';

describe('AddEnseignantComponent', () => {
  let component: EnseignantFormComponent;
  let fixture: ComponentFixture<EnseignantFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnseignantFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnseignantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
