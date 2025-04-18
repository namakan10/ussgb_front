import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YayaComponent } from './yaya.component';

describe('YayaComponent', () => {
  let component: YayaComponent;
  let fixture: ComponentFixture<YayaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YayaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YayaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
