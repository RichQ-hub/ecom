import { CompanyDetails, CompanyExcel, CompanyPDF } from '../types/company';
import { BACKEND_URL, parseJSON } from './helpers';

const BASE_URL = `${BACKEND_URL}/companies`;

class CompanyService {
  searchCompanies = async (query: string, page: string, sort: string, country: string[], industry: string[]) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    }

    const offset = Number(page) - 1;

    const searchParams = new URLSearchParams();
    searchParams.set('search_query', query);
    searchParams.set('offset', offset.toString());
    searchParams.set('sort', sort);
    country.forEach((c) => {
      searchParams.append('country', c);
    });
    industry.forEach((ind) => {
      searchParams.append('industry', ind);
    });

    const response = await parseJSON(`${BASE_URL}?${searchParams.toString()}`, options);
    return response.companies as CompanyDetails[];
  }

  countCompanies = async (query: string, country: string[], industry: string[]) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    }

    const searchParams = new URLSearchParams();
    searchParams.set('search_query', query);
    country.forEach((c) => {
      searchParams.append('country', c);
    });
    industry.forEach((ind) => {
      searchParams.append('industry', ind);
    });

    const response = await parseJSON(`${BASE_URL}/count?${searchParams.toString()}`, options);
    return response.count as number;
  }

  companiesCountries = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    }
  
    const response = await parseJSON(`${BASE_URL}/countries`, options);
    return response.countries as string[];
  }

  companiesIndustries = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    }
  
    const response = await parseJSON(`${BACKEND_URL}/industries`, options);
    return response.industries as string[];
  }

  companyDetails = async (companyId: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    }
  
    const response = await parseJSON(`${BASE_URL}/${companyId}`, options);
    return response as CompanyDetails;
  }

  downloadPDF = async (companyId: string, year: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    }
  
    const response = await parseJSON(`${BASE_URL}/report/pdf/${companyId}/${year}`, options);
    return response as CompanyPDF;
  }

  downloadExcel = async (companyId: string, year: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    }
  
    const response = await parseJSON(`${BASE_URL}/report/excel/${companyId}/${year}`, options);
    return response as CompanyExcel;
  }

  reportYears = async (companyId: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    }
  
    const response = await parseJSON(`${BASE_URL}/report/years/${companyId}`, options);
    return response.years as string[];
  }
}

export default new CompanyService();