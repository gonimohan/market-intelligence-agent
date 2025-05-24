import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import LoginPage from '../../pages/auth/LoginPage';
import RegisterPage from '../../pages/auth/RegisterPage';
import ForgotPasswordPage from '../../pages/auth/ForgotPasswordPage';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock the auth context
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn().mockResolvedValue({}),
    register: jest.fn().mockResolvedValue({}),
    forgotPassword: jest.fn().mockResolvedValue({}),
    isLoading: false,
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Authentication Flow Tests', () => {
  test('Login form validation works correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Try to submit without filling fields
    const submitButton = screen.getByText('Sign in');
    fireEvent.click(submitButton);
    
    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email address')).toBeInvalid();
      expect(screen.getByPlaceholderText('Password')).toBeInvalid();
    });
    
    // Fill in with invalid email
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'invalid-email' },
    });
    
    fireEvent.click(submitButton);
    
    // Check for email validation message
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email address')).toBeInvalid();
    });
    
    // Fill in with valid data
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(submitButton);
    
    // Should not show validation errors
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email address')).toBeValid();
      expect(screen.getByPlaceholderText('Password')).toBeValid();
    });
  });
  
  test('Registration form validation works correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Try to submit without filling required fields
    const submitButton = screen.getByText('Create account');
    fireEvent.click(submitButton);
    
    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email address')).toBeInvalid();
      expect(screen.getByPlaceholderText('Password')).toBeInvalid();
      expect(screen.getByPlaceholderText('Confirm Password')).toBeInvalid();
    });
    
    // Fill in with mismatched passwords
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password456' },
    });
    
    fireEvent.click(submitButton);
    
    // Check for password mismatch message
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Confirm Password')).toBeInvalid();
    });
    
    // Fill in with valid data
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(submitButton);
    
    // Should not show validation errors
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email address')).toBeValid();
      expect(screen.getByPlaceholderText('Password')).toBeValid();
      expect(screen.getByPlaceholderText('Confirm Password')).toBeValid();
    });
  });
  
  test('Forgot password form validation works correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ForgotPasswordPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // Try to submit without filling email
    const submitButton = screen.getByText('Send reset link');
    fireEvent.click(submitButton);
    
    // Check for validation message
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email address')).toBeInvalid();
    });
    
    // Fill in with invalid email
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'invalid-email' },
    });
    
    fireEvent.click(submitButton);
    
    // Check for email validation message
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email address')).toBeInvalid();
    });
    
    // Fill in with valid email
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.click(submitButton);
    
    // Should not show validation errors
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email address')).toBeValid();
    });
  });
});
