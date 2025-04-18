import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleAttestationsComponent } from './multiple-attestations.component';

describe('MultipleAttestationsComponent', () => {
  let component: MultipleAttestationsComponent;
  let fixture: ComponentFixture<MultipleAttestationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleAttestationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleAttestationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
