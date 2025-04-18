import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseEtudiantsComponent } from './classe-etudiants.component';

describe('ClasseEtudiantsComponent', () => {
  let component: ClasseEtudiantsComponent;
  let fixture: ComponentFixture<ClasseEtudiantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasseEtudiantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasseEtudiantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
