
import { Component, OnInit, Input } from '@angular/core';
import { Song } from '../song.model';
import { SongActionService } from '../song-action.sevice';
import { SongService } from '../songs.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-song-tool-bar',
  templateUrl: './song-tool-bar.component.html',
  styleUrls: ['./song-tool-bar.component.css']
})
export class SongToolBarComponent implements OnInit {

  @Input() song: Song;
  songLiked: boolean;
  // Not initializing in c'tor because of Singelton pattern
  songActionService: SongActionService;

  constructor(
    private songsService : SongService,
    private http: HttpClient)
  {
    this.songActionService = SongActionService.getInstance(http);
  }

  ngOnInit() {
    this.songLiked = false;
    // Listen for updates in num of likes through web sockets
    this.songActionService.getSongUpdatedSubject().subscribe( 
      (updatedSong: Song) => {
        if(this.song.id == updatedSong.id) {
          this.song.num_of_times_liked = updatedSong.num_of_times_liked;
        }
      }
    );
    // Synchronize like-button color, locally for each user
    this.songActionService.getLocalSongUpdateListener().subscribe(
      (updatedSong: Song) => {
        if(this.song.id == updatedSong.id) {
          this.songLiked = !this.songLiked;
        }
      }
    );
  }

  //TODO change to real action for the next 3 buttons 
  onAddToPlaylist() {alert("song "+ this.song.name +" added to playlist")}
  onPlay() {alert("song "+ this.song.name +" playnow")}
  onAddToQueue() {alert("song "+ this.song.name +" queue")}
  onLikeToggle() { 
    //If songLiked is true => click is to dislike => we want to decrease the num of likes
    if(this.songLiked)
      this.songActionService.unlike(this.song);
    else 
      this.songActionService.like(this.song);
    
  }

  onDelete() {
    this.songsService.deleteSong(this.song.id);
  }
}
