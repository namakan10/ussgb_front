import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierTraiterComponent } from './dossier-traiter.component';

describe('DossierTraiterComponent', () => {
  let component: DossierTraiterComponent;
  let fixture: ComponentFixture<DossierTraiterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DossierTraiterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierTraiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
