export enum Genre {
    Blues = 1,
    Country = 2,
    Pop = 3,
    Classic = 4, 
    Electronic = 5
}

export class Song {

    constructor(
        public id: string,
        public name: string,
        public genres: Genre[],
        public song_path: string,
        public image_path: string,
        public release_date: Date,
        public artists: string[], //TODO: change to artist array
        public num_of_times_liked: number //Will be updated through web sockets
    ) { }

}