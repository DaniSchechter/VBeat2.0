// Built in Modules and components
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input' 
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material';
import { MatPaginatorModule } from "@angular/material";
import { MatToolbarModule } from '@angular/material/toolbar';

// Custom Modules and components
import { AppRoutingModule } from './app-routing.module';

import { SongEditComponent } from './song/song-edit/song-edit.component';
import { SongDetailsComponent } from './song/song-details/song-details.component';
import { SongListComponent } from './song/song-list/song-list.component';
import { SongToolBarComponent } from './song/song-tool-bar/song-tool-bar.component';
import { SongCreateComponent } from './song/song-create/song-create.component';

import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserSignupComponent } from './user/user-signup/user-signup.component';

// interceptor related imports
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieInterceptor } from './cookie-interceptor';
// end of interceptors 
import { NotificationPopupComponent } from './notification/notification-popup/notification-popup.component';
import { HeaderComponent } from './header/header.component';

import { PlaylistCreateComponent } from './playlist/playlist-create/playlist-create.component';
import { PlaylistEditComponent } from './playlist/playlist-edit/playlist-edit.component';
import { PlaylistListComponent } from './playlist/playlist-list/playlist-list.component';
import { PlaylistDetailsComponent } from './playlist/playlist-details/playlist-details.component';

@NgModule({
  declarations: [
    AppComponent,
    SongDetailsComponent,
    SongListComponent,
    SongToolBarComponent,
    SongCreateComponent,
    HeaderComponent,
    NotificationPopupComponent,
    SongEditComponent,
    UserLoginComponent,
    UserSignupComponent,
    PlaylistCreateComponent,
    PlaylistEditComponent,
    PlaylistListComponent,
    PlaylistDetailsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MatToolbarModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule, 
    HttpClientModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatSnackBarModule,
  ],
  providers: [
  	{
		// include cookies in all of the requests
		provide: HTTP_INTERCEPTORS,
		useClass: CookieInterceptor,
		multi: true
	}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
