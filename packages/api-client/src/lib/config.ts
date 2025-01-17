import { createContext, useContext } from 'react';

export interface ApiConfig {
  baseURL: string;
}

const ApiConfigContext = createContext<ApiConfig | null>(null);

export function useConfig(): ApiConfig {
  const config = useContext(ApiConfigContext);
  
  if (!config) {
    throw new Error('useConfig must be used within an ApiConfigProvider');
  }
  
  return config;
}

export const ApiConfigProvider = ApiConfigContext.Provider; 