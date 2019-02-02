import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongToolBarComponent } from './song-tool-bar.component';

describe('SongToolBarComponent', () => {
  let component: SongToolBarComponent;
  let fixture: ComponentFixture<SongToolBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongToolBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
