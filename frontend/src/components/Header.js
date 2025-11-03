import React from 'react';
import { Database } from 'lucide-react';

function Header() {
  return (
    <header className="bg-white px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <Database size={20} className="text-gray-700 md:w-6 md:h-6" />
          <h1 className="text-base md:text-xl font-semibold text-gray-900">MySQL Manager</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="hidden sm:block px-3 md:px-4 py-1.5 md:py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 w-32 sm:w-48 md:w-64"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
