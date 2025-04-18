import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenseignantsComponent } from './genseignants.component';

describe('GserviceComponent', () => {
  let component: GenseignantsComponent;
  let fixture: ComponentFixture<GenseignantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenseignantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenseignantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
