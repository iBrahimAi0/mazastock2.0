import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { AuthProvider, useAuth } from './services/AuthContext';

jest.mock('axios', () => ({
  post: jest.fn(),
}));

const AuthProbe = () => {
  const { user, login } = useAuth();

  return (
    <div>
      <span>{user ? `${user.name}:${user.role}` : 'anonymous'}</span>
      <button onClick={() => login('admin@example.com', 'password')}>Log in</button>
    </div>
  );
};

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('stores the authenticated user and role after login', async () => {
  axios.post.mockResolvedValue({
    data: {
      token: 'test-token',
      user: { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
    },
  });

  render(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>
  );

  fireEvent.click(screen.getByRole('button', { name: /log in/i }));

  expect(await screen.findByText('Admin:admin')).toBeInTheDocument();
  expect(localStorage.getItem('token')).toBe('test-token');
  expect(JSON.parse(localStorage.getItem('user')).role).toBe('admin');
});
