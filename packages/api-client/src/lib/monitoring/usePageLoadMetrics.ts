import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import { metrics } from './metrics';

export function usePageLoadMetrics() {
  const location = useLocation();

  useEffect(() => {
    const startTime = performance.now();

    const cleanup = () => {
      const duration = (performance.now() - startTime) / 1000; // Convert to seconds
      metrics.recordPageLoad(location.pathname, duration);
    };

    // Record metrics when component unmounts or route changes
    return cleanup;
  }, [location.pathname]);
} 