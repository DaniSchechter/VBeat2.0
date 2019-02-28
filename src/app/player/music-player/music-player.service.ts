import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Song }  from '../../song/song.model';
import { SongPlayAction } from '../music-player/songPlayAction'

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {

  private songsBeingPlayed: Song[];
  private songPlayed = new Subject<{songs: Song[], action: SongPlayAction}>();

  constructor() { }

  getSongPlayedListener() {
    return this.songPlayed.asObservable();
  }

  play(songs: Song[], action: SongPlayAction) {
    this.songPlayed.next({songs, action});
  }


}