import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliberationListeComponent } from './deliberation-liste.component';

describe('DeliberationListeComponent', () => {
  let component: DeliberationListeComponent;
  let fixture: ComponentFixture<DeliberationListeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliberationListeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliberationListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
