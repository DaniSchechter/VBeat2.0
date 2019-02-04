import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { Song } from '../song.model'
import { SongService } from '../songs.service';

@Component({
  selector: 'app-song-tool-bar',
  templateUrl: './song-tool-bar.component.html',
  styleUrls: ['./song-tool-bar.component.css']
})
export class SongToolBarComponent implements OnInit {

  songs: Song[];
  private songSub: Subscription;


  @Input()
  song: Song;
  songLiked: boolean;

  constructor(public songsService : SongService) { }

  ngOnInit() {
    this.songLiked = false;
    this.songsService.getSongs();
    this.songSub = this.songsService.getSongsUpdateListener()
    .subscribe((songs: Song[]) => {
      this.songs = songs;
    })
  }

  //TODO change to real action for the next 3 buttons 
  onAddToPlaylist() {alert("song "+ this.song.name +" added to playlist")}
  onPlay() {alert("song "+ this.song.name +" playnow")}
  onAddToQueue() {alert("song "+ this.song.name +" queue")}
  onLikeToggle() { 
    this.songLiked = !this.songLiked;
    this.song.num_of_times_liked += 1;
    //TODO add notification ffor the server
   }

   onDelete(songId: string){
     this.songsService.deleteSong(songId);
   }

   ngOnDestroy(): void {
     //Called once, before the instance is destroyed.
     //Add 'implements OnDestroy' to the class.
     this.songSub.unsubscribe();
   }
}
