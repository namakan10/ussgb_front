import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpersonnelsComponent } from './gpersonnels.component';

describe('GserviceComponent', () => {
  let component: GpersonnelsComponent;
  let fixture: ComponentFixture<GpersonnelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpersonnelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpersonnelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
