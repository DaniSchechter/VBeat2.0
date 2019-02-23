import { Component } from "@angular/core";
import { NgForm } from '@angular/forms';
import { UserService } from '../user/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html', 
    styleUrls: ['./header.component.css']
})
export class HeaderComponent{

    loggedIn : boolean = false;

    constructor(private userService:UserService){};

    ngOnInit() {
        this.userService.getUserPermissionsUpdateListener().subscribe(user => {
            if(user){
                this.loggedIn = true;
            }
            else{
                this.loggedIn = false;
            }
        })
        this.userService.getUserPermissions();
    }    
}