
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Song } from '../song.model';
import { SongActionService } from '../song-action.sevice';
import { SongService } from '../songs.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-song-tool-bar',
  templateUrl: './song-tool-bar.component.html',
  styleUrls: ['./song-tool-bar.component.css']
})
export class SongToolBarComponent implements OnInit {

  @Input() song: Song;
  
  songLiked: boolean;


  constructor(private songsService : SongService,  
              private songActionService: SongActionService) { }

  ngOnInit() {
    this.songLiked = false;

    this.songActionService.getSongUpdateListener()
      .subscribe( (updatedSong: {song: Song, newNumOfLikes:number} ) => {
        if(this.song.id == updatedSong.song.id) {
          this.songLiked = !this.songLiked;
        }
      });

  }

  //TODO change to real action for the next 3 buttons 
  onAddToPlaylist() {alert("song "+ this.song.name +" added to playlist")}
  onPlay() {alert("song "+ this.song.name +" playnow")}
  onAddToQueue() {alert("song "+ this.song.name +" queue")}
  onLikeToggle() { 
    //If songLiked is true => click is to dislike => we want to decrease the num of likes
    if(this.songLiked)
      this.songActionService.updateSongLikeStatus(this.song, -1);
    else 
      this.songActionService.updateSongLikeStatus(this.song, 1);
    
  }

   onDelete() {
    this.songsService.deleteSong(this.song.id);
  }
}
