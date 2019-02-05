import { Component, OnInit, Input } from '@angular/core';

import { Song } from '../song.model'
import { SongService } from '../songs.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-song-tool-bar',
  templateUrl: './song-tool-bar.component.html',
  styleUrls: ['./song-tool-bar.component.css']
})
export class SongToolBarComponent implements OnInit {

  @Input()
  song: Song;
  songLiked: boolean;

  constructor(public songsService : SongService) { }

  ngOnInit() {
    this.songLiked = false;
    // this.songsService.getSongs();
    // this.songSub = this.songsService.getSongsUpdateListener()
    // .subscribe((songs: Song[]) => {
    //   this.songs = songs;
    // })
  }

  

  //TODO change to real action for the next 3 buttons 
  onAddToPlaylist() {alert("song "+ this.song.name +" added to playlist")}
  onPlay() {alert("song "+ this.song.name +" playnow")}
  onAddToQueue() {alert("song "+ this.song.name +" queue")}
  onLikeToggle() { 
    if( this.songLiked ) {
      this.song.id
      this.song.num_of_times_liked -= 1;
    }
    else {
      this.song.num_of_times_liked += 1;
    }
    this.songLiked = !this.songLiked;
    //TODO add notification for the server
   }

   onDelete(){
    this.songsService.deleteSong(this.song.id);
  }
   
}
