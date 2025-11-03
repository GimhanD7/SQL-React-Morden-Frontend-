import React from 'react';
import { Table, Plus, Trash2, Check, X } from 'lucide-react';
import Modal from './Modal';

function CreateTableModal({ 
  isOpen, 
  onClose, 
  tableName, 
  setTableName, 
  columns, 
  setColumns, 
  onSubmit, 
  loading 
}) {
  const addColumn = () => {
    setColumns([...columns, {
      name: '',
      type: 'VARCHAR',
      length: '255',
      nullable: false,
      autoIncrement: false,
      primaryKey: false,
      default: ''
    }]);
  };

  const removeColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index, field, value) => {
    const updated = [...columns];
    updated[index][field] = value;
    setColumns(updated);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Table" icon={Table}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Table Name</label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-100 outline-none transition-all duration-200"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Columns</h4>
            <button
              type="button"
              onClick={addColumn}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <Plus size={18} />
              Add Column
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin pr-2">
            {columns.map((col, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-semibold text-gray-700">Column {index + 1}</h5>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeColumn(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) => updateColumn(index, 'name', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-gray-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={col.type}
                      onChange={(e) => updateColumn(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-gray-100 outline-none"
                    >
                      <option value="INT">INT</option>
                      <option value="VARCHAR">VARCHAR</option>
                      <option value="TEXT">TEXT</option>
                      <option value="DATE">DATE</option>
                      <option value="DATETIME">DATETIME</option>
                      <option value="TIMESTAMP">TIMESTAMP</option>
                      <option value="DECIMAL">DECIMAL</option>
                      <option value="FLOAT">FLOAT</option>
                      <option value="BOOLEAN">BOOLEAN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                    <input
                      type="text"
                      value={col.length}
                      onChange={(e) => updateColumn(index, 'length', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-gray-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default</label>
                    <input
                      type="text"
                      value={col.default}
                      onChange={(e) => updateColumn(index, 'default', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-gray-100 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={col.nullable}
                      onChange={(e) => updateColumn(index, 'nullable', e.target.checked)}
                      className="w-4 h-4 text-black rounded focus:ring-black"
                    />
                    <span className="text-sm font-medium text-gray-700">Nullable</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={col.autoIncrement}
                      onChange={(e) => updateColumn(index, 'autoIncrement', e.target.checked)}
                      className="w-4 h-4 text-black rounded focus:ring-black"
                    />
                    <span className="text-sm font-medium text-gray-700">Auto Increment</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={col.primaryKey}
                      onChange={(e) => updateColumn(index, 'primaryKey', e.target.checked)}
                      className="w-4 h-4 text-black rounded focus:ring-black"
                    />
                    <span className="text-sm font-medium text-gray-700">Primary Key</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors duration-200 flex items-center gap-2"
          >
            <X size={20} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
          >
            <Check size={20} />
            Create Table
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateTableModal;
