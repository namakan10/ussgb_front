import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatFrequentationComponent } from './certificat-frequentation.component';

describe('CertificatFrequentationComponent', () => {
  let component: CertificatFrequentationComponent;
  let fixture: ComponentFixture<CertificatFrequentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificatFrequentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificatFrequentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
