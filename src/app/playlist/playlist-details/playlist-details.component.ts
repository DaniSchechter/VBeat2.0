import { Component, OnInit, Input } from '@angular/core';
import { Playlist } from '../playlist.model';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.css']
})
export class PlaylistDetailsComponent implements OnInit {

  @Input()
  playlist: Playlist;

  constructor() {}

  ngOnInit() {
  }
}
