import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUesComponent } from './add-ues.component';

describe('AddUesComponent', () => {
  let component: AddUesComponent;
  let fixture: ComponentFixture<AddUesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
