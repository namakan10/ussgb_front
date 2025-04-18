import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDesInscritsComponent } from './list-des-inscrits.component';

describe('ListDesInscritsComponent', () => {
  let component: ListDesInscritsComponent;
  let fixture: ComponentFixture<ListDesInscritsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDesInscritsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDesInscritsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
