export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface LoginPayload {
    email: string;
    password?: string;
}

export interface RegisterPayload {
    email: string;
    password?: string;
    name: string;
}

export interface AuthResponse {
    user: { id: string; email: string } | null;
    profile: Profile | null;
    error: Error | null;
}
