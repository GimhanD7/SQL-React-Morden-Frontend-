import React from 'react';
import { Database, Plus, Trash2 } from 'lucide-react';

function Sidebar({ 
  databases, 
  selectedDatabase, 
  onSelectDatabase, 
  onDeleteDatabase, 
  newDatabaseName, 
  setNewDatabaseName, 
  onCreateDatabase, 
  loading 
}) {
  return (
    <aside className="bg-white w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200 p-4 overflow-y-auto max-h-64 md:max-h-none">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
        Databases
      </h2>
      
      <ul className="space-y-1 mb-6">
        {databases.map((db) => (
          <li
            key={db}
            className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              selectedDatabase === db
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => onSelectDatabase(db)}
          >
            <span className="flex items-center gap-2 flex-1 text-sm">
              <Database size={16} />
              {db}
            </span>
            <button
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteDatabase(db);
              }}
            >
              <Trash2 size={14} className="text-gray-500" />
            </button>
          </li>
        ))}
      </ul>

      <div className="pt-4 mt-4 border-t border-gray-200">
        <form onSubmit={onCreateDatabase} className="space-y-2">
          <input
            type="text"
            placeholder="New database..."
            value={newDatabaseName}
            onChange={(e) => setNewDatabaseName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white px-3 py-2 text-sm rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Create
          </button>
        </form>
      </div>
    </aside>
  );
}

export default Sidebar;
