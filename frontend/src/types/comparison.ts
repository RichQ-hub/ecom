export interface CompanyRequest {
  companies: string[];
  metrics: string[];
  year: number;
}

interface Metric {
  metric_id: string;
  metric_name: string;
  pillar: 'E' | 'S' | 'G';
  value: number;
}

export interface ComparisonMetricsResponse {
  perm_id: string;
  name: string;
  metrics: Metric[];
}

export interface IndividualCompany {
  perm_id: string;
  name: string;
}

export interface IndividualMetric {
  metric_id: string;
  metric_name: string;
  desciption: string;
  unit: string;
  pillar: 'E' | 'S' | 'G';
}
