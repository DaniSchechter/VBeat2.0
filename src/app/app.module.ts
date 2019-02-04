import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input' 
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SongDetailsComponent } from './song/song-details/song-details.component';
import { SongListComponent } from './song/song-list/song-list.component'
import { HttpClientModule } from '@angular/common/http'

import { SongToolBarComponent } from './song/song-tool-bar/song-tool-bar.component';
import { SongCreateComponent } from './song/song-create/song-create.component';

@NgModule({
  declarations: [
    AppComponent,
    SongDetailsComponent,

    SongListComponent,
    SongToolBarComponent,
    SongCreateComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule, 
    HttpClientModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
