import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeStructuresListComponent } from './charge-structures-list.component';

describe('ChargeStructuresListComponent', () => {
  let component: ChargeStructuresListComponent;
  let fixture: ComponentFixture<ChargeStructuresListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeStructuresListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeStructuresListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
