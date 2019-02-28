import { Subject } from 'rxjs';
import { map }  from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Playlist } from './playlist.model';
import { NotificationPopupService } from '../notification/notification-popup.service'
import { NotificationStatus, Notification } from '../notification/notification.model'
import { Router } from '@angular/router';
import { Song } from "../song/song.model";
import { UserService } from '../user/user.service';

@Injectable({providedIn: 'root'})
export class PlaylistService{
    private base_url = 'http://localhost:3000/api';

    private playlists: Playlist[] = [];
    private playlist: Playlist;

    // Liked Songs Playlist
    private favoritePlaylist: Playlist;
    private favoritePlaylistUpdated = new Subject<Playlist>();

    private playlistsCount = 0;
    private playlistsUpdated = new Subject<{playlists: Playlist[], totalPlaylists: number}>();
    private playlistUpdated = new Subject<Playlist>();

    constructor(private Http: HttpClient,
                private userService: UserService,
                private notificationService:NotificationPopupService, private router:Router){
    }

    getPlaylistsUpdateListener(){
        return this.playlistsUpdated.asObservable();
    }
    
    // get all playlists
    getPlaylists(playlistsPerPage = 10, currentPage = 1){
        const queryParams = `?pageSize=${playlistsPerPage}&page=${currentPage}`;
        this.Http.get<{message: string; playlists: any, totalPlaylists: number}>(this.base_url + '/playlist' + queryParams)
        .pipe(
            map(playlistData => {
            return {playlists: playlistData.playlists.map(playlist => {
                return {
                    name: playlist.name, 
                    user: playlist.user, 
                    songList: playlist.songList,
                    id: playlist._id
                };
            }), totalPlaylists: playlistData.totalPlaylists};
        }))
        .subscribe(
            (playlistsAfterChange) => {
                this.playlistsCount = playlistsAfterChange.totalPlaylists;
                this.playlists = playlistsAfterChange.playlists;
                this.playlistsUpdated.next({
                    playlists: [...this.playlists], 
                    totalPlaylists: playlistsAfterChange.totalPlaylists
                });
            },
            error => this.notificationService.submitNotification(new Notification(error.message,NotificationStatus.ERROR))
        );
    }

    getFavPlaylistUpdateListener(){
        return this.favoritePlaylistUpdated.asObservable();
    }

    getFavPlaylist(){
        if(!this.userService.isLoggedIn){
            return;
        }
        // get the favorite playlist id if there is one
        this.Http.get<{message: string; playlist: any}>(this.base_url + '/playlist/' + "LIKED SONGS")
        .pipe(
            map(playlistData => {
                if(playlistData.playlist){
                    let songs = playlistData.playlist.songList.map( song => {
                        return {
                            id: song._id,
                            name: song.name,
                            genre: song.genre,
                            song_path: song.song_path,
                            image_path: song.image_path,
                            release_date: song.release_date,
                            artists: song.artists,
                            num_of_times_liked: song.num_of_times_liked
                        }
                    })
                    return {
                        name: playlistData.playlist.name, 
                        user: playlistData.playlist.user, 
                        songList: songs,
                        id: playlistData.playlist._id
                    };
                }
            }
        ))
        .subscribe(
            playlistsAfterChange => {
                this.favoritePlaylist = playlistsAfterChange;
                this.favoritePlaylistUpdated.next(this.favoritePlaylist);
            },
            error => this.notificationService.submitNotification(new Notification(error.message,NotificationStatus.ERROR))
        );
    }

    // get playlist by id
    getPlaylistById(playlistId: string){
        this.Http.get<{message: string; playlist: any}>(`${this.base_url}/playlist/getById/${playlistId}`)
        .pipe(
            map(playlistData => {
                if(playlistData.playlist){
                    let songs = playlistData.playlist.songList.map( song => {
                        return {
                            id: song._id,
                            name: song.name,
                            genre: song.genre,
                            song_path: song.song_path,
                            image_path: song.image_path,
                            release_date: song.release_date,
                            artists: song.artists,
                            num_of_times_liked: song.num_of_times_liked
                        }
                    })
                    return {
                        name: playlistData.playlist.name, 
                        user: playlistData.playlist.user, 
                        songList: songs,
                        id: playlistData.playlist._id
                    };
                }
            }
        ))
        .subscribe(
            playlistsAfterChange => {
                this.playlist = playlistsAfterChange;
                this.playlistUpdated.next(this.playlist);
            },
            error => this.notificationService.submitNotification(
                new Notification(error.message,NotificationStatus.ERROR))
        );
    }

    getPlaylistUpdateListener(){
        return this.playlistUpdated.asObservable();
    }

    // add new playlist 
    addPlaylist(name: string, songList: Song[]){
            const playlist: Playlist = {
                id: null, 
                name: name, 
                user: null,
                songList: songList
            };
        this.Http.post<{message: string, playlistId: string}>(`${this.base_url}/playlist`, playlist)
        .subscribe(
            responseData => {
                    this.notificationService.submitNotification(
                        new Notification(responseData.message,NotificationStatus.OK))
                    this.router.navigate(["/"])
            },
            error => this.notificationService.submitNotification(new Notification(error.message,NotificationStatus.ERROR))

        );
    }

    // delete playlist
    deletePlaylist(playlistId: string){
        return this.Http.delete<{message: string}>(this.base_url + '/playlist/' + playlistId)
        .subscribe(
            (responseData) => {
                const updatedPlaylists = this.playlists.filter(playlist => playlist.id !== playlistId);
                this.playlists = updatedPlaylists;
                this.playlistsCount--;
                this.playlistsUpdated.next({playlists: [...this.playlists], totalPlaylists: this.playlistsCount});
                this.notificationService.submitNotification(
                    new Notification(responseData.message,NotificationStatus.OK)
                )
            },
            error => this.notificationService.submitNotification(new Notification(error.message,NotificationStatus.ERROR))
        );
    }

    // add the specific song to the favorite song playlist
    addSongToFavoritePlaylist(song: Song){
        // If there is a favorite playlist
        if (this.favoritePlaylist){
            this.favoritePlaylist.songList.push(song)
            this.updatePlaylist(this.favoritePlaylist.id, this.favoritePlaylist.name, this.favoritePlaylist.songList, true);
        }
        // Need to create a new favorite playlist
        else{
            const playlist: Playlist = {
                id: null, 
                name: "LIKED SONGS",
                user: null, 
                songList: [song]
            };
            this.Http.post<{message: string, playlistId: string}>(this.base_url + '/playlist', playlist)
            .subscribe(
                    responseData => {
                        this.favoritePlaylist = {
                            id : responseData.playlistId,
                            songList : [song],
                            name : "LIKED SONGS",
                            user: null,
                        };
                        this.favoritePlaylist.id = responseData.playlistId;
                        this.favoritePlaylist.songList = [song];
                        this.favoritePlaylist.name = "LIKED SONGS";
                        this.notificationService.submitNotification(
                            new Notification("Added to liked songs playlist",NotificationStatus.OK)
                        )
                },
                error => this.notificationService.submitNotification(new Notification(error.message,NotificationStatus.ERROR))
            );
        }
    }

    // remove the song from the favorite song playlist
    removeSongFromFavoritePlaylist(songToRemove: Song){
        this.favoritePlaylist.songList = this.favoritePlaylist.songList.filter(song => song.id != songToRemove.id);
        this.updatePlaylist(this.favoritePlaylist.id, this.favoritePlaylist.name, this.favoritePlaylist.songList);
    }

    // update playlist
    updatePlaylist(id: string, name: string, songList: Song[], isLikedPlaylist=false){
        const playlist: Playlist = {
            id: id, 
            name: name, 
            user: null,
            songList: songList
        };
        this.Http.put<{message: string}>(this.base_url + '/playlist/' + id, playlist).subscribe(
            res => {
                if (isLikedPlaylist){
                    this.notificationService.submitNotification(
                        new Notification("Added to liked songs playlist",NotificationStatus.OK)
                    );
                }
                else{
                    this.notificationService.submitNotification(
                        new Notification(res.message,NotificationStatus.OK)
                    )
                }
            }, 
            error => {
                this.notificationService.submitNotification(
                    new Notification(error.message,NotificationStatus.ERROR));
            }
        );
    }

    addSongToPlaylists(playlists: Playlist[], songToAdd: Song){
        this.Http.put<{message: string}>(`${this.base_url}/playlist/updateAll`, {playlists: playlists, song: songToAdd}).subscribe(
            res => {
                this.notificationService.submitNotification(
                    new Notification(res.message,NotificationStatus.OK)
                )
            }, 
            error => {
                this.notificationService.submitNotification(
                    new Notification(error.message,NotificationStatus.ERROR));
            }
        );
    }

    IsSongInPlaylist(playlist:Playlist, song:Song): boolean {
        return playlist.songList.some( songInPlaylist => songInPlaylist.id == song.id )
    }

    deleteSongFromPlaylist(playlist: Playlist, songId: string){
        let isFavorite: boolean = playlist.name == "LIKED SONGS";
        let songlist = playlist.songList.filter (song => song.id !== songId);
        this.updatePlaylist(playlist.id, playlist.name, songlist, isFavorite);
        this.router.navigate(["/"]);
    }
]
}