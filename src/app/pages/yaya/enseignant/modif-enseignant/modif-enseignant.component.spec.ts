import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifEnseignantComponent } from './modif-enseignant.component';

describe('ModifEnseignantComponent', () => {
  let component: ModifEnseignantComponent;
  let fixture: ComponentFixture<ModifEnseignantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifEnseignantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifEnseignantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
