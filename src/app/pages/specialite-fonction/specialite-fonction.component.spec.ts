import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialiteFonctionComponent } from './specialite-fonction.component';

describe('SpecialiteFonctionComponent', () => {
  let component: SpecialiteFonctionComponent;
  let fixture: ComponentFixture<SpecialiteFonctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialiteFonctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialiteFonctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
