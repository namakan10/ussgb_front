import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UeAddComponent } from './ue-add.component';

describe('UeAddComponent', () => {
  let component: UeAddComponent;
  let fixture: ComponentFixture<UeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
