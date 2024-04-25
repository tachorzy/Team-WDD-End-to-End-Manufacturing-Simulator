import React from "react";
import * as d3 from 'd3';
import {useState, useEffect} from 'react'
import {scaleLinear, scaleBand, max, format} from 'd3'

const PropertyChart = (props: { data: number[] }) => {

    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)
  
    useEffect(()=>{
      setHeight(window.innerHeight-100)
      setWidth(window.innerWidth-100)
    },[])

    const margin = {top:40, left:300, right:40, bottom:60}
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
  
    const xVal = d => d.Population
    const yVal = d => d.Country
  
    const yScale = scaleBand()
        .domain(data.map(yVal))
        .range([0,innerHeight])
        .padding(0.2)
  
    const xScale = scaleLinear()
        .domain([0, max(data,xVal)])
        .range([0, innerWidth])
    
    
    const xAxisLabelOffset = 40
    const siFormat = format(".2s");
    const tickFormat = (tickFormat: number | { valueOf(): number; }) => siFormat(tickFormat).replace('G','B')

    return (
        <div className="flex flex-col mb-3 gap-y-4 w-full h-64 overflow-y-scroll border-2 border-[#E2E4EA] bg-[#FAFAFA] rounded-lg">

        </div>
    );
};
export default PropertyChart;
