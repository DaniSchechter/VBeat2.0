import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationPopupService } from 'src/app/notification/notification-popup.service';
import { NotificationStatus, Notification } from '../../notification/notification.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  currentUser: User;
  private userSub: Subscription;
  lat:number;
  lng:number;

  constructor(private userService: UserService, private Http: HttpClient, private notificationService: NotificationPopupService) { }

  ngOnInit() {
    this.userSub = this.userService.getUserDetailsUpdateListener().subscribe((user: User) => {
      this.currentUser = user;
      this.findLocation(this.currentUser.houseNum, this.currentUser.street, this.currentUser.city, this.currentUser.country);
    });
    this.userService.getCurrentUser();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }


  findLocation(houseNumber:Number, streetName: string, cityName: string, countryName: string){
    let address: string;
    if(houseNumber) address = address + houseNumber.toString();
    if(streetName) address = address + ',' + streetName;
    if(cityName) address = address + ',' + cityName;
    if(countryName) address = address + ',' + countryName;

    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyD_SmdSZQy58OQhbGxJN9fi_SbTT2sBVf4';
    this.Http.get<{results:any}>(url).subscribe(
        (json) => {

        try {
          console.log(json);
          this.lat = json.results[0].geometry.location.lat;
          this.lng = json.results[0].geometry.location.lng;
        }
        catch (e){
          this.notificationService.submitNotification(new Notification('Can not find user location', NotificationStatus.ERROR));
        }


        }
      );
  }
}
