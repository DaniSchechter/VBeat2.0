import { Component, OnInit, ElementRef } from '@angular/core';
import { Song } from '../../song/song.model';
import { ViewChild } from '@angular/core'

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit {

  // Reference to html audio
  @ViewChild('player') player: ElementRef;
  image:string = "https://images.pexels.com/photos/35646/pexels-photo.jpg?cs=srgb&dl=close-up-dahlia-flower-35646.jpg&fm=jpg";

  songs: Song[];

  constructor() { }

  ngOnInit() {
  }

  onSongEnded(player): void {
    // remove the ended song (first song in the array)
    this.songs.shift();
    this.player.nativeElement.load();
    this.player.nativeElement.play();
  }

  playNow(song: Song): void {
    this.songs.unshift(song);
    this.player.nativeElement.load();
    this.player.nativeElement.play();
  }

  addToQueue(song: Song): void {
    // Add new song to the end of the array
    this.songs.push(song);
  }

  playPlaylist(songs: Song[]): void {
    this.songs = songs;
    this.player.nativeElement.load();
    this.player.nativeElement.play();
  }

}
