import { useCallback } from 'react';
import { metrics } from './metrics';

export function useTrackInteraction() {
  return useCallback((type: string) => {
    metrics.recordUserInteraction(type);
  }, []);
} 