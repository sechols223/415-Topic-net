import './App.css';
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from './auth/auth-context';
import { LoginPage } from './login';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HomePage } from './home';
import { Notifications } from '@mantine/notifications';
import { RegisterPage } from './register-page';

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
    {
      path: '/register',
      element: <RegisterPage />,
    },
  ]);

  return (
    <AuthProvider>
      <MantineProvider defaultColorScheme="dark">
        <Notifications />
        <RouterProvider router={router} />
      </MantineProvider>
    </AuthProvider>
  );
}
