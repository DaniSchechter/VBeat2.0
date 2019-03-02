
import { Component, OnInit, Input } from '@angular/core';
import { Song } from '../song.model';
import { SongActionService } from '../song-action.sevice';
import { Playlist } from '../../playlist/playlist.model';
import { PlaylistService } from '../../playlist/playlist.service';
import { UserService } from '../../user/user.service';
import { SongService } from '../songs.service';
import { HttpClient } from '@angular/common/http';
import { NotificationPopupService } from '../../notification/notification-popup.service';
import { NotificationStatus, Notification } from '../../notification/notification.model';
import { MusicPlayerService } from '../../player/music-player/music-player.service';
import { SongPlayAction } from '../../player/music-player/songPlayAction';

@Component({
  selector: 'app-song-tool-bar',
  templateUrl: './song-tool-bar.component.html',
  styleUrls: ['./song-tool-bar.component.css']
})
export class SongToolBarComponent implements OnInit {

  @Input() song: Song;
  isConnected = false;
  songLiked: boolean = false;
  // Not initializing in c'tor because of Singelton pattern
  songActionService: SongActionService;
  playlists: Playlist[];
  playlistId: string;
  selectedPlaylists: Playlist[] = [];

  /* At first false so at load time, component wont enable owner permissions for a second
     Untill is shows no pernissions
     will be updated on ngInit */
  hasOwnerPermissions: boolean = false;

  constructor(
    private userService:UserService,
    private notificationService: NotificationPopupService,
    private songsService : SongService,
    private playlistService: PlaylistService,
    private musicPlayerService: MusicPlayerService,
    private http: HttpClient)
  {
    this.songActionService = SongActionService.getInstance(http);
  }

  ngOnInit() {

    // Diaplay each song as liked or not as it appears in DB
    this.playlistService.getFavPlaylistUpdateListener().subscribe( likedSongsPlaylist => {
      if (likedSongsPlaylist){
        this.songLiked = likedSongsPlaylist.songList.some( (song:Song) => song.id == this.song.id );
        // this.isConnected = true;
      }
      else{
        // this.isConnected = false;
      }
    });
    this.isConnected = this.userService.isLoggedIn;
    this.playlistService.getFavPlaylist();
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

    this.loadPermissionToConnectedUser();
  }

  onAddSongToPlaylist(playlist_action: Playlist){
    if(! this.selectedPlaylists)
      this.selectedPlaylists = new Array(1);
    // remove the playlist from the list of selected playlists
    if (this.selectedPlaylists.includes(playlist_action)){
      this.selectedPlaylists = this.selectedPlaylists.filter( playlist => playlist != playlist_action);
    }
    // add the selected to list of selected playlists
    else {
      this.selectedPlaylists.push(playlist_action);
    }
  }

  onAddToPlaylist(song: Song) {
    this.playlistService.getPlaylists();
    this.playlistService.getPlaylistsUpdateListener().subscribe(
      (playlistData: {playlists: Playlist[], totalPlaylists: number}) => {
        this.playlists = playlistData.playlists.filter(playlist => playlist.name != "LIKED SONGS");
        this.playlists.forEach(playlistToRemove => {
          if(playlistToRemove.songList.some( songInPlaylist => songInPlaylist.id == song.id )){
            this.playlists = this.playlists.filter( playlist => playlist.id != playlistToRemove.id );
          }
        })
        this.selectedPlaylists = [];
    })
  }


  onPlay() { this.musicPlayerService.play([this.song], SongPlayAction.PLAY_SONG_NOW); }
  onAddToQueue() { this.musicPlayerService.play([this.song], SongPlayAction.ADD_SONG_TO_QUEUE); }
  onLikeToggle() { 
    //If songLiked is true => click is to dislike => we want to decrease the num of likes
    if(this.songLiked) {
      // deactivate the like button
      this.songActionService.unlike(this.song);
      // remove the song from the favorite playlist
      this.playlistService.removeSongFromFavoritePlaylist(this.song);
    }
    else {
      // activate the like button
      this.songActionService.like(this.song);
      // create or update favorite playlist
      this.playlistService.addSongToFavoritePlaylist(this.song);  
    }
  }

  onDelete() {
    this.songsService.deleteSong(this.song.id);
  }

  saveToPlaylists(song: Song){
    if (!this.selectedPlaylists || this.selectedPlaylists.length == 0){
      this.notificationService.submitNotification(
        new Notification("No selected playlists",NotificationStatus.OK))
    }
    else{
      this.playlistService.addSongToPlaylists(this.selectedPlaylists, song);
    }
    this.playlists.forEach(playlist => {
      if (this.selectedPlaylists.includes(playlist)){
        this.playlists = this.playlists.filter(playlistToRemove => playlistToRemove.id != playlist.id);
      }
    });
    this.selectedPlaylists = [];
  }

  loadPermissionToConnectedUser() {
    if(this.userService.connectedUser == undefined)
    {
        this.userService.getUserPermissionsUpdateListener().subscribe(user => {
          this.hasOwnerPermissions = this.song.artists.some( 
              (artist) => {
                return artist.username == user.username;
              }
            );
        });
    }
    else {
      this.hasOwnerPermissions = this.song.artists.some( 
          (artist) => {
            return artist.username == this.userService.connectedUser.username
          }
        );
      // console.log('owner permissions for song => ',this.song.name, this.hasOwnerPermissions);
    }
  }
}
