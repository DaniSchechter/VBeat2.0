import { Directive, ElementRef, Input, OnInit } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';


@Directive({
    selector: '[donutChart]'
})

export class DonutChart implements OnInit{

    @Input() data: any[];

    private margin = { top: 20, right:20, bottom: 30, left:50};
    private width: number;
    private height: number;
    private radius: number;

    private arc: any;
    private label: any;
    private pie: any;
    private color: any;
    private svg: any;

    constructor(private el: ElementRef){
        this.width = 900- this.margin.left-this.margin.right;
        this.height = 900- this.margin.top-this.margin.bottom;
        this.radius = Math.min(this.width, this.height) /3;

    }

    ngOnInit(){
        this.svgInit();
        this.drawDonut();
    }

    private svgInit(){
        this.color = d3Scale.scaleOrdinal().range(['red', 'blue', 'green', 'yellow', 'pink', 'grey', 'brown']);
        this.arc = d3Shape.arc()
        .outerRadius(this.radius - 10)
        .innerRadius(0)
        this.label = d3Shape.arc()
        .outerRadius( this.radius - 40)
        .innerRadius(this.radius - 40);
        this.pie = d3Shape.pie()
        .sort(null).value((d: any) => d.value);
        this.svg = d3.select(this.el.nativeElement)
        .append('g')
        .attr('transform', 'translate(' + this.width/2 + ',' + this.height/2 + ')');
        this.el.nativeElement.style.height = '900';
        this.el.nativeElement.style.width = '950';
    }

    private drawDonut(){
        let g = this.svg.selectAll('.arc')
            .data(this.pie(this.data))
            .enter().append('g')
            .attr('class', 'arc');
        g.append('path').attr('d', this.arc)
        .style('fill', (d:any) => this.color(d.data.id));
        g.append('text').attr('transform', (d: any) => 'translate(' + this.label.centroid(d) + ')')
        .text((d:any) => (d.data.label));
    }
}