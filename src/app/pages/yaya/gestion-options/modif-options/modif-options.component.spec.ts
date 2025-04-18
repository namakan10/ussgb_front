import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifOptionsComponent } from './modif-options.component';

describe('ModifOptionsComponent', () => {
  let component: ModifOptionsComponent;
  let fixture: ComponentFixture<ModifOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
