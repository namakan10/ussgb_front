import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPageHandleComponent } from './other-page-handle.component';

describe('OtherPageHandleComponent', () => {
  let component: OtherPageHandleComponent;
  let fixture: ComponentFixture<OtherPageHandleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherPageHandleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherPageHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
