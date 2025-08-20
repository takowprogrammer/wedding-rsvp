"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();
    const params = useSearchParams();
    const from = params.get('from') || '/admin';
    const handleLogin = async () => {
        // Demo: set a cookie via fetch to an API route or using document.cookie
        document.cookie = `admin_token=dummy; path=/; max-age=86400`;
        router.replace(from);
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white rounded-xl shadow p-8 w-full max-w-sm">
                <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
                <p className="text-sm text-gray-600 mb-4">Demo login. Replace with real auth later.</p>
                <button onClick={handleLogin} className="w-full py-2 rounded bg-blue-600 text-white">Login</button>
            </div>
        </div>
    );
} 