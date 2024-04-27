"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";

interface DataPoint {
    timeStamp: number;
    value: number;
}

interface PropertyChartProps {
    data: DataPoint[];
}

const LineChart = ({ data }: PropertyChartProps) => {
    useEffect(() => {
        d3.select("#chart").select("svg").remove();

        const chartElement = document.getElementById("chart");
        const width = chartElement ? chartElement.clientWidth : 600;
        const margin = 50;
        const height = 240 - 2 * margin;
    
        const svg = d3
            .select("#chart")
            .selectAll("svg")
            .data([data]) // bind the data to the SVG element
            .join("svg") // enter + update + exit
            .attr("width", width + 2 * margin)
            .attr("height", height + 2 * margin);
    
        const g = svg
            .append("g")
            .attr("transform", `translate(${margin}, ${margin})`);
    
        const xScale = d3
            .scaleTime()
            .range([0, width])
            .domain(d3.extent(data, (d) => d.timeStamp) as [number, number]);
    
        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain(d3.extent(data, d => d.value) as [number, number]);
    
        const xAxis = d3.axisBottom(xScale)
            .tickFormat((d, i) => d3.timeFormat("%I:%M %p")(d as Date));    
        
        const yAxis = d3.axisLeft(yScale);
    
        const line = d3
            .line<DataPoint>()
            .x((d) => xScale(d.timeStamp))
            .y((d) => yScale(d.value));
    
        g.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .attr("class", "text-[#494949]")
            .selectAll("line")
            .attr("stroke", "#494949")
            .attr("stroke-width", 0.5);
    
        g.append("g")
            .call(yAxis)
            .attr("class", "text-[#494949]")
            .selectAll("line")
            .attr("class", "#494949")
            .attr("stroke", "#494949")
            .attr("stroke-width", 0.5);
    
        g.append("text")
            .attr("class", "text-[#494949] text-xs")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Value");    
    
        g.append("path")
            .datum(data)
            .attr("d", line)
            .attr("stroke", "#892ae8")
            .attr("stroke-width", 1.5)
            .attr("fill", "none");


    const svgEnter = svg.enter().append("svg");
    svgEnter.append("path").attr("class", "line");
    svgEnter.append("g").attr("class", "x-axis");
    svgEnter.append("g").attr("class", "y-axis");    

// handle the update selection
    const svgUpdate = svg.merge(svgEnter)
    .attr("width", width + 2 * margin)
    .attr("height", height + 2 * margin);


    svgUpdate.select(".x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

    svgUpdate.select(".y-axis")
    .call(d3.axisLeft(yScale));

    // handle the exit selection
    svg.exit().remove();
    }, [data]);

    return <div id="chart" className="w-11/12 my-3" />;
};

export default LineChart;