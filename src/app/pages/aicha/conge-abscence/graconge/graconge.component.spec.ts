import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GracongeComponent } from './graconge.component';

describe('GracongeComponent', () => {
  let component: GracongeComponent;
  let fixture: ComponentFixture<GracongeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GracongeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GracongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
