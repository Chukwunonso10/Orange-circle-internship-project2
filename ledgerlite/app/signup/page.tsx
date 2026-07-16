"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, seterror] = useState("");
    

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
      
        if (loading) return;
      
        setLoading(true);
        seterror("");
      
        try {
          const res = await fetch("/api/sign-up", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
      
          const data = await res.json();
      
          if (!res.ok) {
            throw new Error(data.message || "Unable to create account.");
          }
      
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          });
      
          router.replace("/signin");
        } catch (err) {
          if (err instanceof Error) {
            seterror(err.message);
          } else {
            seterror("Something went wrong.");
          }
        } finally {
          setLoading(false);
        }
      }
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-center text-3xl font-bold">
                    Create Account
                </h1>

                <p className="mb-6 text-center text-gray-500">
                    Fill in your information below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="rounded-md border p-3 outline-none focus:border-blue-500"
                            required
                        />

                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="rounded-md border p-3 outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-md border p-3 outline-none focus:border-blue-500"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded-md border p-3 outline-none focus:border-blue-500"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/signin" className="font-semibold text-blue-600 hover:underline">
                        Sign In
                    </a>
                </p>
            </div>
        </main>
    );
}