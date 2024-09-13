import { MetricDetails } from '../types/metric';
import { IndividualMetric } from '../types/comparison';

import { BACKEND_URL, parseJSON } from './helpers';

const BASE_URL = `${BACKEND_URL}/metrics`;

class MetricService {
  obtainMetrics = async (companyId: string, category: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    const response = await parseJSON(`${BASE_URL}/${companyId}/${category}`, options);
    return response.metrics as MetricDetails[];
  };

  obtainAllMetrics = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    const response = await parseJSON(`${BASE_URL}`, options);
    return response.metrics as IndividualMetric[];
  };

  obtainCategoryMetrics = async (category: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    const response = await parseJSON(`${BASE_URL}/${category}`, options);
    return response.metrics as MetricDetails[];
  };
}

export default new MetricService();
