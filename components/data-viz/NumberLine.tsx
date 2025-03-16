import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

type NumberLineProps = {
  minValue?: number;
  maxValue?: number;
  interval?: number;
  width?: number;
  height?: number;
};

export default function NumberLine({
  minValue = 0,
  maxValue = 100,
  interval = 10,
  width = 800,
  height = 120
}: NumberLineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [highlightEven, setHighlightEven] = useState(false);
  const [highlightOdd, setHighlightOdd] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous number line
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create a group element for the number line
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scale
    const xScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([0, innerWidth]);

    // Create axis
    const xAxis = d3.axisBottom(xScale)
      .tickValues(d3.range(minValue, maxValue + 1, interval));

    // Add axis to the SVG
    g.append('g')
      .attr('transform', `translate(0,${innerHeight / 2})`)
      .call(xAxis)
      .selectAll('text')
      .attr('y', 15)
      .attr('font-size', '12px');

    // Add line
    g.append('line')
      .attr('x1', 0)
      .attr('y1', innerHeight / 2)
      .attr('x2', innerWidth)
      .attr('y2', innerHeight / 2)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 2);

    // Add invisible overlay for click handling across the entire number line
    g.append('rect')
      .attr('x', 0)
      .attr('y', innerHeight / 2 - 20) // Make it extend above and below the line
      .attr('width', innerWidth)
      .attr('height', 40)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('click', (event) => {
        // Get the x position of the click relative to the SVG
        const svgPoint = d3.pointer(event);
        // Convert the x position to a value on the number line
        const clickedValue = Math.round(xScale.invert(svgPoint[0]));
        
        // Only process if the value is within our range
        if (clickedValue >= minValue && clickedValue <= maxValue) {
          const isSelected = selectedNumbers.includes(clickedValue);
          if (isSelected) {
            setSelectedNumbers(selectedNumbers.filter(num => num !== clickedValue));
          } else {
            setSelectedNumbers([...selectedNumbers, clickedValue]);
          }
        }
      });

    // Highlight even numbers if enabled
    if (highlightEven) {
      const evenNumbers = d3.range(minValue, maxValue + 1).filter(n => n % 2 === 0);
      evenNumbers.forEach(num => {
        g.append('circle')
          .attr('cx', xScale(num))
          .attr('cy', innerHeight / 2)
          .attr('r', 5)
          .attr('fill', '#10b981');
      });
    }

    // Highlight odd numbers if enabled
    if (highlightOdd) {
      const oddNumbers = d3.range(minValue, maxValue + 1).filter(n => n % 2 !== 0);
      oddNumbers.forEach(num => {
        g.append('circle')
          .attr('cx', xScale(num))
          .attr('cy', innerHeight / 2)
          .attr('r', 5)
          .attr('fill', '#f59e0b');
      });
    }

    // Process selected numbers
    selectedNumbers.forEach(num => {
      if (num % interval === 0) {
        // For numbers at interval points, highlight them on the line
        g.append('circle')
          .attr('cx', xScale(num))
          .attr('cy', innerHeight / 2)
          .attr('r', 6)
          .attr('fill', '#4338ca');
      } else {
        // For numbers not at interval points, show them below the line
        // Add a small marker at the position
        g.append('line')
          .attr('x1', xScale(num))
          .attr('y1', innerHeight / 2)
          .attr('x2', xScale(num))
          .attr('y2', innerHeight / 2 + 10)
          .attr('stroke', '#4338ca')
          .attr('stroke-width', 1);
          
        // Add the number label below
        g.append('text')
          .attr('x', xScale(num))
          .attr('y', innerHeight / 2 + 25)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('fill', '#4338ca')
          .text(num);
      }
    });

  }, [minValue, maxValue, interval, width, height, selectedNumbers, highlightEven, highlightOdd]);

  const toggleEvenNumbers = () => {
    setHighlightEven(!highlightEven);
    if (!highlightEven) setHighlightOdd(false);
  };

  const toggleOddNumbers = () => {
    setHighlightOdd(!highlightOdd);
    if (!highlightOdd) setHighlightEven(false);
  };

  const clearSelection = () => {
    setSelectedNumbers([]);
    setHighlightEven(false);
    setHighlightOdd(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} width={width} height={height}></svg>
      </div>
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        <button 
          className={`btn btn-sm ${highlightEven ? 'btn-success' : 'btn-outline'}`}
          onClick={toggleEvenNumbers}
        >
          Highlight Even
        </button>
        <button 
          className={`btn btn-sm ${highlightOdd ? 'btn-warning' : 'btn-outline'}`}
          onClick={toggleOddNumbers}
        >
          Highlight Odd
        </button>
        <button 
          className="btn btn-sm btn-outline"
          onClick={clearSelection}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
