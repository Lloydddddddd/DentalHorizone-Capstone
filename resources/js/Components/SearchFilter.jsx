import React from 'react';

export default function SearchFilter({ searchValue, onSearchChange }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search by patient name..."
        value={searchValue || ''}
        onChange={onSearchChange}
        className="border rounded px-3 py-2 w-full"
      />
    </div>
  );
}