import type { Metric, MetricType, MetricsResponse } from './types';

const parseLabels = (labelStr: string): Record<string, string> => {
  const labels: Record<string, string> = {};
  if (!labelStr) return labels;

  const pairs = labelStr.split(',');
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key && value) {
      labels[key.trim()] = value.replace(/"/g, '').trim();
    }
  });
  return labels;
};

const parseMetricLine = (line: string): { name: string; labels: Record<string, string>; value: number } | null => {
  const match = line.match(/^([^{]+)({([^}]+)})?\\s*(.+)$/);
  if (!match) return null;

  const [, name, , labelStr, value] = match;
  if (!name || !value) return null;

  return {
    name: name.trim(),
    labels: parseLabels(labelStr || ''),
    value: Number(value),
  };
};

export const parsePrometheusMetrics = (raw: string, metadata: MetricsResponse['metadata']): MetricsResponse => {
  const lines = raw.split('\n');
  const metrics: Metric[] = [];
  let currentMetric: Partial<Metric> = {};

  lines.forEach(line => {
    if (line.startsWith('# HELP')) {
      if (currentMetric.name) {
        metrics.push(currentMetric as Metric);
      }
      const [, name, ...helpParts] = line.split(' ');
      currentMetric = {
        name,
        help: helpParts.join(' '),
        values: [],
        type: 'counter', // Default type, will be updated by TYPE
      };
    } else if (line.startsWith('# TYPE')) {
      const [, name, type] = line.split(' ');
      if (currentMetric.name === name) {
        currentMetric.type = type as MetricType;
      }
    } else if (line && !line.startsWith('#')) {
      const parsed = parseMetricLine(line);
      if (parsed && currentMetric.values) {
        // For histogram metrics, we need to handle special cases
        if (currentMetric.type === 'histogram') {
          // Only add bucket, sum, and count metrics
          if (
            parsed.name.endsWith('_bucket') ||
            parsed.name.endsWith('_sum') ||
            parsed.name.endsWith('_count')
          ) {
            currentMetric.values.push({
              labels: parsed.labels,
              value: parsed.value,
            });
          }
        } else {
          currentMetric.values.push({
            labels: parsed.labels,
            value: parsed.value,
          });
        }
      }
    }
  });

  if (currentMetric.name) {
    metrics.push(currentMetric as Metric);
  }

  return {
    data: metrics,
    metadata,
  };
}; 