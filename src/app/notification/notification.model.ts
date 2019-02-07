export enum NotificationStatus {
    OK = "OK",
    ERROR = "ERROR"
}

export class Notification {
    constructor(public message:string, public status:NotificationStatus){};
}