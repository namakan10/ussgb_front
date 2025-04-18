import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOffresEntrepriseComponent } from './list-offres-entreprise.component';

describe('ListOffresEntrepriseComponent', () => {
  let component: ListOffresEntrepriseComponent;
  let fixture: ComponentFixture<ListOffresEntrepriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOffresEntrepriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOffresEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
