import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterSpecialiteFonctionComponent } from './ajouter-specialite-fonction.component';

describe('AjouterSpecialiteFonctionComponent', () => {
  let component: AjouterSpecialiteFonctionComponent;
  let fixture: ComponentFixture<AjouterSpecialiteFonctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjouterSpecialiteFonctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterSpecialiteFonctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
