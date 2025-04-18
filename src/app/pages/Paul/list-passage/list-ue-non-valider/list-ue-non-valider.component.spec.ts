import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUeNonValiderComponent } from './list-ue-non-valider.component';

describe('ListUeNonValiderComponent', () => {
  let component: ListUeNonValiderComponent;
  let fixture: ComponentFixture<ListUeNonValiderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUeNonValiderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUeNonValiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
