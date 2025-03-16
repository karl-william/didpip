'use client';

import { useState, useEffect } from 'react';

// Define types for our component
type TimesTable = {
  number: number;
  isActive: boolean;
  color: string;
};

export default function HundredsSquare() {
  // State for selected individual numbers
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  
  // State for times tables
  const [timesTables, setTimesTables] = useState<TimesTable[]>([
    { number: 1, isActive: false, color: 'rgb(128, 128, 128)' },
    { number: 2, isActive: false, color: 'rgb(255, 99, 132)' },
    { number: 3, isActive: false, color: 'rgb(54, 162, 235)' },
    { number: 4, isActive: false, color: 'rgb(255, 206, 86)' },
    { number: 5, isActive: false, color: 'rgb(75, 192, 192)' },
    { number: 6, isActive: false, color: 'rgb(153, 102, 255)' },
    { number: 7, isActive: false, color: 'rgb(255, 159, 64)' },
    { number: 8, isActive: false, color: 'rgb(199, 199, 199)' },
    { number: 9, isActive: false, color: 'rgb(83, 102, 255)' },
    { number: 10, isActive: false, color: 'rgb(255, 102, 102)' },
    { number: 11, isActive: false, color: 'rgb(102, 255, 178)' },
    { number: 12, isActive: false, color: 'rgb(178, 102, 255)' },
  ]);

  // Toggle individual number selection
  const toggleNumber = (num: number) => {
    setSelectedNumbers(prev => 
      prev.includes(num) 
        ? prev.filter(n => n !== num) 
        : [...prev, num]
    );
  };

  // Toggle times table
  const toggleTimesTable = (tableNumber: number) => {
    setTimesTables(prev => 
      prev.map(table => 
        table.number === tableNumber 
          ? { ...table, isActive: !table.isActive } 
          : table
      )
    );
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedNumbers([]);
    setTimesTables(prev => 
      prev.map(table => ({ ...table, isActive: false }))
    );
  };

  // Clear only manually selected numbers
  const clearSelectedNumbers = () => {
    setSelectedNumbers([]);
  };

  // Check if a number is in any active times table
  const getNumberStyle = (num: number) => {
    // If manually selected, use a specific style (highest priority)
    if (selectedNumbers.includes(num)) {
      return { backgroundColor: '#6419E6', color: 'white' };
    }
    
    // Get all active times tables that this number belongs to
    const matchingTables = timesTables
      .filter(table => table.isActive && num % table.number === 0)
      // Sort by table number in descending order (larger tables first)
      .sort((a, b) => b.number - a.number);
    
    // If there are matching tables, use the style of the largest one
    if (matchingTables.length > 0) {
      return { backgroundColor: matchingTables[0].color, color: 'white' };
    }
    
    // Default style
    return {};
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Hundreds Square Grid */}
      <div className="w-full lg:w-2/3">
        <div className="grid grid-cols-10 gap-0.5 bg-base-200 p-2 rounded-box max-w-md mx-auto">
          {Array.from({ length: 100 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              className="btn btn-xs aspect-square p-0 h-auto min-h-0 flex items-center justify-center text-xs"
              style={getNumberStyle(num)}
              onClick={() => toggleNumber(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      
      {/* Controls */}
      <div className="w-full lg:w-1/3">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Times Tables</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {timesTables.map(table => (
                <button
                  key={table.number}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: table.isActive ? table.color : '',
                    color: table.isActive ? 'white' : ''
                  }}
                  onClick={() => toggleTimesTable(table.number)}
                >
                  {table.number}x
                </button>
              ))}
            </div>
            
            <div className="divider"></div>
            
            <h2 className="card-title">Legend</h2>
            <div className="space-y-2">
              {timesTables.filter(t => t.isActive).map(table => (
                <div key={table.number} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: table.color }}
                  ></div>
                  <span>{table.number}x table</span>
                </div>
              ))}
              {selectedNumbers.length > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: '#6419E6' }}
                    ></div>
                    <span>Manually selected: {selectedNumbers.sort((a, b) => a - b).join(', ')}</span>
                  </div>
                  <button 
                    className="btn btn-xs btn-outline mt-1 self-end"
                    onClick={clearSelectedNumbers}
                  >
                    Clear Selected
                  </button>
                </div>
              )}
            </div>
            
            <div className="card-actions justify-end mt-4">
              <button 
                className="btn btn-outline btn-error"
                onClick={clearAll}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
