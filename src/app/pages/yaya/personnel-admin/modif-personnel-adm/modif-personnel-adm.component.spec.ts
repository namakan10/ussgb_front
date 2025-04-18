import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifPersonnelAdmComponent } from './modif-personnel-adm.component';

describe('ModifPersonnelAdmComponent', () => {
  let component: ModifPersonnelAdmComponent;
  let fixture: ComponentFixture<ModifPersonnelAdmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifPersonnelAdmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifPersonnelAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
