export type MetricType = 'counter' | 'gauge' | 'histogram';

export interface MetricValue {
  value: number;
  labels: Record<string, string>;
}

export interface Metric {
  name: string;
  help: string;
  type: MetricType;
  values: MetricValue[];
}

export interface MetricsResponse {
  data: Metric[];
  metadata: {
    timestamp: string;
    path: string;
    version: string;
  };
}