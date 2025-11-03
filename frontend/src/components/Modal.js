import React from 'react';

function Modal({ isOpen, onClose, title, icon: Icon, children }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
          <h3 className="text-2xl font-bold text-black flex items-center gap-3">
            {Icon && <Icon size={28} className="text-black" />}
            {title}
          </h3>
        </div>
        <div className="px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
