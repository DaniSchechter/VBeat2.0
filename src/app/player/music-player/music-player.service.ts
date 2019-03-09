import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Song }  from '../../song/song.model';
import { SongPlayAction } from '../music-player/songPlayAction'

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {

  private songBasePath: string = "../../../assets/songs/";
  private songsBeingPlayed: Song[];
  private songPlayed = new Subject<{songs: Song[], action: SongPlayAction}>();

  constructor() { }

  getSongPlayedListener() {
    return this.songPlayed.asObservable();
  }

  play(songs: Song[], action: SongPlayAction) {
    // Add base path to each song
    let fullPathsongs = songs;
    fullPathsongs.forEach( song => song.song_path = this.songBasePath + song.song_path);
    this.songPlayed.next({songs, action});
  }


}