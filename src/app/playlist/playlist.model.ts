export class Playlist {
	constructor(
		public id: string,
		public name: string,
		public user_id: string, 
		public song_list: string[],
		) { }
}