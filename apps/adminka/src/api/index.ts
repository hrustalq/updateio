import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
