import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

function ColumnsTable({ columns, onRenameColumn, onDeleteColumn }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 -mx-4 md:mx-0">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Null</th>
            <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Key</th>
            <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Default</th>
            <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Extra</th>
            <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {columns.map((col) => (
            <tr key={col.name} className="hover:bg-gray-50">
              <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                <span className="font-medium text-xs md:text-sm text-gray-900">{col.name}</span>
              </td>
              <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-600">{col.type}</td>
              <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden sm:table-cell">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  col.null === 'YES' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                }`}>
                  {col.null}
                </span>
              </td>
              <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden md:table-cell">
                {col.key && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {col.key}
                  </span>
                )}
              </td>
              <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-600 hidden lg:table-cell">{col.default || '-'}</td>
              <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-600 hidden lg:table-cell">{col.extra || '-'}</td>
              <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => onRenameColumn(col.name)}
                    className="p-1 md:p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteColumn(col.name)}
                    className="p-1 md:p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ColumnsTable;
