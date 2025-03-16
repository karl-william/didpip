'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type DataPoint = {
  label: string;
  value: number;
};

type SimpleChartProps = {
  data: DataPoint[];
  type?: 'bar' | 'line' | 'pie';
  width?: number;
  height?: number;
};

export default function SimpleChart({ data, type = 'bar', width = 400, height = 300 }: SimpleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create chart based on type
    switch (type) {
      case 'bar':
        createBarChart(svg, data, margin, innerWidth, innerHeight);
        break;
      case 'line':
        createLineChart(svg, data, margin, innerWidth, innerHeight);
        break;
      case 'pie':
        createPieChart(svg, data, width, height);
        break;
      default:
        createBarChart(svg, data, margin, innerWidth, innerHeight);
    }
  }, [data, type, width, height]);

  const createBarChart = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    data: DataPoint[],
    margin: { top: number; right: number; bottom: number; left: number },
    innerWidth: number,
    innerHeight: number
  ) => {
    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Create chart group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) || 0)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', 'steelblue');

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(y));
  };

  const createLineChart = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    data: DataPoint[],
    margin: { top: number; right: number; bottom: number; left: number },
    innerWidth: number,
    innerHeight: number
  ) => {
    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Create chart group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create line generator
    const line = d3.line<DataPoint>()
      .x(d => (x(d.label) || 0) + x.bandwidth() / 2)
      .y(d => y(d.value));

    // Add line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add dots
    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('cy', d => y(d.value))
      .attr('r', 5)
      .attr('fill', 'steelblue');

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(y));
  };

  const createPieChart = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    data: DataPoint[],
    width: number,
    height: number
  ) => {
    const radius = Math.min(width, height) / 2 - 40;
    
    // Create chart group
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create pie layout
    const pie = d3.pie<DataPoint>()
      .value(d => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(0)
      .outerRadius(radius);

    // Create arcs
    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    // Add path
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i.toString()));

    // Add labels
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(d => d.data.label);

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 100}, 20)`)
      .selectAll('.legend')
      .data(data)
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legend.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d, i) => color(i.toString()));

    legend.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .attr('font-size', '12px')
      .text(d => `${d.label}: ${d.value}`);
  };

  return (
    <svg ref={svgRef} width={width} height={height} className="mx-auto" />
  );
}
