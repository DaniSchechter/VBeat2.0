
import { Component, OnInit, Input } from '@angular/core';
import { Song } from '../song.model';
import { SongActionService } from '../song-action.sevice';
import { Playlist } from '../../playlist/playlist.model';
import { PlaylistService } from '../../playlist/playlist.service'
import { SongService } from '../songs.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationPopupService } from '../../notification/notification-popup.service';
import { NotificationStatus, Notification } from '../../notification/notification.model';



@Component({
  selector: 'app-song-tool-bar',
  templateUrl: './song-tool-bar.component.html',
  styleUrls: ['./song-tool-bar.component.css']
})
export class SongToolBarComponent implements OnInit {

  @Input() song: Song;
  songLiked: boolean;
  // Not initializing in c'tor because of Singelton pattern
  songActionService: SongActionService;
  playlists: Playlist[];
  playlistId: string;
  selectedPlaylists: Playlist[] = [];
  private notificationService: NotificationPopupService;


  constructor(
    private songsService : SongService,
    private playlistService: PlaylistService,
    private http: HttpClient)
  {
    this.songActionService = SongActionService.getInstance(http);
  }

  ngOnInit() {
    this.songLiked = false;
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

  onAddToPlaylist() {
    this.playlistService.getPlaylists();
    this.playlistService.getPlaylistsUpdateListener().subscribe(
      (playlistData: {playlists: Playlist[], totalPlaylists: number}) => {
        this.playlists = playlistData.playlists;
        this.selectedPlaylists = null;
    })
  }


    //TODO change to real action for the next 2 buttons 
  onPlay() {alert("song "+ this.song.name +" playnow")}
  onAddToQueue() {alert("song "+ this.song.name +" queue")}
  onLikeToggle() { 
    //If songLiked is true => click is to dislike => we want to decrease the num of likes
    if(this.songLiked) {
      //  deactivate the like button
      this.songActionService.unlike(this.song);
      //remove the song from the favorite playlist
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
        new Notification("no selected song",NotificationStatus.OK))
    }
    else{
    this.selectedPlaylists.forEach(Playlist => {
      Playlist.songList.push(song);
      this.playlistService.updatePlaylist(Playlist.id, Playlist.name, Playlist.songList);
    });
    this.selectedPlaylists = [];
    }
  }
}
