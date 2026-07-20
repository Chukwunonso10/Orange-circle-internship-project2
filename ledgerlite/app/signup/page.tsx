"use client";

import { useState } from "react";
import HomeNav from "@/components/homeNav";
import Footer from "@/components/footer";
import Link from "next/link";
import Image from "next/image";

import {
  CheckCircle2,
  Loader2,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  // form  input validation
  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      nextErrors.name = "User name is required.";
    }
    if (!form.businessName.trim()) {
      nextErrors.businessName = "Business name is required.";
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Create a password.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  };
  //  inputs handler
  const handleChange = (field: string, value: string) => {
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

  // visible confirm-password function and state for confirm-password
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const handleVisiblePasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  // form handle submit
  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("error");
      setMessage("Please fix the highlighted fields and try again.");
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
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          buisnessName: form.businessName,
          name: form.name,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      router.push("/dashboard")
      setStatus("success");
      setMessage("Your account has been created successfully. Welcome aboard!");
      // form input functionalities should be here
      setForm({
        name: "",
        businessName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again in a moment.");
    }
  };

  return (
    <div>
      <nav>
        {" "}
        <HomeNav />
      </nav>
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900  sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">
          {/* header */}
          <section className="rounded-4xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm  lg:w-1/2">
            <div className="mb-8">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#e4f5ed] px-4 py-2 text-sm font-medium text-[#02ad5e]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#b6edd3] text-[#028d5e] ">
                  <ShieldCheck size={16} />
                </span>
                Secure account setup
              </p>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                Create your LedgerLite account
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 ">
                Start managing your finances with a modern, secure dashboard.
                Complete the form and get instant access to your free signup
                experience.
              </p>
            </div>

            <div className="relative h-50 w-full sm:h-60">
              <Image
                src="/signupImg.jpg"
                alt="Dashboard preview"
                fill
                loading="eager"
                className="object-cover py-4"
                sizes="(max-width: 568px) 100vw, 50vw"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-100 p-5 ">
                <p className="text-lg font-semibold">Fast activation</p>
                <p className="mt-2 text-sm text-slate-600 ">
                  Get started quickly with an intuitive setup flow and instant
                  account creation.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-5 ">
                <p className="text-lg font-semibold">Trusted security</p>
                <p className="mt-2 text-sm text-slate-600 ">
                  Your data is protected by modern validation and strong
                  password policies.
                </p>
              </div>
            </div>
          </section>

          <section className="relative mx-auto w-full max-w-xl rounded-4xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm   lg:w-1/2">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Sign up
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  Create your account
                </h2>
              </div>
              <div className="rounded-3xl text-center bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 ">
                3 mins setup
              </div>
            </div>
            {/* error state handling */}
            {status === "error" && (
              <div className="mb-6 rounded-3xl border border-rose-200/70 bg-rose-50/80 p-4 text-rose-700  ">
                <p className="font-semibold">Unable to submit</p>
                <p className="mt-1 text-sm">
                  {message || "Please correct the highlighted fields."}
                </p>
              </div>
            )}
            {/* success state handling */}
            {status === "success" && (
              <div className="mb-6 rounded-3xl border border-emerald-200/70 bg-emerald-50/80 p-4 text-emerald-700 ">
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ">
                    <CheckCircle2 size={18} />
                  </span>
                  <div>
                    <p className="font-semibold">Account created</p>
                    <p className="mt-1 text-sm">{message}</p>
                  </div>
                </div>
              </div>
            )}
            {/* user sign up form */}
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 "
              >
                User name
                <div className="mt-2">
                  <input
                    id="name"
                    autoComplete="name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      handleChange("name", event.target.value)
                    }
                    className={`w-full rounded-3xl border px-4 py-3 text-slate-900 outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-sky-200 ${
                      errors.name
                        ? "border-rose-400 ring-rose-200 focus:border-rose-500 focus:ring-rose-200"
                        : "border-slate-200"
                    }`}
                    placeholder="John Doe"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-rose-600 " id="name-error">
                      {errors.name}
                    </p>
                  )}
                </div>
              </label>

              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-slate-700 "
              >
                Business name
                <div className="mt-2">
                  <input
                    id="businessName"
                    autoComplete="business-Name"
                    type="text"
                    value={form.businessName}
                    onChange={(event) =>
                      handleChange("businessName", event.target.value)
                    }
                    className={`w-full rounded-3xl border px-4 py-3 text-slate-900 outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-sky-200   ${
                      errors.businessName
                        ? "border-rose-400 ring-rose-200 focus:border-rose-500 focus:ring-rose-200"
                        : "border-slate-200"
                    }`}
                    placeholder="Circo Orange Enterprise"
                    aria-invalid={!!errors.businessNameame}
                    aria-describedby={
                      errors.businessName ? "businessName-error" : undefined
                    }
                  />
                  {errors.businessName && (
                    <p
                      className="mt-2 text-sm text-rose-600 dark:text-rose-300"
                      id="name-error"
                    >
                      {errors.businessName}
                    </p>
                  )}
                </div>
              </label>

              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 "
              >
                Email address
                <div className="mt-2 flex relative">
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
                    className={`w-full rounded-3xl border px-10 py-3 text-slate-900 outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-sky-200 ${
                      errors.email
                        ? "border-rose-400 ring-rose-200 focus:border-rose-500 focus:ring-rose-200"
                        : "border-slate-200"
                    }`}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                <div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-rose-600 " id="email-error">
                      {errors.email}
                    </p>
                  )}
                </div>
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
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
                      autoComplete="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(event) =>
                        handleChange("password", event.target.value)
                      }
                      className={`w-full rounded-3xl border px-12 py-3 text-slate-900 outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-sky-200 ${
                        errors.password
                          ? "border-rose-400 ring-rose-200 focus:border-rose-500 focus:ring-rose-200"
                          : "border-slate-200"
                      }`}
                      placeholder="Create password"
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                    />
                    <div
                      onClick={handleVisiblePassword}
                      className="absolute  bottom-[25%] left-[85%] cursor-pointer"
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

                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 "
                >
                  Confirm password
                  <div className="mt-2 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                      <Lock size={16} />
                    </div>
                    <input
                      id="confirmPassword"
                      autoComplete="confirmPassword"
                      type={showPasswordConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(event) =>
                        handleChange("confirmPassword", event.target.value)
                      }
                      className={`w-full rounded-3xl border px-12 py-3 text-slate-900 outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-sky-200  ${
                        errors.confirmPassword
                          ? "border-rose-400 ring-rose-200 focus:border-rose-500 focus:ring-rose-200"
                          : "border-slate-200"
                      }`}
                      placeholder="Confirm password"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirmPassword-error"
                          : undefined
                      }
                    />

                    <div
                      onClick={handleVisiblePasswordConfirm}
                      className="absolute  bottom-[25%] left-[85%] cursor-pointer"
                    >
                      {/* show password icon and function */}
                      {showPasswordConfirm ? (
                        <Eye className="h-5 w-4 text-gray-500" />
                      ) : (
                        <EyeOff className="h-5 w-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                  {errors.confirmPassword && (
                    <p
                      className="mt-2 text-sm text-rose-600 "
                      id="confirmPassword-error"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-[#0b7a75] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:bg-slate-400   cursor-pointer"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 ">
              By signing up, you agree to our{" "}
              <span className="font-medium px-1 text-slate-900 ">
                Terms of Service
              </span>
              and
              <span className="font-medium px-1 text-slate-900 ">
                Privacy Policy
              </span>
            </p>

            <p className=" text-center text-sm text-slate-500 ">
              Already have an account?
              <span className="font-bold text-[#0B7A75] px-1 ">
                <Link href="/signin">Sign In</Link>
              </span>
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
