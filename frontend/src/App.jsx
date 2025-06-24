import React from 'react';
import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AppRouter />
    </>
  );
}