import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnseignantListComponent } from './enseignant-list.component';

describe('EnseignantComponent', () => {
  let component: EnseignantListComponent;
  let fixture: ComponentFixture<EnseignantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnseignantListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnseignantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
