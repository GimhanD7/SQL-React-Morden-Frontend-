import React from 'react';
import { Table, Trash2 } from 'lucide-react';

function TableList({ tables, selectedTable, onSelectTable, onDeleteTable }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
      {tables.map((table) => (
        <div
          key={table}
          className={`group relative p-4 rounded-lg border cursor-pointer transition-colors ${
            selectedTable === table
              ? 'bg-gray-50 border-gray-300'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onSelectTable(table)}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium text-sm text-gray-900">
              <Table size={16} />
              {table}
            </span>
            <button
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTable(table);
              }}
            >
              <Trash2 size={14} className="text-gray-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TableList;
