import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DureeCongesComponent } from './duree-conges.component';

describe('DureeCongesComponent', () => {
  let component: DureeCongesComponent;
  let fixture: ComponentFixture<DureeCongesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DureeCongesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DureeCongesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
