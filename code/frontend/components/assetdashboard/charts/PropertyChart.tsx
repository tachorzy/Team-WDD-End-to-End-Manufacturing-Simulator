import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import {
    Property,
    PropertyData,
    Value,
    DataPoint,
} from "@/app/api/_utils/types";
import { BackendConnector, GetConfig } from "@/app/api/_utils/connector";

const LineChart = (props: { property: Property }) => {
    const [data, setData] = useState<DataPoint[]>([]);
    const { property } = props;
    const propertyId = property.propertyId as string;

    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                const config: GetConfig = {
                    resource: "properties/data",
                    params: { id: propertyId },
                };
                const responseArray =
                    await BackendConnector.get<PropertyData[]>(config);
                if (responseArray.length === 0) {
                    console.error("Response array is empty");
                    return;
                }
                const response = responseArray[0];
                const { values } = response;
                console.log("Values Object:", values);

                if (!values || Object.keys(values).length === 0) {
                    console.error("No data available or values are empty");
                    return;
                }

                const formattedData = Object.keys(values).map(
                    (key: string) => ({
                        date: key, 
                        value: values[key].value,
                    }),
                );
                setData(formattedData);
            } catch (error) {
                console.error("Failed to fetch property data:", error);
            }
        };

        fetchPropertyData();
    }, [propertyId]);

    useEffect(() => {
        if (!data.length) {
            console.log("No data");
            return;
        }
    
        const validData = data.filter(d => d.date && !isNaN(new Date(d.date).valueOf())); 
    
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
    
        d3.select(`#chart-${property.name}`).select("svg").remove();
    
        const svg = d3
            .select(`#chart-${property.name}`)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
        const dateExtent = d3.extent(validData, d => new Date(d.date)) as Date[];
    
        const xScale = d3
            .scaleTime()
            .domain(dateExtent.length ? dateExtent : [new Date(), new Date()]) 
            .range([0, width]);
    
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(validData, d => d.value) || 0])
            .range([height, 0]);
    
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));
    
        svg.append("g").call(d3.axisLeft(yScale));
    
        const line = d3
            .line<DataPoint>()
            .x(d => xScale(new Date(d.date)))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);
    
        svg.append("path")
            .datum(validData)
            .attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2);
    }, [data, property.name]);
    

    return (
        <div
            id={`chart-${property.name}`}
            className="w-11/12 my-3"
            data-testid="property-chart"
        />
    );
};

export default LineChart;
