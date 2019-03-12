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
    // needs to do a deep copy
    fullPathsongs = fullPathsongs.map( song => new Song(
      song.id,
      song.name,
      song.genre,
      this.songBasePath + song.song_path,
      song.image_path,
      song.release_date,
      song.artists,
      song.num_of_times_liked
    ));
    this.songPlayed.next({songs: fullPathsongs, action: action});
  }


}