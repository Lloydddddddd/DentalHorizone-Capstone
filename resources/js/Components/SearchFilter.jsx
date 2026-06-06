import React from 'react';

export default function SearchFilter({ 
  searchValue, 
  onSearchChange, 
  placeholder = "Search by patient name...", 
  className = "" 
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={searchValue || ''}
      onChange={onSearchChange}
      aria-label="Search patients"
      className={`flex-1 min-w-0 border border-gray-300 rounded-md px-3 py-2 
                 text-sm text-gray-700 focus:outline-none focus:ring-2 
                 focus:ring-blue-200 focus:border-blue-400 transition-colors
                 ${className}`}
    />
  );
}