import { Component, OnInit } from '@angular/core';
import { Song, Genre } from '../song.model'
import { NgForm } from '@angular/forms';
import { SongService } from '../songs.service'
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-song-create',
  templateUrl: './song-create.component.html',
  styleUrls: ['./song-create.component.css']
})
export class SongCreateComponent implements OnInit {
  // private mode = 'create';
  private songId : string;
  song : Song;
  
  //For select optios of genre
  genre_options: string[];
  
  //Temp array for the selected artists, send to server only on submit
  selected_artists: string[];

  //Temp string for current prefix filter
  prefix: string;

  //! TODO add the singed-in user as artist for this song inside the list - and disable his delete option 
  //! TODO when diplaying artist list, dont display yourself
  artists: string[]= ['CardiB','Catey','CICI','Pink','Pupi','Marshmelo','Melo','Khalid','Kuki','Bruno M'];  

  //Only when the name's prefix of this length, query the db
  name_length_to_query: number;

  //TODO change to artist type not string
  //Will represent temp artists that match filtering option
  filtered_artists: string[];

  constructor(private songService: SongService, /*public route: ActivatedRoute*/) {}

  ngOnInit() {
    this.selected_artists = [];
    this.filtered_artists = [];  //gets an actual value only from pre-defined length - see updates below
    this.name_length_to_query = 2;
    this.genre_options = Object.keys(Genre);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.artists.filter(artist  => artist.toLowerCase().includes(filterValue));
  }

  //TODO change to artist type not string
  //! TODO when selecting artist from the list, remove it from there, on delete bring back
  // Adds an artist that was selected to song's artists lis
  onSelectArtist(artist: string) {
    this.selected_artists.push(artist);
    this.clearFilteredrtists();
  }

  onSearchArtistChange() {
    if(this.prefix == null || this.prefix.length == 0) {
      this.clearFilteredrtists();
    }
    //TODO - not filter the array - send query to db for artists which their name starts with prerfix
    else if( this.prefix.length >= this.name_length_to_query ) {
      this.filtered_artists = this.artists.filter( artist => artist.toLowerCase().startsWith(this.prefix.toLowerCase()));
    }
  }
  //TODO change to artist type not string
  onDeleteSelectedArtist(artist_to_delete: string) {
    this.selected_artists = this.selected_artists.filter( artist => artist != artist_to_delete);
  }

  onSubmit(form: NgForm){
    if(!form.valid) {
      return; //! TODO - display popup message to correct 
    }
    // if(this.mode === 'create'){
    this.songService.addSong(
      form.value.name,
      form.value.genre,
      form.value.song_path,
      form.value.song_image,
      form.value.release_date,
      this.selected_artists, // TODO: change to artist array
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
