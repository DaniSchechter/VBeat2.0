import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from './song.model';
import { Genre } from './song.model'

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

    addSong(name: string, genre: Genre, song_path: string, image_path: string, release_date: Date,
        artists: string[], //TODO: change to artist array
        num_of_times_liked: number){
            const song: Song = {
                id: null, 
                name: name, 
                genre: genre, 
                song_path: song_path, 
                image_path: image_path, 
                release_date: release_date,
                artists: artists, 
                num_of_times_liked: num_of_times_liked
            };
        this.Http.post<{message: string}>('http://localhost:3000/api/addSong', song)
        .subscribe((responseData)=>{
            console.log(responseData.message); 
            this.songs.push(song);
            this.songsUpdated.next([...this.songs]);
        });
    }

    

}