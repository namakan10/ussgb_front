import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeFsegListComponent } from './charge-fseg-list.component';

describe('ChargeFsegListComponent', () => {
  let component: ChargeFsegListComponent;
  let fixture: ComponentFixture<ChargeFsegListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeFsegListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeFsegListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
