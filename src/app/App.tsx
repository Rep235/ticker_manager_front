import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { PreferencesProvider } from '../features/preferences';

export const App: React.FC = () => {
  return (
    <PreferencesProvider>
      <RouterProvider router={router} />
    </PreferencesProvider>
  );
};
