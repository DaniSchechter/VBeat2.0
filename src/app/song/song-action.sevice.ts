import * as io  from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Song } from './song.model';

@Injectable({providedIn: 'root'})
export class SongActionService{

    private song: Song;
    private socket;

    // Singelton pattern
    private static instance: SongActionService; 
    // Global changes through web sockets
    private songUpdatedSubject: Subject<Song>;
    // Local changes for changing like button color
    private localSongUpdated = new Subject<Song>();


    // Force only one Socket per client
    private constructor() {
        this.socket = io("http://localhost:3000/");
        this.songUpdatedSubject = this.createSongUpdatedSubject();
    }

    static getInstance(): SongActionService {
        if(!SongActionService.instance) {
            SongActionService.instance = new SongActionService();
        }
        return SongActionService.instance;
    }

    // Create subject to enable listening to like chane through web sockets
    private createSongUpdatedSubject(): Subject<Song> {
        // We define our observable which will observe any incoming messages
        // from our socket.io server.
        let observable = new Observable(observer => {
            this.socket.on('songLikeAction', (song:Song) => {
                observer.next(song);
            });
            return () => {
                this.socket.disconnect();
            }
        });

        // We define our Observer which will listen to messages
        // from our other components and send messages back to our
        // socket server whenever the `next()` method is called.
        let observer = {
            next: (song: Song) => {
                this.socket.emit('songLikeAction', song);
            },
        };

        // we return our Subject which is a combination
        // of both an observer and observable.
        return Subject.create(observer, observable);
    }

    // Return subject to enable listening to like chane through web sockets
    getSongUpdatedSubject(): Subject<Song> {
        return this.songUpdatedSubject;
    }

    getLocalSongUpdateListener() { 
        return this.localSongUpdated.asObservable(); 
    }

    like(song: Song) {
        this.song = song;
        this.song.num_of_times_liked ++;
        // ! TODO call API - update num of likes with newNumOfLikes .
        // Inform for global change
        this.songUpdatedSubject.next(this.song);
        // Inform for local change
        this.localSongUpdated.next(song);
    }

    unlike(song: Song) {
        this.song = song;
        this.song.num_of_times_liked --;
        // ! TODO call API - update num of likes with newNumOfLikes .
        // Inform for global change
        this.songUpdatedSubject.next(this.song);
        // Inform for local change
        this.localSongUpdated.next(song);
    }
}