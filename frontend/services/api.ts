// centralized API client pointing to FastAPI
import { createClient } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function getAuthHeader(): Promise<Record<string, string>> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // No session yet (logged out) — request goes out without a token and
    // the backend's get_current_user will correctly reject it with 401.
    if (!session?.access_token) return {};

    return { Authorization: `Bearer ${session.access_token}` };
}

export class ApiClient {
    static async get(endpoint: string, options: RequestInit = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    static async delete(endpoint: string, options: RequestInit = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    static async post(endpoint: string, data?: any, options: RequestInit = {}) {
        const headers = options.headers ? new Headers(options.headers) : new Headers();

        let body;
        if (data instanceof FormData) {
            body = data;
            // browser sets correct multipart boundary when Content-Type is missing
            headers.delete('Content-Type');
        } else {
            body = JSON.stringify(data);
            if (!headers.has('Content-Type')) {
                headers.set('Content-Type', 'application/json');
            }
        }

        return this.request(endpoint, {
            ...options,
            method: 'POST',
            headers,
            body
        });
    }

    private static async request(endpoint: string, options: RequestInit) {
        try {
            const url = `${API_URL}${endpoint}`;

            // Every request — GET or POST — now carries the current user's
            // Supabase access token, so the backend can resolve who's calling.
            const authHeader = await getAuthHeader();
            const headers = new Headers(options.headers);
            Object.entries(authHeader).forEach(([key, value]) => headers.set(key, value));

            const response = await fetch(url, { ...options, headers });

            let data;
            try {
                data = await response.json();
            } catch (err) {
                data = null;
            }

            if (!response.ok) {
                const error = new Error(data?.detail || response.statusText);
                (error as any).status = response.status;
                (error as any).data = data;
                throw error;
            }

            return { data, error: null };
        } catch (error: any) {
            return { data: null, error };
        }
    }
}