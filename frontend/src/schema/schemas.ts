interface MetricsResponse {
  metrics: [{
    metric_id: string;
    name: string;
    description: string;
    pillar: 'E' | 'S' | 'G';
    data_provider: string;
    unit: string;
    measurements: [{
      measure_id: string;
      value: string;
      metric_year: string;
      reported_date: string;
      disclosure: 'REPORTED' | 'CALCULATED' | 'ESTIMATED';
      metric_period: string;
    }]
  }]
}

interface CompaniesRequest {
  search_query: string;
  sort: number;
  headquarter_country: [string];
  industry: [string];
}

interface CompaniesResponse {
  companies: [{
    perm_id: string;
    name: string;
    industry: string;
    headquarter_country: string;
    nb_points_of_observation: number;
    isin_codes: [string];
  }]
}

interface FrameworkCreateRequest {
  name: string;
  categories: [{
    category: string;
    weight: number;
  }];
  metrics: [{
    metric_id: string;
    weight: number;
  }]
}

interface FrameworkCreateResponse {
  framework_id: number;
}

interface FrameworkUpdateRequest {
  name: string;
  categories: [{
    category: string;
    weight: number;
  }];
  metrics: [{
    metric_id: string;
    weight: number;
  }]
}

interface FrameworkListAllRequest {
  search_query: string;
  sort: number;
}

interface FrameworkListAllResponse {
  framework_id: number;
  name: string;
  type: 'DEFAULT' | 'SAVED';
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface EsgScoreResponse {
  framework: {
    name: string;
    categoryWeightings: {
      environmental: number;
      social: number;
      governance: number;
    },
    metricWeightings: {
      name: string;
      category: 'E' | 'S' | 'G';
      weight: number;
      unit: string;
      value: number;
      scaled_value: number;
    }[],
  },
  scores: {
    total: number;
    environmental: {
      value: number;
      industryMean: number;
    },
    social: {
      value: number;
      industryMean: number;
    },
    governance: {
      value: number;
      industryMean: number;
    },
  }
}