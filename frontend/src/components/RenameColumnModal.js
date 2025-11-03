import React from 'react';
import { Edit, Check, X } from 'lucide-react';
import Modal from './Modal';

function RenameColumnModal({ isOpen, onClose, oldName, newName, setNewName, onSubmit, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename Column" icon={Edit}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Current Name</label>
          <input
            type="text"
            value={oldName}
            disabled
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">New Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-100 outline-none transition-all duration-200"
          />
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
            Rename
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default RenameColumnModal;
