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

  constructor() { }

  ngOnInit() {
  }

  //TODO change to real action
  onAddToPlaylist() {alert("song "+ this.song.name +" added to playlist")}
  onPlay() {alert("song "+ this.song.name +" playnow")}
  onAddToQueue() {alert("song "+ this.song.name +" queue")}
}
