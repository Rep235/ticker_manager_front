import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import TicketDetailPage from '../pages/TicketDetailPage';
import UsersPage from '../pages/UsersPage';
import ClientsPage from '../pages/ClientsPage';
import TicketsPage from '../pages/TicketsPage';
import LayoutPage from '../pages/LayoutPage';
import SetupPage from '../pages/SetupPage';
import SettingsPage from '../pages/SettingsPage';
import AboutPage from '../pages/AboutPage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/setup',
    element: <SetupPage />,
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <LayoutPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'tickets',
        element: <TicketsPage />,
      },
      {
        path: 'tickets/:id',
        element: <TicketDetailPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'clients',
        element: <ClientsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
]);
