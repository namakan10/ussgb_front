import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmargementsComponent } from './emargements.component';

describe('EmargementsComponent', () => {
  let component: EmargementsComponent;
  let fixture: ComponentFixture<EmargementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmargementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmargementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
