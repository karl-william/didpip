'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import ResourceSearch from '@/components/common/ResourceSearch';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

// Define types for our resources (copied from pips page)
type ResourceCategory = 'math' | 'science' | 'language' | 'history' | 'art';

type Resource = {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  thumbnail: string;
  type: 'whiteboard' | 'wordcloud' | 'chart' | 'hundreds-square' | 'number-line';
};

// Sample resources data (copied from pips page)
const sampleResources: Resource[] = [
  {
    id: '2',
    title: 'Word Cloud',
    description: 'Creates a visualisation of multiple words',
    category: 'language',
    thumbnail: '/resources/wordcloud-preview.png',
    type: 'wordcloud'
  },
  {
    id: '3',
    title: 'Charts and Graphs',
    description: 'Interactive charts for visualizing mathematical concepts and data',
    category: 'math',
    thumbnail: '/resources/chart-preview.png',
    type: 'chart'
  },
  {
    id: '4',
    title: 'Hundreds Square',
    description: 'Interactive hundreds square for exploring number patterns and times tables',
    category: 'math',
    thumbnail: '/resources/hundredssquare-preview.png',
    type: 'hundreds-square'
  },
  {
    id: '5',
    title: 'Interactive Number Line',
    description: 'Explore number patterns and relationships with an adjustable, interactive number line',
    category: 'math',
    thumbnail: '/resources/numberline-preview.png',
    type: 'number-line'
  },
];

export default function HomeClient() {
  const [filteredResources, setFilteredResources] = useState(sampleResources);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredResources(sampleResources);
      return;
    }
    
    const filtered = sampleResources.filter(resource => 
      resource.title.toLowerCase().includes(query.toLowerCase()) || 
      resource.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResources(filtered);
  };

  return (
    <MainLayout>
      <div className="hero bg-base-200 rounded-box mb-8">
        <div className="hero-content text-center py-8 w-full">
          <div className="w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Try Our Interactive Whiteboard</h2>
            
            {/* Interactive Whiteboard */}
            <div className="h-[400px] w-full rounded-box overflow-hidden border border-base-300 mb-6">
              <Tldraw 
                persistenceKey="home-whiteboard-demo"
              />
            </div>
            
            <div className="flex justify-center gap-4 mt-4">
              <Link href="/pips" className="btn btn-primary">Browse Resources</Link>
              <Link href="/whiteboard" className="btn btn-secondary">Full Whiteboard</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Example Resources</h2>
        <div className="w-1/3">
          <ResourceSearch onSearch={handleSearch} />
        </div>
      </div>
      
      {filteredResources.length === 0 ? (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>No resources found matching your search.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredResources.map(resource => (
            <div key={resource.id} className="card bg-base-100 shadow-xl">
              <figure className="px-4 pt-4">
                <img 
                  src={resource.thumbnail} 
                  alt={`${resource.title} thumbnail`}
                  className="w-full h-40 rounded-xl object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {resource.title}
                  <div className="badge badge-secondary">{resource.category}</div>
                </h2>
                <p>{resource.description}</p>
                <div className="card-actions justify-end mt-4">
                  <Link 
                    href={
                      resource.type === 'wordcloud' 
                        ? '/wordcloud' 
                        : resource.type === 'chart'
                          ? '/chart'
                          : resource.type === 'hundreds-square'
                            ? '/hundreds-square'
                            : resource.type === 'number-line'
                              ? '/number-line'
                              : '/whiteboard'
                    }
                    className="btn btn-primary btn-sm"
                  >
                    View Resource
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
