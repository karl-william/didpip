'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

type WordCloudProps = {
  words: string[];
  width?: number;
  height?: number;
};

type WordData = {
  text: string;
  size: number;
  rotate?: number;
  x?: number;
  y?: number;
};

export default function WordCloud({ words, width = 600, height = 400 }: WordCloudProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!svgRef.current || !words.length) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Clear previous wordcloud
    d3.select(svgRef.current).selectAll('*').remove();

    // Process words to count frequencies
    const wordFrequency: Record<string, number> = {};
    words.forEach(word => {
      const trimmed = word.trim().toLowerCase();
      if (trimmed) {
        wordFrequency[trimmed] = (wordFrequency[trimmed] || 0) + 1;
      }
    });

    // Convert to array of objects for d3-cloud
    const wordData: WordData[] = Object.entries(wordFrequency).map(([text, freq]) => ({
      text,
      size: 10 + freq * 10, // Scale size based on frequency
    }));

    // Create layout
    const layout = cloud()
      .size([width, height])
      .words(wordData)
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 0 : 90 * (Math.random() > 0.5 ? 1 : -1)))
      .fontSize(d => d.size!)
      .on('end', draw);

    layout.start();

    function draw(words: WordData[]) {
      const svg = d3.select(svgRef.current);
      
      const g = svg.append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      // Color scale
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      g.selectAll('text')
        .data(words)
        .enter().append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'Impact')
        .style('fill', (_, i) => color(i.toString()))
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text);

      setIsLoading(false);
    }
  }, [words, width, height]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      <svg ref={svgRef} width={width} height={height} className="mx-auto border rounded-box" />
    </div>
  );
}
