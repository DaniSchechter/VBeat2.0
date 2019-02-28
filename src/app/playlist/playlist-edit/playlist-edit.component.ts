import { Component, OnInit } from '@angular/core';
import { Playlist } from '../playlist.model';
import { Song } from '../../song/song.model';
import { NgForm } from '@angular/forms';
import { PlaylistService } from '../playlist.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-playlist-edit',
  templateUrl: './playlist-edit.component.html',
  styleUrls: ['./playlist-edit.component.css']
})

export class PlaylistEditComponent implements OnInit {
  private playlistId : string;
  private playlistSub: Subscription;
  
  playlist : Playlist;
  playlists: Playlist[];
 
  //Temp array for the selected songs, send to server only on submit
  selected_songs: Song[];


  constructor(private playlistService: PlaylistService, public route: ActivatedRoute) {
  }

  ngOnInit() {

  }

  // Adds an song that was selected to playlist's songs list
  onSelectSong(song: Song) {
    this.selected_songs.push(song);
  }

  // delete this song from the selected song list
  onDeleteSelectedSong(song_to_delete: string) {
    this.selected_songs = this.selected_songs.filter( song => song.id != song_to_delete);
  }

  onSubmit(form: NgForm){
    if(!form.valid) {
      return; 
    }
      this.playlistService.updatePlaylist(
        this.playlistId, 
        form.value.name,
        this.selected_songs,
      )
      form.resetForm();
    }
}
