import { Component } from "@angular/core";
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html', 
    styleUrls: ['./header.component.css']
})
export class HeaderComponent{

    loggedIn : boolean = false;
    user: User;
    artistRole: string = "ARTIST";

    constructor(private userService:UserService, private router:Router){};

    ngOnInit() {
        this.userService.getUserPermissionsUpdateListener().subscribe(user => {
            if(user){
                this.loggedIn = true;
                this.user = user;
            }
            else{
                this.loggedIn = false;
            }
        })
        this.userService.getUserPermissions();
    }    

    onLogoutClicked(){
    	this.userService.logout(this.onLogout.bind(this));	
    }

    onLogout(){
    	this.loggedIn = false;
	this.user = null;
	this.router.navigate(['/']);
	// refresh the page
	window.location.reload();
    }
}
