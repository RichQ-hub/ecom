import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AuthContext } from '../../context/AuthContextProvider';
import Navbar from '../../components/Navbar';
import { BrowserRouter } from 'react-router-dom';

describe('Navbar', () => {
  const setToken = vi.fn();
  const setName = vi.fn();
  const name = 'John';
  const token = 'token-test';

  it('renders the navbar links when the token is present.', () => {
    render(
      <AuthContext.Provider value={{ token, name, setToken, setName }}>
        <Navbar />
      </AuthContext.Provider>,
      { wrapper: BrowserRouter }
    );
    expect(screen.getByTestId('navbar-logo')).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links.length).toBe(4);
    expect(links[0].getAttribute('href')).toBe('/');
    expect(links[1].getAttribute('href')).toBe('/companies');
    expect(links[1].textContent).toBe('SEARCH');
    expect(links[2].getAttribute('href')).toBe('/comparison-tool');
    expect(links[2].textContent).toBe('COMPARISON TOOL');
    expect(links[3].getAttribute('href')).toBe('/frameworks');
    expect(links[3].textContent).toBe('FRAMEWORKS');

  });

  it('renders only the logo when no token is present.', async () => {
    const token = '';
    render(
      <AuthContext.Provider value={{ token, name, setToken, setName }}>
        <Navbar />
      </AuthContext.Provider>,
      { wrapper: BrowserRouter }
    );
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('/');
  });

  it('removes the navlinks on logout.', () => {
    render(
      <AuthContext.Provider value={{ token, name, setToken, setName }}>
        <Navbar />
      </AuthContext.Provider>,
      { wrapper: BrowserRouter }
    );
    const logoutBtn = screen.getByRole('button', { name: 'Log Out' });
    expect(logoutBtn).toBeInTheDocument();
    fireEvent.click(logoutBtn);
    fireEvent.click(screen.getByRole('button', { name: 'Yes, Log Out' }));
    expect(setToken).toHaveBeenCalledOnce();
    expect(setName).toHaveBeenCalledOnce();
  });
});