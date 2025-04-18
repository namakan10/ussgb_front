import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleStructureComponent } from './single-structure.component';

describe('SingleStructureComponent', () => {
  let component: SingleStructureComponent;
  let fixture: ComponentFixture<SingleStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
