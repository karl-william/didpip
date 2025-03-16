import { useState, useEffect } from 'react';

type ResourceSearchProps = {
  onSearch: (query: string) => void;
  initialQuery?: string;
  placeholder?: string;
  className?: string;
};

export default function ResourceSearch({ 
  onSearch, 
  initialQuery = '', 
  placeholder = 'Search resources...', 
  className = '' 
}: ResourceSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  return (
    <div className={`form-control ${className}`}>
      <div className="input-group">
        <input 
          type="text" 
          placeholder={placeholder} 
          className="input input-bordered w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-square">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
