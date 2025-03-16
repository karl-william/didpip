'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import ResourceSearch from '@/components/common/ResourceSearch';

// Define types for our resources
type ResourceCategory = 'math' | 'science' | 'language' | 'history' | 'art';

type Resource = {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  thumbnail: string;
  type: 'whiteboard' | 'wordcloud' | 'chart' | 'hundreds-square' | 'number-line';
};

// Sample resources data
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

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter resources based on category and search query
  const filteredResources = sampleResources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Educational Resources</h1>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Search and filters */}
          <div className="w-full md:w-1/4">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Search & Filter</h2>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Search</span>
                  </label>
                  <ResourceSearch 
                    onSearch={setSearchQuery}
                    initialQuery={searchQuery}
                    className="mb-4"
                  />
                </div>
                
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ResourceCategory | 'all')}
                  >
                    <option value="all">All Categories</option>
                    <option value="math">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="language">Language</option>
                    <option value="history">History</option>
                    <option value="art">Art</option>
                  </select>
                </div>
                
                <div className="mt-6">
                  <button 
                    className="btn btn-primary w-full"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Resources grid */}
          <div className="w-full md:w-3/4">
            {filteredResources.length === 0 ? (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>No resources found matching your criteria.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
