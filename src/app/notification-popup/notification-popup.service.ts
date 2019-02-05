import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class NotificationPopupService {

    private message: string = "";
    private messageSubmitted = new Subject<string>();

    constructor(){}

    getMessage(){
        return this.message;
    }

    getMessageSubmittedListener(){
        return this.messageSubmitted.asObservable();
    }

    submitMessage(message:string){    
        this.message = message;
        this.messageSubmitted.next(this.message);
    }

}