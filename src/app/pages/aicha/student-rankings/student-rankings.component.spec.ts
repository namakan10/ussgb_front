import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRankingsComponent } from './student-rankings.component';

describe('ListeEtudiantsComponent', () => {
  let component: StudentRankingsComponent;
  let fixture: ComponentFixture<StudentRankingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentRankingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
