import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDesNotesCalculComponent } from './list-des-notes-calcul.component';

describe('ListDesNotesCalculComponent', () => {
  let component: ListDesNotesCalculComponent;
  let fixture: ComponentFixture<ListDesNotesCalculComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDesNotesCalculComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDesNotesCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
