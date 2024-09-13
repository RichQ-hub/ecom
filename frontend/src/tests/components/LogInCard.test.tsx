import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginCard from '../../components/LoginCard';

describe('LoginCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear(); // Clear localStorage before each test
  });

  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <LoginCard />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });

  it('validates email input', () => {
    render(
      <BrowserRouter>
        <LoginCard />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
  });

  it('shows/hides password correctly', () => {
    render(
      <BrowserRouter>
        <LoginCard />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /toggle visibility/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
