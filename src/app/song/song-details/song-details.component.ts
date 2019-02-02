import { Component, OnInit, Input } from '@angular/core';
import { Song, Genre } from '../song.model';

@Component({
  selector: 'app-song-details',
  templateUrl: './song-details.component.html',
  styleUrls: ['./song-details.component.css']
})
export class SongDetailsComponent implements OnInit {

  @Input()
  song: Song;
  constructor() { }

  ngOnInit() {
  }

}
