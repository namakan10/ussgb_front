import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectiviteEnseignantsComponent } from './effectivite-enseignants.component';

describe('EffectiviteEnseignantsComponent', () => {
  let component: EffectiviteEnseignantsComponent;
  let fixture: ComponentFixture<EffectiviteEnseignantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EffectiviteEnseignantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EffectiviteEnseignantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
