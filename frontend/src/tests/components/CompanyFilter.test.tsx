import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom';
import CompanyFilter from '../../components/CompanyFilter';

const MOCK_INDUSTRIES = [
  'IT',
  'Agriculture',
  'Mining',
]

const MOCK_COUNTRIES = [
  'Australia',
  'Sudan',
]

// We mock the framework service file.
vi.mock('../../services/CompanyService', () => {
  return {
    default: {
      companiesCountries: vi.fn(() => Promise.resolve(MOCK_COUNTRIES)),
      companiesIndustries: vi.fn(() => Promise.resolve(MOCK_INDUSTRIES)),
    },
  }
});

describe('CompanyFilter', () => {
  const handleToggleIndustry = vi.fn();
  const handleToggleHQCountry = vi.fn();
  it('renders the select framework modal and correct lists', async () => {
    render(
      <CompanyFilter
        handleToggleHQCountry={handleToggleHQCountry}
        handleToggleIndustry={handleToggleIndustry}
      />,
      { wrapper: BrowserRouter }
    );
    await waitFor(() => {
      // I'd look for a real text here that is renderer when the data loads
      expect(screen.getByRole('heading', { name: 'Headquarter Country' })).toBeInTheDocument();
    })
    expect(screen.getByRole('heading', { name: 'Headquarter Country' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Industries' })).toBeInTheDocument();
  });

  it('renders the countries and industries', async () => {
    render(
      <CompanyFilter
        handleToggleHQCountry={handleToggleHQCountry}
        handleToggleIndustry={handleToggleIndustry}
      />,
      { wrapper: BrowserRouter }
    );
    await waitFor(() => {
      // I'd look for a real text here that is renderer when the data loads
      expect(screen.getByRole('heading', { name: 'Headquarter Country' })).toBeInTheDocument();
    })
    const industryList = screen.getAllByTestId('industry');
    const countryList = screen.getAllByTestId('country');
    expect(industryList.length).toBe(3);
    expect(countryList.length).toBe(2);
    expect(industryList[0].textContent).toBe('IT');
    expect(industryList[1].textContent).toBe('Agriculture');
    expect(industryList[2].textContent).toBe('Mining');
    expect(countryList[0].textContent).toBe('Australia');
    expect(countryList[1].textContent).toBe('Sudan');
  });

  it('calls toggle country handler when clicked.', async () => {
    render(
      <CompanyFilter
        handleToggleHQCountry={handleToggleHQCountry}
        handleToggleIndustry={handleToggleIndustry}
      />,
      { wrapper: BrowserRouter }
    );
    await waitFor(() => {
      // I'd look for a real text here that is renderer when the data loads
      expect(screen.getByRole('heading', { name: 'Headquarter Country' })).toBeInTheDocument();
    })
    const countryList = screen.getAllByTestId('country');
    fireEvent.click(countryList[0]);
    expect(handleToggleHQCountry).toHaveBeenCalledTimes(1);
  });

  it('calls toggle industry handler when clicked.', async () => {
    render(
      <CompanyFilter
        handleToggleHQCountry={handleToggleHQCountry}
        handleToggleIndustry={handleToggleIndustry}
      />,
      { wrapper: BrowserRouter }
    );
    await waitFor(() => {
      // I'd look for a real text here that is renderer when the data loads
      expect(screen.getByRole('heading', { name: 'Headquarter Country' })).toBeInTheDocument();
    })
    const industryList = screen.getAllByTestId('industry');
    fireEvent.click(industryList[0]);
    expect(handleToggleIndustry).toHaveBeenCalledTimes(1);
  });
});