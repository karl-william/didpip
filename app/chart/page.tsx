'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SimpleChart from '@/components/data-viz/SimpleChart';

type ChartType = 'bar' | 'line' | 'pie';
type DataPoint = { label: string; value: number };

export default function ChartPage() {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: 15 },
    { label: 'D', value: 25 },
    { label: 'E', value: 18 }
  ]);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  
  // Add states for editing
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editValue, setEditValue] = useState('');

  const addDataPoint = () => {
    if (newLabel.trim() && newValue.trim()) {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        setDataPoints([...dataPoints, { label: newLabel, value: numValue }]);
        setNewLabel('');
        setNewValue('');
      }
    }
  };

  const removeDataPoint = (index: number) => {
    const newData = [...dataPoints];
    newData.splice(index, 1);
    setDataPoints(newData);
  };
  
  // Start editing a data point
  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditLabel(dataPoints[index].label);
    setEditValue(dataPoints[index].value.toString());
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setEditIndex(null);
    setEditLabel('');
    setEditValue('');
  };
  
  // Save edited data point
  const saveEdit = () => {
    if (editIndex !== null && editLabel.trim() && editValue.trim()) {
      const numValue = parseFloat(editValue);
      if (!isNaN(numValue)) {
        const newData = [...dataPoints];
        newData[editIndex] = { label: editLabel, value: numValue };
        setDataPoints(newData);
        setEditIndex(null);
        setEditLabel('');
        setEditValue('');
      }
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Chart Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Controls */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Chart Controls</h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Chart Type</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as ChartType)}
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                </select>
              </div>
              
              <div className="divider">Data Points</div>
              
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>Value</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPoints.map((point, index) => (
                      <tr key={index}>
                        <td>
                          {editIndex === index ? (
                            <input 
                              type="text" 
                              className="input input-bordered input-sm w-full" 
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                            />
                          ) : (
                            point.label
                          )}
                        </td>
                        <td>
                          {editIndex === index ? (
                            <input 
                              type="number" 
                              className="input input-bordered input-sm w-full" 
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                            />
                          ) : (
                            point.value
                          )}
                        </td>
                        <td>
                          {editIndex === index ? (
                            <div className="flex space-x-1">
                              <button 
                                className="btn btn-success btn-xs"
                                onClick={saveEdit}
                              >
                                Save
                              </button>
                              <button 
                                className="btn btn-ghost btn-xs"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-1">
                              <button 
                                className="btn btn-info btn-xs"
                                onClick={() => startEdit(index)}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-error btn-xs"
                                onClick={() => removeDataPoint(index)}
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="divider">Add New Data Point</div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Label</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter label" 
                    className="input input-bordered"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Value</span>
                  </label>
                  <input 
                    type="number" 
                    placeholder="Enter value" 
                    className="input input-bordered"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                className="btn btn-primary mt-4"
                onClick={addDataPoint}
              >
                Add Data Point
              </button>
            </div>
          </div>
          
          {/* Chart Display */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Chart Preview</h2>
              
              <div className="bg-base-200 p-4 rounded-box flex items-center justify-center min-h-[400px]">
                <SimpleChart 
                  data={dataPoints} 
                  type={chartType} 
                  width={500} 
                  height={350} 
                />
              </div>
              
              <div className="mt-6">
                <h3 className="font-bold mb-2">About Charts</h3>
                <p>
                  Charts help visualize data relationships and trends. Bar charts compare quantities across categories, 
                  line charts show trends over time, and pie charts display proportions of a whole.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
