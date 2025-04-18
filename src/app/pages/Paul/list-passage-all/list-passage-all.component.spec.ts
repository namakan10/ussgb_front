import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPassageAllComponent } from './list-passage-all.component';

describe('ListPassageAllComponent', () => {
  let component: ListPassageAllComponent;
  let fixture: ComponentFixture<ListPassageAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPassageAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPassageAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
