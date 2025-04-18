import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreInscriptionsComponent } from './pre-inscriptions.component';

describe('PreInscriptionsComponent', () => {
  let component: PreInscriptionsComponent;
  let fixture: ComponentFixture<PreInscriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreInscriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreInscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
