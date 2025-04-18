import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNomAdmisComponent } from './list-nom-admis.component';

describe('ListNomAdmisComponent', () => {
  let component: ListNomAdmisComponent;
  let fixture: ComponentFixture<ListNomAdmisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListNomAdmisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNomAdmisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
