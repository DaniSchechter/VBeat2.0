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
  
  //! TODO - get the user id of the current user
  playlist : Playlist;
  playlists: Playlist[];

  
  //TODO add the singed-in user as song for this playlist - and disable his delete option 
  //Temp array for the selected songs, send to server only on submit
  selected_songs: Song[];


  constructor(private playlistService: PlaylistService, public route: ActivatedRoute) {
  }

  // !!!! TODO change to load only one playlist and not the entire playlists
  ngOnInit() {
    // this.selected_songs = [];
    // this.playlist = this.playlistService.getPlaylist(this.playlists, this.playlistId);
    // this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //     if (paramMap.has('id')){
    //         this.playlistId = paramMap.get('id');
    //         this.playlistService.getPlaylist(this.playlists, this.playlistId);
    //         this.playlistService.getPlaylists();
    //         this.playlistSub = this.playlistService.getPlaylistsUpdateListener()
    //         .subscribe((playlistData: {playlists: Playlist[], totalPlaylists: number}) => {
    //           // get all playlists
    //             this.playlists = playlistData.playlists;
    //             // the the edited playlist
    //             this.playlist = this.playlistService.getPlaylist(this.playlists, this.playlistId);
    //             // get the song list og the edited playlist
    //             this.selected_songs = this.playlist.songList;
    //           });
    //     }
    // });
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
      return; //! TODO - display popup message to correct 
    }
      this.playlistService.updatePlaylist(
        this.playlistId, 
        form.value.name,
        this.selected_songs,
      )
      form.resetForm();
    }
}
