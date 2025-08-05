"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LoginPage() {
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      setMessage(data.message || "Login failed");
    } else {
      setMessage("Login success!");
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            defaultValue="super@gmail.com"
            name="email"
            type="email"
            required
            className="w-full border px-4 py-2 rounded-md"
          />
          <input
            defaultValue="12345678"
            name="password"
            type="password"
            required
            className="w-full border px-4 py-2 rounded-md"
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
          {message && (
            <p className="text-red-500 text-center mt-2">{message}</p>
          )}
        </form>

        <div className="my-6 text-center text-sm text-gray-500 relative">
          <span className="px-2 bg-white relative z-10">OR</span>
          <div className="absolute left-0 right-0 top-2 border-b z-0" />
        </div>

        <a
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/google`}
          className="w-full block"
        >
          <Button type="button" variant="outline" className="w-full">
            Continue with Google
          </Button>
        </a>

         <div className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Create one
          </a>
        </div>
      </div>
    </div>
  );
}
