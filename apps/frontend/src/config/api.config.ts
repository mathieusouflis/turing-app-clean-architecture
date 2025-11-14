const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const apiConfig = {
  baseUrl: API_URL,

  endpoints: {
    turingMachine: {
      base: "/turing-machines",
      byId: (id: string) => `/turing-machines/${id}`,
      run: (id: string) => `/turing-machines/${id}/run`,
      step: (id: string) => `/turing-machines/${id}/step`,
    },
  },
} as const;

export type ApiConfig = typeof apiConfig;
