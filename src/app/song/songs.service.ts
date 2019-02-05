import { Subject } from 'rxjs';
import { map }  from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from './song.model';
import { Genre } from './song.model'
import { NotificationPopupService } from '../notification-popup/notification-popup.service'

@Injectable({providedIn: 'root'})
export class SongService{

    private songs: Song[] = [];
    private songsUpdated = new Subject<Song[]>();

    constructor(private Http: HttpClient,
                private notificationService:NotificationPopupService){}

    getSongs(){
        this.Http.get<{message: string; songs: any}>('http://localhost:3000/api/getSongs')
        .pipe(map((songData) => {
            return songData.songs.map(song => {
                return {
                    name: song.name, 
                    genre: song.genre, 
                    song_path: song.song_path, 
                    image_path: song.image_path, 
                    release_date: song.release_date,
                    artists: song.artists, //TODO: change to artist array
                    num_of_times_liked: song.num_of_times_liked, 
                    id: song._id
                };
            });
        }))
        .subscribe(songsAfterChange => {
            this.songs = songsAfterChange;
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
        this.Http.post<{message: string, songId: string}>('http://localhost:3000/api/createSong', song)
        .subscribe((responseData)=>{
            const id = responseData.songId;
            song.id = id;
            this.songs.push(song);
            this.songsUpdated.next([...this.songs]);
            this.notificationService.submitMessage("Song was added successfully");
        });
    }

    deleteSong(songId: string){
        this.Http.delete('http://localhost:3000/api/songs/' + songId)
        .subscribe(() => {
            const updatedSongs = this.songs.filter(song => songId !== songId);
            this.songs = updatedSongs;
            this.songsUpdated.next([...this.songs]);
            this.notificationService.submitMessage("Song was deleted successfully");
        });
    }
    

}