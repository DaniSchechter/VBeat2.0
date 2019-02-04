import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from './song.model';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({providedIn: 'root'})
export class SongService{
    private songs: Song[] = [];
    private songsUpdated = new Subject<Song[]>();

    constructor(private Http: HttpClient){}

    getSongs(){
        this.Http.get<{message: string, songs: Song[]}>('http://localhost:3000/api/getSong')
        .subscribe((SongData)=>{
            this.songs = SongData.songs;
            this.songsUpdated.next([...this.songs]);
        });
    }

    getSongsUpdateListener(){
        return this.songsUpdated.asObservable();
    }

    addSong(name: string, genres: [number], song_path: string, image_path: string, release_data: Date,
        artists: [string], //TODO: change to artist array
        num_of_time_liked: number){
        const song: Song = {id: null, name: name, genres: genres, song_path: song_path, image_path: image_path, release_data: release_data,
            artists: artists, num_of_time_liked: num_of_time_liked};
        this.Http.post<{message: string}>('http://localhost:3000/api/addSong', song)
        .subscribe((responseData)=>{
            console.log(responseData.message);
            this.songs.push(song);
            this.songsUpdated.next([...this.songs]);
        });
    }

    

}