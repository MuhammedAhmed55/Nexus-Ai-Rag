// app/page.tsx (Main page with both components)
import { Login } from "@/components/auth/login";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <Login />
        </main>
    );
}