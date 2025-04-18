import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AichaViewComponent } from './aicha-view.component';

describe('AddPersonnelComponent', () => {
  let component: AichaViewComponent;
  let fixture: ComponentFixture<AichaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AichaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AichaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
