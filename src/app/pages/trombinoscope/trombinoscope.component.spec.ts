import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrombinoscopeComponent } from './trombinoscope.component';

describe('TrombinoscopeComponent', () => {
  let component: TrombinoscopeComponent;
  let fixture: ComponentFixture<TrombinoscopeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrombinoscopeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrombinoscopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
