import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadidatSpecialiteComponent } from './cadidat-specialite.component';

describe('CadidatSpecialiteComponent', () => {
  let component: CadidatSpecialiteComponent;
  let fixture: ComponentFixture<CadidatSpecialiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadidatSpecialiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadidatSpecialiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
