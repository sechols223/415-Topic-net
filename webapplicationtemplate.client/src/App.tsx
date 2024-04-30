import React from 'react';
import './App.css';
import { MantineProvider, Container, Card } from '@mantine/core';
import { AuthProvider } from './auth-context';
import { LoginPage } from './login';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HomePage } from './home';

export function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
  ]);

  return (
    <AuthProvider>
      <MantineProvider defaultColorScheme="dark">
        <RouterProvider router={router} />
      </MantineProvider>
    </AuthProvider>
  );
}
