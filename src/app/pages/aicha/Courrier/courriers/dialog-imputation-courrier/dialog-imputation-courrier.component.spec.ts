import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogImputationCourrierComponent } from './dialog-imputation-courrier.component';

describe('DialogCongeComponent', () => {
  let component: DialogImputationCourrierComponent;
  let fixture: ComponentFixture<DialogImputationCourrierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogImputationCourrierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogImputationCourrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
