import { Component, OnInit } from '@angular/core';
import { Playlist } from '../playlist.model'
import { NgForm } from '@angular/forms';
import { PlaylistService } from '../playlist.service'
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
  private user_id: string;
  playlist : Playlist;
  playlists: Playlist[];

  
  //TODO change to songs array not string array
  //TODO add the singed-in user as song for this playlist - and disable his delete option 
  //Temp array for the selected songs, send to server only on submit
  selected_songs: string[];

  //Temp string for current prefix filter
  prefix: string;

  //TODO - remove the hard-coded songs and send real db queries as explained in the html - leave the list as empty list
  songs: string[]= ['CardiB','Catey','CICI','Pink','Pupi','Marshmelo','Melo','Khalid','Kuki','Bruno M'];  

  //Only when the name's prefix of this length, query the db
  name_length_to_query: number;

  //TODO change to song type not string
  //Will represent temp songs that match filtering option
  filtered_songs: string[];

  constructor(private playlistService: PlaylistService, public route: ActivatedRoute) {
  }

  // !!!! TODO change to load only one playlist and not the entire playlists
  ngOnInit() {
    this.selected_songs = [];
    this.filtered_songs = [];  //gets an actual value only from pre-defined length - see updates below
    this.name_length_to_query = 2;
    this.playlist = this.playlistService.getPlaylist(this.playlists, this.playlistId);
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('id')){
            this.playlistId = paramMap.get('id');
            this.playlistService.getPlaylist(this.playlists, this.playlistId);
            this.playlistService.getPlaylists();
            this.playlistSub = this.playlistService.getPlaylistsUpdateListener()
            .subscribe((playlistData: {playlists: Playlist[], totalPlaylists: number}) => {
                this.playlists = playlistData.playlists;
                this.playlist = this.playlistService.getPlaylist(this.playlists, this.playlistId);
                this.selected_songs = this.playlist.song_list;
              });
        }
    });
  }

  //TODO change to song type not string
  // Adds an song that was selected to playlist's songs list
  onSelectSong(song: string) {
    this.selected_songs.push(song);
    this.clearFilteredrtists();
  }

  onSearchSongChange() {
    if(this.prefix == null || this.prefix.length == 0) {
      this.clearFilteredrtists();
    }
    //TODO - not filter the array - send query to db for songs which their name starts with prerfix
    else if( this.prefix.length >= this.name_length_to_query ) {
      this.filtered_songs = this.songs.filter( song => song.toLowerCase().startsWith(this.prefix.toLowerCase()));
    }
  }
  //TODO change to song type not string
  onDeleteSelectedSong(song_to_delete: string) {
    this.selected_songs = this.selected_songs.filter( song => song != song_to_delete);
  }

  onSubmit(form: NgForm){
    if(!form.valid) {
      return; //! TODO - display popup message to correct 
    }
      this.playlistService.updatePlaylist(
        this.playlistId, 
        form.value.name,
        this.user_id,
        this.selected_songs, // TODO: change to song array
      )
      form.resetForm();
    }

  private clearFilteredrtists() {
    this.prefix = null;
    this.filtered_songs = [];
  }
}
