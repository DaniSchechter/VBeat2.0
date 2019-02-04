export enum Genre {
    BLUES = "Blues",
    COUNTRY = "Countrey",
    POP = "Pop",
    CLASSIC = "Classic", 
    ELECTRONIC = "Electronic"
}

export class Song {

    constructor(
        public id: number,
        public name: string,
        public genre: Genre,
        public song_path: string,
        public image_path: string,
        public release_date: Date,
        public artists: string[], //TODO: change to artist array
        public num_of_times_liked: number //Will be updated through web sockets
    ) { }

}