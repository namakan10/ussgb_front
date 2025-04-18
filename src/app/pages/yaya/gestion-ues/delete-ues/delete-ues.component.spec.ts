import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUesComponent } from './delete-ues.component';

describe('DeleteUesComponent', () => {
  let component: DeleteUesComponent;
  let fixture: ComponentFixture<DeleteUesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteUesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
