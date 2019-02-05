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
  private mode = 'create';
  private songId : string;
  song : Song;
  
  //For select optios of genre
  genre_options: string[];  

  //TODO change to artists array not string array
  //TODO add the singed-in user as artist for this song - and disable his delete option 
  //Temp array for the selected artists, send to server only on submit
  selected_artists: string[];

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

  ngOnInit() {
    this.selected_artists = [];
    this.filtered_artists = [];  //gets an actual value only from pre-defined length - see updates below
    this.name_length_to_query = 3;
    //check if we in edit or create mode
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('id')){
            this.mode = 'edit';
            this.songId = paramMap.get('id');
            this.song = this.songService.getSong(this.songId);
        }else{
          this.mode = 'create';
          this.songId = null;
        }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.artists.filter(artist  => artist.toLowerCase().includes(filterValue));
  }

  //TODO change to artist type not string
  // Adds an artist that was selected to song's artists lis
  onSelectArtist(artist: string) {
    this.selected_artists.push(artist);
  }

  onSearchArtistChange(prefix: string) {
    //The value is being sent before an actual change in input - so expect (name_length_to_query - 1)
    //TODO - not filter the array - send query to db for artists which their name starts with prerfix
    if( prefix.length >= this.name_length_to_query - 1 )
      this.filtered_artists = this.artists.filter( artist => artist.startsWith(prefix));
  }

  onSubmit(form: NgForm){
    if(!form.valid) {
      return; //! TODO - display popup message to correct 
    }
    if(this.mode === 'create'){
    this.songService.addSong(
      form.value.name,
      form.value.genre,
      form.value.song_path,
      form.value.song_image,
      form.value.release_date,
      this.selected_artists, // TODO: change to artist array
      0);
    } else {
        this.songService.updateSong(this.songId, form.value.name,
          form.value.genre,
          form.value.song_path,
          form.value.song_image,
          form.value.release_date,
          this.selected_artists, // TODO: change to artist array
          this.song.num_of_times_liked);
    }
  }
}
