"use client";

import { useState } from "react";
import HomeNav from "@/components/homeNav";
import Footer from "@/components/footer";
import Image from "next/image";

import Link from "next/link";
import {
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  // form input validations
  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    return nextErrors;
  };
  // form input handler
  const handleChange = (field: string, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  };

  // visible password function and state for password
  const [showPassword, setShowPassword] = useState(false);
  const handleVisiblePassword = () => {
    setShowPassword(!showPassword);
  };
  //  form handle submit
  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("error");
      setMessage("Please fix the fields marked in red and try again.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      console.log(data);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus("success");
      setMessage("Welcome back! Redirecting to your dashboard...");
      // form funtionalities
    } catch (error) {
      setStatus("error");
      setMessage("Unable to sign in right now. Please try again later.");
    }
  };

  return (
    <div>
      <nav>
        <HomeNav />
      </nav>
      <main className="min-h-screen  px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center">
          <section className="flex-1 rounded-4xl p-8 text-slate-100 shadow-2xl   lg:p-12">
            <div className="flex items-center gap-3 rounded-full bg-[#e4f5ed] px-4 py-2 text-sm text-[#02ad5e] shadow-sm shadow-sky-500/10">
              <ShieldCheck size={18} />
              Sign in for your finance workspace
            </div>
            <div className="mt-10 space-y-6">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
                  Welcome back.
                </h1>
                <p className="mt-4 max-w-xl text-slate-900 sm:text-lg">
                  Sign in to access your dashboard, review sales, manage
                  expenses, and stay on top of your cash flow.
                </p>
              </div>
              <div className="relative h-50 w-full sm:h-60">
                <Image
                  src="/signinImg.jpg"
                  alt="Dashboard preview"
                  fill
                  loading="eager"
                  className="object-cover py-4"
                  sizes="(max-width: 568px) 100vw, 50vw"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border bg-slate-100  p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-700">
                    Fast access
                  </p>
                  <p className="mt-3 text-lg font-medium text-slate-700">
                    Quick sign in, no friction.
                  </p>
                </div>
                <div className="rounded-[28px] bg-slate-100 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-700">
                    Protected
                  </p>
                  <p className="mt-3 text-lg font-medium text-slate-700">
                    Built with secure validation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full max-w-xl rounded-4xl bg-white p-8 shadow-2xl   lg:w-1/2 lg:p-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 ">
                  Sign in
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900 ">
                  Access your account
                </h2>
              </div>
              <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 ">
                User
              </div>
            </div>

            {status === "error" && (
              <div className="mb-6 rounded-3xl border border-rose-200/80 bg-rose-50/80 p-4 text-rose-700 ">
                <p className="font-semibold">Sign in failed</p>
                <p className="mt-1 text-sm">
                  {message || "Please correct the errors and try again."}
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="mb-6 rounded-3xl border border-emerald-200/80 bg-emerald-50/80 p-4 text-emerald-700 ">
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ">
                    <CheckCircle2 size={18} />
                  </span>
                  <div>
                    <p className="font-semibold">Signed in successfully</p>
                    <p className="mt-1 text-sm">{message}</p>
                  </div>
                </div>
              </div>
            )}
            {/* user sign in form */}
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 "
              >
                Email address
                <div className="mt-2 relative">
                  <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    id="email"
                    autoComplete="email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      handleChange("email", event.target.value)
                    }
                    className={`w-full rounded-3xl border px-12 py-3 text-slate-900 outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-sky-200   ${
                      errors.email
                        ? "border-rose-400 ring-rose-200 focus:border-rose-500 focus:ring-rose-200"
                        : "border-slate-200"
                    }`}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-rose-600 " id="email-error">
                    {errors.email}
                  </p>
                )}
              </label>

              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 "
              >
                Password
                <div className="mt-2 relative">
                  <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    id="password"
                    autoCorrect="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) =>
                      handleChange("password", event.target.value)
                    }
                    autoComplete="Yes"
                    className={`w-full rounded-3xl border px-12 py-3 text-slate-900 outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-sky-200  ${
                      errors.password
                        ? "border-rose-400 ring-rose-200 focus:border-rose-500 focus:ring-rose-200"
                        : "border-slate-200"
                    }`}
                    placeholder="Enter your password"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />

                  <div
                    onClick={handleVisiblePassword}
                    className="absolute  bottom-[25%] left-[90%] cursor-pointer"
                  >
                    {/* show password icon and function */}
                    {showPassword ? (
                      <Eye className="h-5 w-4 text-gray-500" />
                    ) : (
                      <EyeOff className="h-5 w-4 text-gray-500" />
                    )}
                  </div>
                </div>
                {errors.password && (
                  <p
                    className="mt-2 text-sm text-rose-600 "
                    id="password-error"
                  >
                    {errors.password}
                  </p>
                )}
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-600 ">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(event) =>
                      handleChange("remember", event.target.checked)
                    }
                    className="accent-[#0B7A75]  h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-sky-500"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-slate-500 transition hover:text-slate-900 "
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-[#0B7A75] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:bg-slate-400 "
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 ">
              Don’t have an account?{" "}
              <Link href="/signup">
                <span className="font-semibold text-[#0B7A75] ">
                  Create one now
                </span>
                .
              </Link>
            </p>
          </section>
        </div>
      </main>
      <div>
        <Footer />
      </div>
    </div>
  );
}
