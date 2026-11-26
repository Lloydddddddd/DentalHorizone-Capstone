import React from "react";

export default function StatusFilter({ value, onChange }) {
  return (
    <div className="relative inline-block">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 
                   appearance-none pr-8 shadow-sm"
      >
        <option value="" className="text-gray-600">All Statuses</option>
        <option value="pending" className="text-yellow-600 font-medium">Pending</option>
        <option value="cancelled" className="text-red-600 font-medium">Cancelled</option>
      </select>

      
    </div>
  );
}
