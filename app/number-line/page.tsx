'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import NumberLine from '@/components/data-viz/NumberLine';

export default function NumberLinePage() {
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [interval, setInterval] = useState(10);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Interactive Number Line</h1>
        <p className="mb-6">
          Explore number patterns and relationships with this interactive number line.
          Adjust the range and interval, click on numbers to highlight them, or use the controls to highlight even or odd numbers.
        </p>
        
        <div className="bg-base-100 shadow-xl rounded-box p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="label">
                <span className="label-text">Minimum Value</span>
              </label>
              <input 
                type="number" 
                className="input input-bordered w-full" 
                value={minValue}
                onChange={(e) => setMinValue(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Maximum Value</span>
              </label>
              <input 
                type="number" 
                className="input input-bordered w-full" 
                value={maxValue}
                onChange={(e) => setMaxValue(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Interval</span>
              </label>
              <input 
                type="number" 
                className="input input-bordered w-full" 
                value={interval}
                min="1"
                onChange={(e) => setInterval(Number(e.target.value))}
              />
            </div>
          </div>
          
          <NumberLine 
            minValue={minValue} 
            maxValue={maxValue} 
            interval={interval} 
            width={800}
            height={120}
          />
        </div>
        
        <div className="bg-base-100 shadow-xl rounded-box p-6">
          <h2 className="text-xl font-bold mb-4">How to Use</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Adjust the minimum and maximum values to change the range of the number line.</li>
            <li>Change the interval to control the spacing of major tick marks.</li>
            <li>Click on individual numbers to highlight them.</li>
            <li>Use the buttons below the number line to highlight even or odd numbers.</li>
            <li>Click "Clear All" to reset all highlights.</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
