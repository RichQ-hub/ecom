import { RegisterRequest, LoginRequest } from '../types/auth';
import { BACKEND_URL, parseJSON } from './helpers';

const BASE_URL = `${BACKEND_URL}/auth`;

class AuthService {
  register = async (data: RegisterRequest) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    const response = await parseJSON(`${BASE_URL}/register`, options);
    return response;
  };

  login = async (data: LoginRequest) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    const response = await parseJSON(`${BASE_URL}/login`, options);
    return response;
  };
}

export default new AuthService();
