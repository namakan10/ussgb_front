import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammerSeancesComponent } from './programmer-seances.component';

describe('ProgrammerSeancesComponent', () => {
  let component: ProgrammerSeancesComponent;
  let fixture: ComponentFixture<ProgrammerSeancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgrammerSeancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammerSeancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
