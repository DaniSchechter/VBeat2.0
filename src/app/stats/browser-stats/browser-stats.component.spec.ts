import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserStatsComponent } from './browser-stats.component';

describe('BrowserStatsComponent', () => {
  let component: BrowserStatsComponent;
  let fixture: ComponentFixture<BrowserStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
