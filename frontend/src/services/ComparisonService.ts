import { CompanyRequest, ComparisonMetricsResponse } from '../types/comparison';
import { IndividualCompany } from '../types/comparison';
import { CompanyPDF, CompanyExcel } from '../types/company';

import { BACKEND_URL, parseJSON } from './helpers';

const BASE_URL = `${BACKEND_URL}/comparison`;

class ComparisonService {
  compareCompanies = async (data: CompanyRequest) => {
    try {
      const response = await fetch(`${BACKEND_URL}/comparison/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      return responseData.comparison as ComparisonMetricsResponse[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  searchCompanies = async (query: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    const searchParams = new URLSearchParams();
    searchParams.set('search_query', query);

    const response = await parseJSON(`${BASE_URL}/search?${searchParams.toString()}`, options);
    return response.companies as IndividualCompany[];
  };

  downloadComparisonPDF = async (data: CompanyRequest) => {
    try {
      const response = await fetch(`${BACKEND_URL}/comparison/report/pdf/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      return responseData as CompanyPDF;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  downloadComparisonExcel = async (data: CompanyRequest) => {
    try {
      const response = await fetch(`${BACKEND_URL}/comparison/report/excel/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      return responseData as CompanyExcel;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new ComparisonService();
