import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CompanySearchBar from '../../components/CompanySearchBar';
import { BrowserRouter } from 'react-router-dom';

describe('CompanySearchBar', () => {
  const handleSearch = vi.fn();
  it('renders a search bar with a search field and submit button.', () => {
    render(
      <CompanySearchBar
        handleSearch={handleSearch}
      />,
      { wrapper: BrowserRouter }
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('triggers handleChange event handler when input value changes', () => {
    render(
      <CompanySearchBar
        handleSearch={handleSearch}
      />,
      { wrapper: BrowserRouter }
    );
    const inputField = screen.getByRole('textbox');
    expect(inputField).toHaveValue('');
    fireEvent.change(inputField, {
      target: { value: 'test' }
    })
    expect(inputField).toHaveValue('test');
    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('triggers handleSearch handler when button is submitted with the right query.', () => {
    render(
      <CompanySearchBar
        handleSearch={handleSearch}
      />,
      { wrapper: BrowserRouter }
    );
    const inputField = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button');
    fireEvent.change(inputField, {
      target: { value: 'test' }
    })
    fireEvent.click(searchButton);
    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith('test');
  });
  
});