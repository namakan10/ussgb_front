import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifFiliereComponent } from './modif-filiere.component';

describe('ModifFiliereComponent', () => {
  let component: ModifFiliereComponent;
  let fixture: ComponentFixture<ModifFiliereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifFiliereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifFiliereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
