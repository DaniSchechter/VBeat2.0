import { Component, OnInit } from '@angular/core';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-genre-stats',
  templateUrl: './genre-stats.component.html',
  styleUrls: ['./genre-stats.component.css']
})
export class GenreStatsComponent implements OnInit {

  constructor(private statService: StatsService) { }

  ngOnInit() {
    this.statService.getGenreData();
  }

  

}
