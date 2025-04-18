import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreDetailComponent } from './livre-detail.component';

describe('LivreDetailComponent', () => {
  let component: LivreDetailComponent;
  let fixture: ComponentFixture<LivreDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivreDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivreDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
