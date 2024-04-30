import React from 'react';
import './App.css';
import { MantineProvider, Container, Card } from '@mantine/core';
import { AuthProvider } from './auth-context';
import { LoginPage } from './login';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import '@mantine/core/styles.css';

export function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LoginPage />,
    },
  ]);

  return (
    <AuthProvider>
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </AuthProvider>
  );
}
