import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDesNotesEcCalculComponent } from './list-des-notes-ec-calcul.component';

describe('ListDesNotesEcCalculComponent', () => {
  let component: ListDesNotesEcCalculComponent;
  let fixture: ComponentFixture<ListDesNotesEcCalculComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDesNotesEcCalculComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDesNotesEcCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
