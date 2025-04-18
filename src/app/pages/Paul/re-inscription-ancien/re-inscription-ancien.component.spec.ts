import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReInscriptionAncienComponent } from './re-inscription-ancien.component';

describe('ReInscriptionAncienComponent', () => {
  let component: ReInscriptionAncienComponent;
  let fixture: ComponentFixture<ReInscriptionAncienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReInscriptionAncienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReInscriptionAncienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
