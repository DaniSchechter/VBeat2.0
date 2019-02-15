import { Component, OnInit } from '@angular/core';
import { Song, Genre } from '../song.model'
import { NgForm } from '@angular/forms';
import { SongService } from '../songs.service'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';


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
  a = 3;
  //For select optios of genre
  genre_options: string[];
  
  //TODO change to artists array not string array
  //TODO add the singed-in user as artist for this song - and disable his delete option 
  //Temp array for the selected artists, send to server only on submit
  selected_artists: string[];

  //Temp string for current prefix filter
  prefix: string;

  //TODO - remove the hard-coded artists and send real db queries as explained in the html - leave the list as empty list
  artists: string[]= ['CardiB','Catey','CICI','Pink','Pupi','Marshmelo','Melo','Khalid','Kuki','Bruno M'];  

  //Only when the name's prefix of this length, query the db
  name_length_to_query: number;

  //TODO change to artist type not string
  //Will represent temp artists that match filtering option
  filtered_artists: string[];

  constructor(private songService: SongService, public route: ActivatedRoute) {
    this.genre_options = Object.keys(Genre);
  }

  // !!!! TODO change to load only one song and not the entire songs
  ngOnInit() {
    this.selected_artists = [];
    this.filtered_artists = [];  //gets an actual value only from pre-defined length - see updates below
    this.name_length_to_query = 2;
    this.song = this.songService.getSong(this.songs, this.songId);
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('id')){
            this.songId = paramMap.get('id');
            this.songService.getSong(this.songs, this.songId);
            this.songService.getSongs();
            this.songSub = this.songService.getSongsUpdateListener()
              .subscribe((songs: Song[]) => {
                this.songs = songs;
                this.song = this.songService.getSong(this.songs, this.songId);
                this.selected_artists = this.song.artists;
              });
        }
    });
  }

  //TODO change to artist type not string
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
