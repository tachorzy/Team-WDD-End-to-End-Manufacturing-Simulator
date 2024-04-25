import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  timeStamp: number;
  [key: string]: number;
}

interface PropertyChartProps {
  data: DataPoint[];
  unit: string;
}

const PropertyChart = ({ data, unit }: PropertyChartProps) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current)
      .attr('width', 500)
      .attr('height', 500);

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.timeStamp)) as [Date, Date])
      .range([0, 500]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[unit]) || 0])
      .range([500, 0]);

    const line = d3.line<DataPoint>()
      .x(d => xScale(new Date(d.timeStamp)))
      .y(d => yScale(d[unit]));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  }, [data, unit]);

  return <svg ref={ref} />;
};

export default PropertyChart;