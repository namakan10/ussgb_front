import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPassageComponent } from './list-passage.component';

describe('ListPassageComponent', () => {
  let component: ListPassageComponent;
  let fixture: ComponentFixture<ListPassageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPassageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
