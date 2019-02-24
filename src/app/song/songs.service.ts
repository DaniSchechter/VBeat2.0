import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Song, Genre } from "./song.model";
import { NotificationPopupService } from "../notification/notification-popup.service";
import {
  NotificationStatus,
  Notification
} from "../notification/notification.model";
import { Router } from "@angular/router";
import { User } from "../user/user.model";
@Injectable({ providedIn: "root" })
export class SongService {
  private base_url = "http://localhost:3000/api";

  private songs: Song[] = [];
  private song: Song;
  private songsCount = 0;
  private songsUpdated = new Subject<{ songs: Song[]; totalSongs: number }>();
  private songUpdated = new Subject<Song>();

  private searchSongUpdated = new Subject<{
    songs: Song[];
    totalSongs: number;
  }>();
  private searchSongs: Song[] = [];
  private searchSongsCount = 0;


  constructor(
    private Http: HttpClient,
    private notificationService: NotificationPopupService,
    private router: Router
  ) {}

  getSongsUpdateListener() {
    return this.songsUpdated.asObservable();
  }

  getSearchSongUpdateListener() {
    return this.searchSongUpdated.asObservable();
  }

  getSongs(songsPerPage = 10, currentPage = 1) {
    const queryParams = `?pageSize=${songsPerPage}&page=${currentPage}`;
    this.Http.get<{ message: string; songs: any; totalSongs: number }>(
      this.base_url + "/song" + queryParams
    )
      .pipe(
        map(songData => {
          return {
            songs: songData.songs.map(song => {
              return {
                name: song.name,
                genre: song.genre,
                song_path: song.song_path,
                image_path: song.image_path,
                release_date: song.release_date,
                artists: song.artists,
                num_of_times_liked: song.num_of_times_liked,
                id: song._id
              };
            }),
            totalSongs: songData.totalSongs
          };
        })
      )
      .subscribe(
        songsAfterChange => {
          this.songsCount = songsAfterChange.totalSongs;
          this.songs = songsAfterChange.songs;
          this.songsUpdated.next({
            songs: [...this.songs],
            totalSongs: songsAfterChange.totalSongs
          });
        },
        error =>
          this.notificationService.submitNotification(
            new Notification(error.message, NotificationStatus.ERROR)
          )
      );
  }

  getSongUpdateListener() {
    return this.songUpdated.asObservable();
  }

  addSong(
    name: string,
    genre: Genre,
    song_path: string,
    image_path: string,
    release_date: Date,
    artists: User[],
    num_of_times_liked: number
  ) {
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

    this.Http.post<{ message: string; songId: string }>(
      this.base_url + "/song",
      song
    ).subscribe(
      responseData => {
        this.notificationService.submitNotification(
          new Notification(responseData.message, NotificationStatus.OK)
        );
        this.router.navigate(["/"]);
      },
      error =>
        this.notificationService.submitNotification(
          new Notification(error.message, NotificationStatus.ERROR)
        )
    );
  }

  deleteSong(songId: string) {
    return this.Http.delete<{ message: string }>(
      this.base_url + "/song/" + songId
    ).subscribe(
      responseData => {
        const updatedSongs = this.songs.filter(song => song.id !== songId);
        this.songs = updatedSongs;
        this.songsCount--;
        this.songsUpdated.next({
          songs: [...this.songs],
          totalSongs: this.songsCount
        });
        this.notificationService.submitNotification(
          new Notification(responseData.message, NotificationStatus.OK)
        );
      },
      error =>
        this.notificationService.submitNotification(
          new Notification(error.message, NotificationStatus.ERROR)
        )
    );
  }

  updateSong(
    id: string,
    name: string,
    genre: Genre,
    song_path: string,
    image_path: string,
    release_date: Date,
    artists: User[],
    num_of_times_liked: number
  ) {
    const song: Song = {
      id: id,
      name: name,
      genre: genre,
      song_path: song_path,
      image_path: image_path,
      release_date: release_date,
      artists: artists,
      num_of_times_liked: num_of_times_liked
    };
    this.Http.put<{ message: string }>(
      this.base_url + "/song/" + id,
      song
    ).subscribe(
      res => {
        this.notificationService.submitNotification(
          new Notification(res.message, NotificationStatus.OK)
        );
        this.router.navigate(["/"]);
      },
      error =>
        this.notificationService.submitNotification(
          new Notification(error.message, NotificationStatus.ERROR)
        )
    );
  }

  searchSong(songName, artistName, genreName, songsPerPage, currentPage) {
    const queryParams = `?pageSize=${songsPerPage}&page=${currentPage}&songName=${songName}&artistName=${artistName}&genreName=${genreName}`;

    this.Http.get<{ message: string; songs: any; totalSongs: number }>(
      this.base_url + "/song/search" + queryParams
    )
      .pipe(
        map(songData => {
          return {
            songs: songData.songs.map(song => {
              return {
                name: song.name,
                genre: song.genre,
                song_path: song.song_path,
                image_path: song.image_path,
                release_date: song.release_date,
                artists: song.artists,
                num_of_times_liked: song.num_of_times_liked,
                id: song._id
              };
            }),
            totalSongs: songData.totalSongs
          };
        })
      )
      .subscribe(
        songsAfterChange => {
          this.searchSongsCount = songsAfterChange.totalSongs;
          this.searchSongs = songsAfterChange.songs;
          this.songsUpdated.next({
            songs: [...this.searchSongs],
            totalSongs: this.searchSongsCount
          });
        },
        error =>
          this.notificationService.submitNotification(
            new Notification(error.message, NotificationStatus.ERROR)
          )
      );
  }
}
