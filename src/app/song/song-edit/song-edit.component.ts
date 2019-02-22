import { Component, OnInit } from '@angular/core';
import { Song, Genre } from '../song.model'
import { NgForm } from '@angular/forms';
import { SongService } from '../songs.service'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrls: ['./song-edit.component.css']
})

export class SongEditComponent implements OnInit {

  private songId : string;
  private songSub: Subscription;
  song : Song;
  songs: Song[];

  //For select_optios of genre - populated from Genre option ENUM
  genre_options: string[];
  
  //Temp array for the selected artists, send to server only on submit
  selected_artists: User[];

  //Temp string for current prefix filter
  prefix: string;

  //! TODO add the singed-in user as artist for this song inside the list - and disable his delete option 
  //! TODO when diplaying artist list, dont display yourself
  // To be pulled from DB when needed
  artists: User[] = [];  

  //Only when the name's prefix of this length, query the db
  name_length_to_query: number;

  //Will represent temp artists that match filtering option
  filtered_artists: User[];

  constructor(private songService: SongService, public route: ActivatedRoute,  private userService:UserService) {}

  // !!!! TODO change to load only one song and not the entire songs
  ngOnInit() {
    this.selected_artists = [];
    this.filtered_artists = [];  //gets an actual value only from pre-defined length - see updates below
    this.name_length_to_query = 2;
    this.genre_options = Object.keys(Genre);
    this.song = this.songService.getSong(this.songs, this.songId);

    // Update local artist list when called by listening for changes
    this.userService.getArtistsUpdateListener().subscribe(
      (artists: User[]) => { 

        // Filter the artists array from selected artists so they wont be selected again
        this.artists = [];
        artists.forEach( artist => {
          if( !this.selected_artists.some( selectedArtist => artist.id == selectedArtist.id ))
            this.artists.push(artist);
        });

        this.filterArtists();
      }
    );

    // Fetch the correct song to be edited by id
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('id')){
            this.songId = paramMap.get('id');
            this.songService.getSong(this.songs, this.songId);
            this.songService.getSongs();
            this.songSub = this.songService.getSongsUpdateListener()
            .subscribe((songData: {songs: Song[], totalSongs: number}) => {
                this.songs = songData.songs;
                this.song = this.songService.getSong(this.songs, this.songId);
                this.selected_artists = this.song.artists;
            });
        }
    });
  }

  // Adds an artist that was selected to song's artists list
  onSelectArtist(artist: User) {
    this.selected_artists.push(artist);
    this.clearFilteredrtists();          
  }

  // Removes an artist from song's artists list
  onDeleteSelectedArtist(artist_to_delete: User) {
    this.selected_artists = this.selected_artists.filter( artist => artist.id != artist_to_delete.id);
  }

  onSearchArtistChange() {
    if(this.prefix == null || this.prefix.length == 0) {
      this.clearFilteredrtists();
    }

    else if( this.prefix.length >= this.name_length_to_query ) {
      if( this.prefix.length == this.name_length_to_query ) {
        this.userService.getArtists();
      }
      else {
        this.filterArtists();
      }
    }
  }

  filterArtists() {
    this.filtered_artists = this.artists.filter( 
        artist => artist.display_name.toLowerCase().startsWith(this.prefix.toLowerCase())); 
  }

  onSubmit(form: NgForm){
    if(!form.valid) {
      return; //! TODO - display popup message to correct 
    }
      this.songService.updateSong(
        this.songId, 
        form.value.name,
        form.value.genre,
        form.value.song_path,
        form.value.song_image,
        form.value.release_date,
        this.selected_artists, // TODO: change to artist array
        this.song.num_of_times_liked
      )
      form.resetForm();
    }

  private clearFilteredrtists() {
    this.prefix = null;
    this.filtered_artists = [];
  }
}
