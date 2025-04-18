import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutrePayementComponent } from './autre-payement.component';

describe('AutrePayementComponent', () => {
  let component: AutrePayementComponent;
  let fixture: ComponentFixture<AutrePayementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutrePayementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutrePayementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
