import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeInteresseComponent } from './liste-interesse.component';

describe('ListeInteresseComponent', () => {
  let component: ListeInteresseComponent;
  let fixture: ComponentFixture<ListeInteresseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeInteresseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeInteresseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
