import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifPreInscriptionComponent } from './modif-pre-inscription.component';

describe('ModifPreInscriptionComponent', () => {
  let component: ModifPreInscriptionComponent;
  let fixture: ComponentFixture<ModifPreInscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifPreInscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifPreInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
