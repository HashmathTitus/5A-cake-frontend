import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AdminLogin from './pages/AdminLogin';
import { AuthProvider } from './context/AuthContext';

jest.mock('./api/axiosClient', () => ({
  feedbackAPI: {
    getPublic: jest.fn().mockResolvedValue({ data: { feedbacks: [] } }),
    create: jest.fn(),
    getAll: jest.fn(),
    getStats: jest.fn(),
  },
  eventsAPI: {
    getAll: jest.fn().mockResolvedValue({ data: { events: [] } }),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getStats: jest.fn().mockResolvedValue({ data: {} }),
  },
  authAPI: {
    login: jest.fn(),
    getProfile: jest.fn(),
  },
  getApiErrorMessage: jest.fn(() => 'Request failed'),
  clearStoredAuth: jest.fn(),
}));

describe('App smoke tests', () => {
  test('renders the public homepage shell', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText(/Preparing the event showcase/i)).toBeInTheDocument();
  });

  test('renders the admin login page', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <AdminLogin />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });
});
