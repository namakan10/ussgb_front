import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifUesComponent } from './modif-ues.component';

describe('ModifUesComponent', () => {
  let component: ModifUesComponent;
  let fixture: ComponentFixture<ModifUesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifUesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifUesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
