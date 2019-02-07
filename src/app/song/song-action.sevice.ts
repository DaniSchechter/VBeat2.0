import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song, Genre } from './song.model';
import { NotificationPopupService } from '../notification/notification-popup.service'
import { NotificationStatus, Notification } from '../notification/notification.model'


@Injectable({providedIn: 'root'})
export class SongActionService{

    private song: Song;
    private songLiked = new Subject<{song:Song, newNumOfLikes:number}>();

    constructor(private Http: HttpClient,
                private notificationService:NotificationPopupService){}

    getSongUpdateListener() { return this.songLiked.asObservable(); }

    //likesAction is 1 if liked, -1 if disliked
    updateSongLikeStatus(song: Song, likeAction: number) {
        this.song = song;
        let newNumOfLikes: number = this.song.num_of_times_liked + likeAction;;
        this.song.num_of_times_liked = newNumOfLikes;;
        // ! TODO call API - update num of likes with newNumOfLikes .
        this.songLiked.next( {song, newNumOfLikes} );
    }

}