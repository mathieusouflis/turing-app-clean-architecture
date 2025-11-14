const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const hasBody = options?.body !== undefined && options?.body !== null;
    const headers: HeadersInit = {
        ...(hasBody && { 'Content-Type': 'application/json' }),
        ...options?.headers,
    };
    
    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            try {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
            } catch {
                throw new Error(`API error: ${response.status}`);
            }
        }

        return response.json();
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage?.includes('ERR_CONNECTION') || errorMessage?.includes('Failed to fetch')) {
            throw new Error('Backend server is not available. Please make sure the backend is running on port 8080.');
        }
        throw error;
    }
}