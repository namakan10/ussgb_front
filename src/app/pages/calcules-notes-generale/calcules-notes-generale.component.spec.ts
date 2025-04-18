import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculesNotesGeneraleComponent } from './calcules-notes-generale.component';

describe('CalculesNotesGeneraleComponent', () => {
  let component: CalculesNotesGeneraleComponent;
  let fixture: ComponentFixture<CalculesNotesGeneraleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculesNotesGeneraleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculesNotesGeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
