import { User } from '../user/user.model'

export enum Genre {
    BLUES = "Blues",
    COUNTRY = "Countrey",
    POP = "Pop",
    CLASSIC = "Classic", 
    ELECTRONIC = "Electronic",
    ROCK = "Rock",
    JAZZ = "Jazz",
    HIPHOP = "Hip-Hop"
}

export class Song {

    constructor(
        public id: string,
        public name: string,
        public genre: Genre,
        public song_path: string,
        public image_path: string,
        public release_date: Date,
        public artists: User[],
        public num_of_times_liked: number,
    ) { }

}