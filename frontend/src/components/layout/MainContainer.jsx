import React from 'react';

export default function MainContainer({ children }) {
  return (
    <main className="flex-1 lg:ml-60 pt-16 p-4 lg:p-6 bg-gray-50 min-h-screen">
      {children}
    </main>
  );
} 