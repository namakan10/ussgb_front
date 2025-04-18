import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesAdmisComponent } from './liste-des-admis.component';

describe('ListeDesAdmisComponent', () => {
  let component: ListeDesAdmisComponent;
  let fixture: ComponentFixture<ListeDesAdmisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeDesAdmisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeDesAdmisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
