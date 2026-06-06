import React from 'react';

export default function SearchFilter({ searchValue, onSearchChange }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search by patient name..."
        value={searchValue || ''}
        onChange={onSearchChange}
        className="border border-gray-300 rounded-md px-3 py-2 w-1/2 max-w-md 
                   text-sm text-gray-700 focus:outline-none focus:ring-2 
                   focus:ring-blue-200 focus:border-blue-400"
      />
    </div>
  );
}
