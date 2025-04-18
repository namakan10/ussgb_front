import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionOvragesComponent } from './gestion-ovrages.component';

describe('GestionOvragesComponent', () => {
  let component: GestionOvragesComponent;
  let fixture: ComponentFixture<GestionOvragesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionOvragesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionOvragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
