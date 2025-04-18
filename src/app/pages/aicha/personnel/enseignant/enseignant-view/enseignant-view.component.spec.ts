import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnseignantViewComponent } from './enseignant-view.component';

describe('AddPersonnelComponent', () => {
  let component: EnseignantViewComponent;
  let fixture: ComponentFixture<EnseignantViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnseignantViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnseignantViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
