import { Component, OnInit, Input } from '@angular/core';

import { Song } from '../song.model'

@Component({
  selector: 'app-song-tool-bar',
  templateUrl: './song-tool-bar.component.html',
  styleUrls: ['./song-tool-bar.component.css']
})
export class SongToolBarComponent implements OnInit {

  @Input()
  song: Song;
  songLiked: boolean;

  constructor() { }

  ngOnInit() {
    this.songLiked = false;
  }

  //TODO change to real action for the next 3 buttons - the 4 is done
  onAddToPlaylist() {alert("song "+ this.song.name +" added to playlist")}
  onPlay() {alert("song "+ this.song.name +" playnow")}
  onAddToQueue() {alert("song "+ this.song.name +" queue")}
  onLikeToggle() { this.songLiked = !this.songLiked; }
}
