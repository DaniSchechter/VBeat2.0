import { Song } from '../song/song.model';

export class Playlist {
	constructor(
		public id: string,
		public name: string,
		public user: string,
		public songList: Song[],
	) { }
}
