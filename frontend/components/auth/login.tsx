// components/auth/Login.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import Link from "next/link";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const { user, error: authError } = await AuthService.login({ email, password });
            
            if (authError) {
                setError(authError.message);
                return;
            }
            
            if (user) {
                router.push("/chat");
            }
        } catch (err: any) {
            console.error("AuthService login error:", err);
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-strong rounded-xl p-8 w-full max-w-md">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6c8eff] shadow-[0_0_12px_rgba(108,142,255,0.4)]" />
                    <span className="font-heading font-bold text-xl tracking-tight text-gradient">
                        Nexus AI
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">login</span>
                </Link>

                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Sign in to access your documents & citations.
                    </p>
                </div>

                {/* Form */}
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="text-sm font-medium text-foreground/80 mb-1 block">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@nexus.ai"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground/80 mb-1 block">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-muted-foreground cursor-pointer">
                            <input
                                type="checkbox"
                                className="accent-primary w-4 h-4 mr-2"
                                defaultChecked
                            />
                            Remember me
                        </label>
                        <a href="#" className="text-primary hover:text-accent hover:underline transition">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>

                {/* Social Login */}
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                    <div className="flex-1 h-px bg-border" />
                    <span>or continue with</span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 text-sm font-medium hover:bg-white/10 transition flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.478 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                        </svg>
                        Google
                    </button>
                    <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 text-sm font-medium hover:bg-white/10 transition flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.825.58C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                    </button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <a href="/register" className="text-primary hover:text-accent hover:underline transition">
                        Create one
                    </a>
                </p>
            </div>
        </div>
    );
}