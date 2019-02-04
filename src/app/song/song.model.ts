export enum Genre {
    Blues = 1,
    Country = 2,
    Pop = 3,
    Classic = 4, 
    Electronic = 5
}

export class Song {

    constructor(
        public song_id: number,
        public name: string,
        public genre: Genre,
        public song_path: string,
        public image_path: string,
        public release_data: Date,
        public artists: string[] //TODO: change to artist array
    ) { }

}