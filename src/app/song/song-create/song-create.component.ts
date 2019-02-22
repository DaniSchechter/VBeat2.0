import { Component, OnInit } from '@angular/core';
import { Song, Genre } from '../song.model'
import { NgForm } from '@angular/forms';
import { SongService } from '../songs.service'
import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-song-create',
  templateUrl: './song-create.component.html',
  styleUrls: ['./song-create.component.css']
})
export class SongCreateComponent implements OnInit {

  song : Song;
  
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

  constructor(private songService: SongService, private userService:UserService) {}

  ngOnInit() {
    this.selected_artists = [];
    this.filtered_artists = [];  //gets an actual value only from pre-defined length - see updates below
    this.name_length_to_query = 2;
    this.genre_options = Object.keys(Genre);

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
      return;
    }
    // if(this.mode === 'create'){
    this.songService.addSong(
      form.value.name,
      form.value.genre,
      form.value.song_path,
      form.value.song_image,
      form.value.release_date,
      this.selected_artists,
      0
    )
    form.resetForm();
    this.clearFilteredrtists();
    this.selected_artists = [];
  }
  
  private clearFilteredrtists() {
    this.prefix = null;
    this.filtered_artists = [];
  }
}
