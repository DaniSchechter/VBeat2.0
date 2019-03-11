import { Component, OnInit, OnDestroy } from '@angular/core';
import { Song, Genre } from '../song.model'
import { NgForm } from '@angular/forms';
import { SongService } from '../songs.service'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { NotificationPopupService } from '../../notification/notification-popup.service';
import { NotificationStatus, Notification } from '../../notification/notification.model';

@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrls: ['./song-edit.component.css']
})

export class SongEditComponent implements OnInit, OnDestroy {

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

  // To be pulled from DB when needed
  artists: User[] = [];  

  //Only when the name's prefix of this length, query the db
  name_length_to_query: number;

  //Will represent temp artists that match filtering option
  filtered_artists: User[];

  // Will be automatically added as an artist for the new song
  connectedArtist: User;

  constructor(private songService: SongService, private route: ActivatedRoute,  private userService:UserService, private notificationService:NotificationPopupService) {}

  ngOnInit() {
    this.selected_artists = [];
    this.filtered_artists = [];  //gets an actual value only from pre-defined length - see updates below
    this.name_length_to_query = 2;
    this.genre_options = Object.keys(Genre);

    // Fetch the correct song to be edited by id
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('id')){
            this.songId = paramMap.get('id');
            // this.songService.getSongs();
            this.songService.getSong(this.songId)
              .subscribe(
                (song) => {
                  if(song){
                    this.song = song;
                    this.song.artists.forEach( artist => {
                      if(!this.selected_artists.some( selectedArtist => artist.username == selectedArtist.username ))
                        this.selected_artists.push(artist);
                  });
                  }
                  else{
                    alert("oops");
                  }
              });
        }
    });

    // Get the current signed in artist and set him as an artist for the new song
    this.userService.getUserPermissionsUpdateListener().subscribe(user => {
        this.connectedArtist = user;
        // When diplaying artist list, wont dislay connected user as it already selected
        // When reloading the page, header component also calls so need to call only once
        if(!this.selected_artists.some( selectedArtist => user.username == selectedArtist.username )) 
          this.selected_artists.push(this.connectedArtist);
        }
    );
    // When reloading the page, header component also calls so need to call only once
    if(this.selected_artists.length == 0) 
        this.userService.getUserPermissions();

    // Get in artist list even if not started filtering yet
    this.userService.getArtistsUpdateListener().subscribe(
      (artists: User[]) => { 
        // Filter the artists array from selected artists so they wont be selected again
        this.artists = [];
        artists.forEach( artist => {
          if( !this.selected_artists.some( selectedArtist => artist.username == selectedArtist.username ))
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
    this.selected_artists = this.selected_artists.filter( artist => artist.username != artist_to_delete.username);
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
    // Sometimes gets to her when prefix in null
    if(this.prefix) {
      this.filtered_artists = this.artists.filter( 
          artist => artist.display_name.toLowerCase().startsWith(this.prefix.toLowerCase())
      ); 
    }
  }

  onSend(form : NgForm){
    const currentDate = new Date();
    if(!form.valid) {
      this.notificationService.submitNotification(
        new Notification("Form is not valid",NotificationStatus.ERROR)); 
    }
    else if(form.value.release_date > currentDate){
      this.notificationService.submitNotification(
        new Notification("Cannot pick future date",NotificationStatus.ERROR))
    }
    else {
      this.onSubmit(form);
    }
  }

  onSubmit(form: NgForm){
      this.songService.updateSong(
        this.songId, 
        form.value.name,
        form.value.genre,
        encodeURI(form.value.song_path),
        encodeURI(form.value.song_image),
        form.value.release_date,
        this.selected_artists, 
        this.song.num_of_times_liked
      )
      form.resetForm();
  }

  private clearFilteredrtists() {
    this.prefix = null;
    this.filtered_artists = [];
  }

  ngOnDestroy(): void {
    if(this.songSub) {
      this.songSub.unsubscribe();
    }
  }
}
