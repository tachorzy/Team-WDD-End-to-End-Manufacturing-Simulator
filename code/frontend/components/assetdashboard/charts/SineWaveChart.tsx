import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface DataPoint {
    timeStamp: number;
    [key: string]: number;
}

interface PropertyChartProps {
    data: DataPoint[];
    unit: string;
}

const SineWaveChart = ({ data, unit }: PropertyChartProps) => {

    useEffect(() => {
        const margin = 50;
        const width = 600 - 2 * margin;
        const height = 300 - 2 * margin;
      
        const svg = d3.select("#chart")
        .selectAll("svg")
        .data([data]) // bind the data to the SVG element
        .join("svg") // enter + update + exit
        .attr("width", width + 2 * margin)
        .attr("height", height + 2 * margin);
        
        const g = svg.append("g")
          .attr("transform", `translate(${margin}, ${margin})`);
      
        const sine: [number, number][] = d3.range(0, 10).map(k => {
          return [0.5 * k * Math.PI, Math.sin(0.5 * k * Math.PI)];
        });
      
        const xScale = d3.scaleLinear()
          .range([0, width])
          .domain(d3.extent(sine, d => d[0]) as [number, number]);
      
        const yScale = d3.scaleLinear()
          .range([height, 0])
          .domain([-1, 1]);
      
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
      
        const line = d3.line<[number, number]>()
          .x(d => xScale(d[0]))
          .y(d => yScale(d[1]));
      
        g.append("path")
          .datum(sine)
          .attr("d", line)
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("fill", "none");
      
        g.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);
      
        g.append("g")
          .call(yAxis);
      }, []);
      
      return <div id="chart"></div>;
};

export default SineWaveChart;
