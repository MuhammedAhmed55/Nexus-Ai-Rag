import { createClient } from "@/lib/supabase/client";
import { LoginPayload, RegisterPayload, AuthResponse, Profile } from "@/types/auth";

export class AuthService {
    /**
     * Log in a user with email and password
     */
    static async login(payload: LoginPayload): Promise<AuthResponse> {
        const supabase = createClient();
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: payload.email,
                password: payload.password || "",
            });

            if (error) throw error;

            let profile = null;
            if (data.user) {
                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", data.user.id)
                    .single();
                
                profile = profileData as Profile;
            }

            return {
                user: data.user ? { id: data.user.id, email: data.user.email! } : null,
                profile,
                error: null
            };
        } catch (error: any) {
            return {
                user: null,
                profile: null,
                error,
            };
        }
    }

    /**
     * Register a new user with email and password, and create a profile
     */
    static async register(payload: RegisterPayload): Promise<AuthResponse> {
        const supabase = createClient();
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: payload.email,
                password: payload.password || "",
                options: {
                    data: {
                        full_name: payload.name,
                    }
                }
            });

            if (error) throw error;

            let profile = null;
            
            // If email confirmation is off, data.user is available immediately
            if (data.user) {
                // Check if profile exists (sometimes handled by postgres trigger)
                const { data: existingProfile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", data.user.id)
                    .single();
                
                if (existingProfile) {
                    profile = existingProfile;
                } else {
                    // Manually create profile if trigger doesn't exist
                    const { data: newProfile, error: profileError } = await supabase
                        .from("profiles")
                        .insert([
                            {
                                id: data.user.id,
                                email: payload.email,
                                full_name: payload.name,
                            }
                        ])
                        .select()
                        .single();
                    
                    if (!profileError) {
                        profile = newProfile;
                    }
                }
            }

            return {
                user: data.user ? { id: data.user.id, email: data.user.email! } : null,
                profile,
                error: null
            };
        } catch (error: any) {
            return {
                user: null,
                profile: null,
                error,
            };
        }
    }

    /**
     * Log out the current user
     */
    static async logout(): Promise<{ error: Error | null }> {
        const supabase = createClient();
        try {
            const { error } = await supabase.auth.signOut();
            return { error };
        } catch (error: any) {
            return { error };
        }
    }

    /**
     * Get the current authenticated user and profile
     */
    static async getUser(): Promise<AuthResponse> {
        const supabase = createClient();
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) throw userError || new Error("No user found");

            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profileError) throw profileError;

            return {
                user: { id: user.id, email: user.email! },
                profile: profileData as Profile,
                error: null
            };
        } catch (error: any) {
            return {
                user: null,
                profile: null,
                error,
            };
        }
    }
}
