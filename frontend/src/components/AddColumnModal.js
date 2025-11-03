import React from 'react';
import { Plus, Check, X } from 'lucide-react';
import Modal from './Modal';

function AddColumnModal({ isOpen, onClose, column, setColumn, onSubmit, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Column" icon={Plus}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Column Name</label>
            <input
              type="text"
              value={column.name}
              onChange={(e) => setColumn({ ...column, name: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-100 outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <select
              value={column.type}
              onChange={(e) => setColumn({ ...column, type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-100 outline-none transition-all duration-200"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Length</label>
            <input
              type="text"
              value={column.length}
              onChange={(e) => setColumn({ ...column, length: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-100 outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Default Value</label>
            <input
              type="text"
              value={column.default}
              onChange={(e) => setColumn({ ...column, default: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-100 outline-none transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={column.nullable}
              onChange={(e) => setColumn({ ...column, nullable: e.target.checked })}
              className="w-5 h-5 text-black rounded focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700">Nullable</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={column.autoIncrement}
              onChange={(e) => setColumn({ ...column, autoIncrement: e.target.checked })}
              className="w-5 h-5 text-black rounded focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700">Auto Increment</span>
          </label>
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
            Add Column
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddColumnModal;
