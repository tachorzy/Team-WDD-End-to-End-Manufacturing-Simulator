import React, { use, useEffect, useState } from "react";
import * as d3 from "d3";
import { Property } from "@/app/api/_utils/types";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";

export interface PropertyData {
    date: number; // changed from number to Date
    value: number;
}

const LineChart = (props: { property: Property }) => {
    const [data, setData] = useState<PropertyData[]>([]);
    const { property } = props;

    const propertyId = property.propertyId as string;

    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                const config: GetConfig = {
                    resource: "properties/data",
                    params: { propertyId },
                };
                const fetchedData =
                    await BackendConnector.get<PropertyData>(config);
                setData((prevData) => [...prevData, fetchedData]);
            } catch (error) {
                console.error("Failed to fetch property data:", error);
            }
        };

        if (propertyId) {
            fetchPropertyData();
        }
    }, [data, propertyId]);

    useEffect(() => {
        d3.select("#chart").select("svg").remove();

        const chartElement = document.getElementById("chart");
        const width = chartElement ? chartElement.clientWidth : 600;
        const margin = 50;
        const height = 240 - 2 * margin;

        const svg = d3
            .select(`#chart-${property.name}`)
            .append("svg") // changed from selectAll to append
            .attr("width", width + 2 * margin)
            .attr("height", height + 2 * margin);

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin}, ${margin})`);

        const xScale = d3
            .scaleTime()
            .range([0, width])
            .domain(d3.extent(data, (d) => d.date) as [number, number]);

        const yScale = d3
            .scaleLinear()
            .range([height, 0])
            .domain(d3.extent(data, (d) => d.value) as [number, number]);

        const xAxis = d3
            .axisBottom(xScale)
            .tickFormat((d, i) => d3.timeFormat("%I:%M %p")(d as Date));

        const yAxis = d3.axisLeft(yScale);

        const line = d3
            .line<PropertyData>()
            .x((d) => xScale(d.date))
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
            .text(property.name);

        g.append("path")
            .datum(data)
            .attr("d", line)
            .attr("stroke", "#892ae8")
            .attr("stroke-width", 1.5)
            .attr("fill", "none");

        // handle the enter selection
        const svgEnter = svg.enter().append("svg");

        // handle the update selection
        const svgUpdate = svg
            .merge(svgEnter)
            .attr("width", width + 2 * margin)
            .attr("height", height + 2 * margin);

        svgUpdate
            .select(".x-axis")
            .attr("transform", `translate(0, ${height})`);

        svgUpdate.select(".y-axis");

        // handle the exit selection
        svg.exit().remove();
    }, [data]);

    return (
        <div id={`chart-${property.name}`} className="w-11/12 my-3" data-testid="property chart" />
    );
};

export default LineChart;
