const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiConfig = {
  baseUrl: API_URL,

  endpoints: {
    turingMachine: {
      base: "/api/turing-machines",
      byId: (id: string) => `/api/turing-machines/${id}`,
      execute: (id: string) => `/api/turing-machines/${id}/execute`,
    },
  },
} as const;

export type ApiConfig = typeof apiConfig;
