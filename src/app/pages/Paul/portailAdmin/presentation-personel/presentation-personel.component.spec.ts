import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationPersonelComponent } from './presentation-personel.component';

describe('PresentationPersonelComponent', () => {
  let component: PresentationPersonelComponent;
  let fixture: ComponentFixture<PresentationPersonelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresentationPersonelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationPersonelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
