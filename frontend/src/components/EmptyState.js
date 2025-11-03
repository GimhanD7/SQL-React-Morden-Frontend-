import React from 'react';

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="text-center py-12 md:py-16 animate-fade-in">
      <Icon size={64} className="mx-auto mb-4 text-gray-300" />
      <h3 className="text-xl md:text-2xl font-semibold text-gray-600 mb-2">{title}</h3>
      {description && <p className="text-sm md:text-base text-gray-500">{description}</p>}
    </div>
  );
}

export default EmptyState;
