import React from 'react';
import { Search } from 'lucide-react';

export default function SearchFilter({ 
  searchValue, 
  onSearchChange, 
  placeholder = "Search by patient name...", 
  className = "" 
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Magnifier icon */}
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

      {/* Input field */}
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue || ''}
        onChange={onSearchChange}
        aria-label="Search patients"
        className={`flex-1 min-w-0 border border-gray-300 rounded-md pl-10 pr-3 py-2 
                   text-sm text-gray-700 bg-gray-50 focus:outline-none 
                   focus:ring-2 focus:ring-blue-200 focus:border-blue-400 
                   hover:border-blue-400 transition-colors`}
      />
    </div>
  );
}