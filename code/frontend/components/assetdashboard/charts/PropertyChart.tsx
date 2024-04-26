import React, { useEffect } from "react";
import * as d3 from "d3";

interface DataPoint {
    timeStamp: number;
    [key: string]: number;
}

interface PropertyChartProps {
    data: DataPoint[];
    unit: string;
}

const LineChart = ({ data, unit }: PropertyChartProps) => {
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

        const xScale = d3.scaleTime()
            .range([0, width])
            .domain(d3.extent(data, d => d.timeStamp) as [number, number]);

        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d => d[unit]) || 0]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        const line = d3.line<DataPoint>()
            .x(d => xScale(d.timeStamp))
            .y(d => yScale(d[unit]));

        g.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .attr("class", "text-black")
            .selectAll("line, path")
            .attr("stroke", "black") 
            .attr("stroke-width", 1); 

        g.append("g")
            .call(yAxis)
            .attr("class", "text-black")
            .selectAll("line, path") 
            .attr("class", "text-black")
            .attr("stroke", "black") 
            .attr("stroke-width", 1); 

    }, [data, unit]);

    return <div id="chart"></div>;
};

export default LineChart;