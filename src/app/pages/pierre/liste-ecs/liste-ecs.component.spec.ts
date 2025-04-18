import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeEcsComponent } from './liste-ecs.component';

describe('ListeEcsComponent', () => {
  let component: ListeEcsComponent;
  let fixture: ComponentFixture<ListeEcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeEcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeEcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
