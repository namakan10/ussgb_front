import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersementDesComptablesComponent } from './versement-des-comptables.component';

describe('VersementDesComptablesComponent', () => {
  let component: VersementDesComptablesComponent;
  let fixture: ComponentFixture<VersementDesComptablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersementDesComptablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersementDesComptablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
