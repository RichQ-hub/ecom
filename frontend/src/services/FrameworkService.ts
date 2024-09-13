import { FrameworkDetails, FrameworkLiveScores, FrameworkRequest, FrameworkScores } from '../types/framework';
import { BACKEND_URL, parseJSON } from './helpers';

const BASE_URL = `${BACKEND_URL}/framework`;
const TOKEN = localStorage.getItem('token') ? (localStorage.getItem('token') as string) : '';

class FrameworkService {
  searchFrameworks = async (token: string, query: string, sort: string) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      }
    }

    const searchParams = new URLSearchParams();
    searchParams.set('search_query', query);
    searchParams.set('sort', sort);

    const response = await parseJSON(`${BASE_URL}/list-all?${searchParams.toString()}`, options);
    return response.frameworks as FrameworkDetails[];
  }

  create = async (token: string, data: FrameworkRequest) => {
    try {
      const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  edit = async (token: string, frameworkId: string, data: FrameworkRequest) => {
    try {
      
      const response = await fetch(`${BASE_URL}/update/${Number(frameworkId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  delete = async (token: string, frameworkId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/remove/${Number(frameworkId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateView = async (token: string, frameworkId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/update_view/${Number(frameworkId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  frameworkScores = async (token: string, frameworkId: string, companyId: string) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      }
    }
    const response = await parseJSON(`${BASE_URL}/scores/${frameworkId}/${companyId}`, options);
    return response as FrameworkScores;
  }

  frameworkLiveScores = async (token: string, frameworkId: string, companyId: string) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      }
    }
    const response = await parseJSON(`${BASE_URL}/livescores/${frameworkId}/${companyId}`, options);
    return response as FrameworkLiveScores;
  }

}

export default new FrameworkService();