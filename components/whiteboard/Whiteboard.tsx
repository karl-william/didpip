'use client';

import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import SimpleChart from '../data-viz/SimpleChart';
import WordCloud from '../data-viz/WordCloud';
import HundredsSquare from '../data-viz/HundredsSquare';
import NumberLine from '../data-viz/NumberLine';

// Define resource types that match our existing components
type ResourceType = 'chart' | 'wordcloud' | 'hundreds-square' | 'number-line';

// Define resource interface
interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  description: string;
}

// Use only the resources that have been implemented
const availableResources: Resource[] = [
  { 
    id: 'chart', 
    title: 'Chart', 
    type: 'chart',
    description: 'Create bar, line, or pie charts to visualize data'
  },
  { 
    id: 'wordcloud', 
    title: 'Word Cloud', 
    type: 'wordcloud',
    description: 'Generate a word cloud from text input'
  },
  { 
    id: 'hundreds-square', 
    title: 'Hundreds Square', 
    type: 'hundreds-square',
    description: 'Explore number patterns and times tables'
  },
  { 
    id: 'number-line', 
    title: 'Number Line', 
    type: 'number-line',
    description: 'Create a customizable number line'
  }
];

export default function Whiteboard() {
  const [showPips, setShowPips] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [resourceOutput, setResourceOutput] = useState<any>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter resources based on search query
  const filteredResources = availableResources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle resource selection
  const handleSelectResource = (resource: Resource) => {
    setSelectedResource(resource);
    setResourceOutput(null); // Reset any previous output
  };

  // Handle inserting resource into whiteboard
  const handleInsertResource = async () => {
    if (!resourceOutput || !editorInstance) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    try {
      // Use html2canvas to capture the component as an image
      const contentElement = container.querySelector('.resource-content') as HTMLElement;
      if (!contentElement) {
        console.error('Resource content element not found');
        return;
      }
      
      const canvas = await html2canvas(contentElement);
      const imageDataUrl = canvas.toDataURL('image/png');
      
      // Create a blob from the data URL
      const blob = await (await fetch(imageDataUrl)).blob();
      
      // Use the correct API to create an asset
      const asset = {
        type: 'image',
        src: imageDataUrl,
        size: [canvas.width, canvas.height],
        name: `${selectedResource?.title || 'Resource'}.png`,
      };
      
      // Insert the image into the whiteboard using the correct API
      editorInstance.insertMedia(blob, {
        type: 'image',
        ...asset,
      });
      
      // Close the resource view after inserting
      setSelectedResource(null);
      setResourceOutput(null);
    } catch (error) {
      console.error('Error inserting resource:', error);
      alert('Failed to insert resource. See console for details.');
    }
  };

  // Render the selected resource component
  const renderResourceComponent = () => {
    if (!selectedResource) return null;

    switch (selectedResource.type) {
      case 'chart':
        return (
          <div className="resource-content bg-white p-2 rounded-box">
            <SimpleChart 
              data={[{label: 'A', value: 10}, {label: 'B', value: 20}, {label: 'C', value: 15}]} 
              type="bar" 
              width={400} 
              height={300}
            />
          </div>
        );
      case 'wordcloud':
        return (
          <div className="resource-content bg-white p-2 rounded-box">
            <WordCloud 
              words={['education', 'learning', 'school', 'teaching', 'classroom', 'students']} 
              width={400} 
              height={300}
            />
          </div>
        );
      case 'hundreds-square':
        return (
          <div className="resource-content bg-white p-2 rounded-box">
            <HundredsSquare />
          </div>
        );
      case 'number-line':
        return (
          <div className="resource-content bg-white p-2 rounded-box">
            <NumberLine 
              minValue={0} 
              maxValue={100} 
              interval={10} 
              width={400} 
              height={120}
            />
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Controls above the whiteboard */}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Interactive Whiteboard</h2>
        <div>
          <button 
            className="btn btn-primary mr-2"
            onClick={() => setShowPips(!showPips)}
          >
            {showPips ? 'Hide Pips' : 'Show Pips'}
          </button>
          <button className="btn btn-outline">Save</button>
        </div>
      </div>
      
      {/* Main content area with sidebar and whiteboard */}
      <div className="flex flex-1 relative">
        {/* Pips sidebar */}
        {showPips && (
          <div className="w-64 bg-base-200 p-4 mr-4 rounded-box overflow-y-auto">
            {selectedResource ? (
              <div>
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold">{selectedResource.title}</h3>
                  <button 
                    className="btn btn-sm btn-ghost"
                    onClick={() => setSelectedResource(null)}
                  >
                    Back
                  </button>
                </div>
                <div ref={containerRef}>
                  {renderResourceComponent()}
                  <button 
                    className="btn btn-primary w-full mt-4"
                    onClick={() => setResourceOutput(selectedResource.id)}
                  >
                    Use This {selectedResource.title}
                  </button>
                  {resourceOutput && (
                    <button 
                      className="btn btn-success w-full mt-4"
                      onClick={handleInsertResource}
                    >
                      Insert into Whiteboard
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-bold mb-2">Available Pips</h3>
                <div className="mb-4">
                  <input 
                    type="text" 
                    placeholder="Search resources..." 
                    className="input input-bordered w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <ul className="menu bg-base-100 rounded-box">
                  {filteredResources.length > 0 ? (
                    filteredResources.map(resource => (
                      <li key={resource.id}>
                        <a onClick={() => handleSelectResource(resource)}>
                          <div>
                            <div className="font-medium">{resource.title}</div>
                            <div className="text-xs text-gray-500">{resource.description}</div>
                          </div>
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-center py-2 text-gray-500">No resources found</li>
                  )}
                </ul>
              </>
            )}
          </div>
        )}
        
        {/* Whiteboard area */}
        <div className={`flex-1 border rounded-box overflow-hidden ${showPips ? 'ml-64' : ''}`}>
          <Tldraw
            onMount={(editor) => {
              setEditorInstance(editor);
            }}
          />
        </div>
      </div>
    </div>
  );
}
