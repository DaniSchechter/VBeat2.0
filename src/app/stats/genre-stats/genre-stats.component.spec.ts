import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreStatsComponent } from './genre-stats.component';

describe('GenreStatsComponent', () => {
  let component: GenreStatsComponent;
  let fixture: ComponentFixture<GenreStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenreStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
