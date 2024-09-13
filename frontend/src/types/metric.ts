export interface MetricDetails {
  metric_id: string;
  name: string;
  description: string;
  pillar: 'E' | 'S' | 'G';
  data_provider: string;
  unit: string;
  measurements: {
    measure_id: string;
    value: string;
    metric_year: string;
    reported_date: string;
    disclosure: 'A' | 'C' | 'E' | 'R';
  }[];
}