export interface FrameworkDetails {
  framework_id: string;
  name: string;
  type: 'SAVED' | 'DEFAULT';
  date_created: string
}

export interface FrameworkRequest {
  name: string;
  framework_id: string;
  categories: {
    category: string;
    weight: number;
  }[];
  metrics: {
    metric_id: string;
    weight: number;
  }[];
};

export interface FrameworkScores {
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

export interface FrameworkLiveScores {
  scores: {
    environmental: {
      year: number;
      score: number;
    }[];
    social: {
      year: number;
      score: number;
    }[];
    governance: {
      year: number;
      score: number;
    }[];
    total: {
      year: number;
      score: number;
    }[]
  }
}
