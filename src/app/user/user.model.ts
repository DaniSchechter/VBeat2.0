export enum UserRole {
    ARTIST = "Artist",
    USER = "User",
}

export class User {
	constructor(
		public id: string,
		public username: string,
		public role: UserRole,
		public password: string, 
		public profile_pic: string,
		public display_name: string,
		public email: string,
		public country: string,
		public city: string,
		public street: string,
		public houseNum: number,
	) {}
}

export class UserConfig {
	constructor(
		public nameLength: number = 3,
		public passwordLength: number = 4,
	) {}
}