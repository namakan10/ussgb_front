import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoVisiteurComponent } from './info-visiteur.component';

describe('InfoVisiteurComponent', () => {
  let component: InfoVisiteurComponent;
  let fixture: ComponentFixture<InfoVisiteurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoVisiteurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoVisiteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
