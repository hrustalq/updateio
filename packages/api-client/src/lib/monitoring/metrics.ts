interface Labels {
  [key: string]: string | number;
}

class Counter {
  private value: number = 0;
  private labelValues: Map<string, number> = new Map();

  constructor(
    private name: string,
    private help: string,
    private labelNames: string[] = [],
  ) {}

  inc(labels?: Labels) {
    if (!labels) {
      this.value++;
      return;
    }

    const key = this.getLabelKey(labels);
    this.labelValues.set(key, (this.labelValues.get(key) || 0) + 1);
  }

  private getLabelKey(labels: Labels): string {
    return JSON.stringify(
      this.labelNames.map(name => labels[name] ?? '').sort(),
    );
  }

  getMetrics(): string {
    const lines = [
      `# HELP ${this.name} ${this.help}`,
      `# TYPE ${this.name} counter`,
    ];

    if (this.labelNames.length === 0) {
      lines.push(`${this.name} ${this.value}`);
    } else {
      this.labelValues.forEach((value, key) => {
        const labels = JSON.parse(key);
        const labelStr = this.labelNames
          .map((name, i) => `${name}="${labels[i] ?? ''}"`)
          .join(',');
        lines.push(`${this.name}{${labelStr}} ${value}`);
      });
    }

    return lines.join('\n');
  }
}

class Histogram {
  private labelValues: Map<string, number[]> = new Map();

  constructor(
    private name: string,
    private help: string,
    private bucketValues: number[],
    private labelNames: string[] = [],
  ) {}

  private getOrCreateBuckets(key: string): number[] {
    if (!this.labelValues.has(key)) {
      this.labelValues.set(key, Array(this.bucketValues.length).fill(0));
    }
    return this.labelValues.get(key)!;  // This is safe because we just set it if it didn't exist
  }

  observe(labels: Labels, value: number) {
    const key = this.getLabelKey(labels);
    const buckets = this.getOrCreateBuckets(key);

    for (let i = 0; i < this.bucketValues.length; i++) {
      if (!this.bucketValues[i]) {
        continue;
      } else {
        if (value <= this.bucketValues[i]! && buckets[i] !== undefined) {
          buckets[i]!++;
        }
      }
    }
  }

  private getLabelKey(labels: Labels): string {
    return JSON.stringify(
      this.labelNames.map(name => labels[name] ?? '').sort(),
    );
  }

  getMetrics(): string {
    const lines = [
      `# HELP ${this.name} ${this.help}`,
      `# TYPE ${this.name} histogram`,
    ];

    this.labelValues.forEach((buckets, key) => {
      const labels = JSON.parse(key);
      const baseLabels = this.labelNames
        .map((name, i) => `${name}="${labels[i] ?? ''}"`)
        .join(',');

      buckets.forEach((count, i) => {
        const le = this.bucketValues[i];
        const labelStr = baseLabels ? `${baseLabels},le="${le}"` : `le="${le}"`;
        lines.push(`${this.name}_bucket{${labelStr}} ${count}`);
      });
    });

    return lines.join('\n');
  }
}

class MetricsService {
  private pageLoadTime: Histogram;
  private apiRequestDuration: Histogram;
  private errorCount: Counter;
  private userInteractionCount: Counter;

  constructor() {
    this.pageLoadTime = new Histogram(
      'frontend_page_load_time_seconds',
      'Time taken to load pages',
      [0.1, 0.5, 1, 2, 5],
      ['route'],
    );

    this.apiRequestDuration = new Histogram(
      'frontend_api_request_duration_seconds',
      'Duration of API requests',
      [0.1, 0.5, 1, 2, 5],
      ['method', 'endpoint'],
    );

    this.errorCount = new Counter(
      'frontend_error_count_total',
      'Total number of frontend errors',
      ['type'],
    );

    this.userInteractionCount = new Counter(
      'frontend_user_interaction_count_total',
      'Total number of user interactions',
      ['type'],
    );
  }

  recordPageLoad(route: string, duration: number) {
    this.pageLoadTime.observe({ route }, duration);
  }

  recordApiRequest(method: string, endpoint: string, duration: number) {
    this.apiRequestDuration.observe({ method, endpoint }, duration);
  }

  recordError(type: string) {
    this.errorCount.inc({ type });
  }

  recordUserInteraction(type: string) {
    this.userInteractionCount.inc({ type });
  }

  async getMetrics(): Promise<string> {
    return [
      this.pageLoadTime.getMetrics(),
      this.apiRequestDuration.getMetrics(),
      this.errorCount.getMetrics(),
      this.userInteractionCount.getMetrics(),
    ].join('\n\n');
  }
}

export const metrics = new MetricsService(); 