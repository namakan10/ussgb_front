import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirEnseignantEffectiviteComponent } from './voir-enseignant-effectivite.component';

describe('VoirEnseignantEffectiviteComponent', () => {
  let component: VoirEnseignantEffectiviteComponent;
  let fixture: ComponentFixture<VoirEnseignantEffectiviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoirEnseignantEffectiviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoirEnseignantEffectiviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
