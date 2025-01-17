import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { useMetrics } from '@repo/api-client';
import PageTitle from '@/components/PageTitle';
import { Skeleton } from '@repo/ui/components/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Route = createLazyFileRoute('/metrics')({
  component: RouteComponent,
});

function MetricCard({ title, description, value, type, chart = false, data = [] }: {
  title: string;
  description: string;
  value: number | string;
  type: string;
  chart?: boolean;
  data?: Array<{ timestamp: string; value: number }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs font-normal text-muted-foreground">{type}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {chart && data.length > 0 && (
          <div className="h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => [value.toFixed(2), '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RouteComponent() {
  const { data: rawMetrics, isLoading } = useMetrics();

  const formatMetrics = (metrics: typeof rawMetrics) => {
    if (!metrics?.data) return [];

    return metrics.data.map(metric => {
      const helpParts = metric.help?.split(' ') || [];
      const metricName = helpParts[0] || metric.name.toLowerCase();
      const description = helpParts.length > 1 ? helpParts.slice(1).join(' ') : metric.help || '';

      return {
        id: metricName,
        name: metricName,
        description,
        type: metric.type,
        value: metric.values[0]?.value || 0,
        data: metric.values.map((v, i) => ({
          timestamp: new Date(Date.now() - (i * 5000)).toISOString(),
          value: v.value,
        })).reverse(),
      };
    });
  };

  const metrics = formatMetrics(rawMetrics);

  const renderRawMetrics = () => {
    if (!rawMetrics?.data) return null;

    return rawMetrics.data.map(metric => {
      const helpParts = metric.help?.split(' ') || [];
      const metricName = helpParts[0] || metric.name.toLowerCase();
      const description = helpParts.length > 1 ? helpParts.slice(1).join(' ') : metric.help || '';

      return [
        `# HELP ${metricName} ${description}`,
        `# TYPE ${metricName} ${metric.type}`,
        ...metric.values.map(value => {
          const labels = Object.entries(value.labels)
            .map(([key, val]) => `${key}="${val}"`)
            .join(',');
          return labels
            ? `${metricName}{${labels}} ${value.value}`
            : `${metricName} ${value.value}`;
        }),
        '' // Empty line between metrics
      ];
    }).flat().join('\n');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 w-full container mx-auto max-w-screen-2xl p-8 gap-8">
        <PageTitle
          title="Метрики"
          description="Мониторинг производительности и использования системы"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[240px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full container mx-auto max-w-screen-2xl p-8 gap-8">
      <PageTitle
        title="Метрики"
        description="Мониторинг производительности и использования системы"
      />

      <Tabs defaultValue="system" className="w-full">
        <TabsList>
          <TabsTrigger value="system">Система</TabsTrigger>
          <TabsTrigger value="business">Бизнес-метрики</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics
              .filter(m => m.name.startsWith('nodejs_') || m.name.startsWith('process_'))
              .map(metric => (
                <MetricCard
                  key={metric.id}
                  title={metric.name}
                  description={metric.description}
                  value={metric.type === 'gauge' ? metric.value.toFixed(2) : metric.value.toString()}
                  type={metric.type}
                  chart={true}
                  data={metric.data}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics
              .filter(m => !m.name.startsWith('nodejs_') && !m.name.startsWith('process_'))
              .map(metric => (
                <MetricCard
                  key={metric.id}
                  title={metric.name}
                  description={metric.description}
                  value={metric.type === 'gauge' ? metric.value.toFixed(2) : metric.value.toString()}
                  type={metric.type}
                  chart={true}
                  data={metric.data}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="raw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Raw Metrics</CardTitle>
              <p className="text-sm text-muted-foreground">Raw Prometheus metrics data</p>
            </CardHeader>
            <CardContent>
              <pre className="font-mono text-sm whitespace-pre-wrap bg-muted p-4 rounded-md overflow-auto max-h-[480px]">
                {renderRawMetrics()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 