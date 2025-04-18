import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOptionsComponent } from './delete-options.component';

describe('DeleteOptionsComponent', () => {
  let component: DeleteOptionsComponent;
  let fixture: ComponentFixture<DeleteOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
