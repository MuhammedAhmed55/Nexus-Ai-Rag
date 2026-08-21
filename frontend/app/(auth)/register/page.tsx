// app/page.tsx (Main page with both components)
import { Register } from "@/components/auth/register";

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <Register />
        </main>
    );
}