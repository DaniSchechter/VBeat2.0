import { Component, OnInit } from '@angular/core';
import { StatsService } from '../stats.service';
import * as d3 from 'd3';
@Component({
  selector: 'bar-chart',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  public data =[];

  public colors = ['red', 'blue', 'green', 'yellow', 'pink', 'grey', 'brown', ]

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.statsService.getMapReduce().then((results: any[]) => {
      if(results){
        var id = 0;
        results.forEach(result => {
          this.data.push({id: id, label:result._id, value:result.value, color: this.colors[id]});
          id++;
        });
      }
    }).catch(err => {
      alert(err);
    });
  }
   

}
