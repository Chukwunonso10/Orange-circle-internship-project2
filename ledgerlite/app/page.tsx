import Image from "next/image";
import HomeNav from "@/components/homeNav";
import Footer from "@/components/footer";
import Link from "next/link";

const features = [
  {
    title: "Real-time analytics",
    description:
      "Track revenue, expenses, and inventory with intuitive dashboards that update instantly.",
  },
  {
    title: "Automated workflows",
    description:
      "Save time with automation that simplifies reconciliation and reporting.",
  },
  {
    title: "Team collaboration",
    description:
      "Invite your finance team and keep everyone aligned on budgets and performance.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <HomeNav />

      <main className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/3 rounded-full bg-[#0B7A75]/20 blur-3xl opacity-80" />
        <div className="absolute right-0 top-20 h-72 w-72 translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl opacity-70" />

        <section className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center lg:gap-20 lg:px-10">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0B7A75]/10 px-4 py-2 text-sm text-[#0B7A75] shadow-sm shadow-[#0B7A75]/20">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#0B7A75] animate-pulse" />
              Finance operations built around your workflow
            </div>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
                Modern finance management for business that want clarity, speed,
                and control.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
                LedgerLite brings every part of your sales, expense, and
                inventory process into one polished workspace with automated
                insights and clean reporting.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#0B7A75] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#0B7A75]/30 transition hover:-translate-y-0.5 hover:bg-[#0d8d84] sm:w-auto"
              >
                Start free trial
              </Link>
              <Link
                href="/signin"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-[#0B7A75] hover:text-[#0B7A75] sm:w-auto"
              >
                Sign in
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 px-5 py-6 text-center backdrop-blur-xl">
                <p className="text-3xl font-semibold text-white">120+</p>
                <p className="mt-2 text-sm text-slate-400">Trusted teams</p>
              </div>
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 px-5 py-6 text-center backdrop-blur-xl">
                <p className="text-3xl font-semibold text-white">35%</p>
                <p className="mt-2 text-sm text-slate-400">
                  Faster close cycle
                </p>
              </div>
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 px-5 py-6 text-center backdrop-blur-xl">
                <p className="text-3xl font-semibold text-white">24/7</p>
                <p className="mt-2 text-sm text-slate-400">
                  Support availability
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-3xl lg:mx-0">
            <div className="absolute -right-10 top-10 h-32 w-32 rounded-full bg-[#0B7A75]/15 blur-2xl" />
            <div className="absolute left-0 top-10 h-24 w-24 rounded-full bg-slate-50/10 blur-2xl" />
            <div className="overflow-hidden rounded-[40px] border border-slate-800/80 bg-slate-900 shadow-2xl shadow-slate-950/30">
              <div className="relative h-130 w-full sm:h-140">
                <Image
                  src="/SmartMoneyMoves.jpg"
                  alt="Dashboard preview"
                  fill
                  loading="eager"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="border-t border-slate-800/60 bg-slate-950/90 px-6 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/90 p-4 shadow-inner shadow-slate-950/20 transition-transform duration-500 hover:-translate-y-1">
                    <p className="text-sm text-slate-400">Weekly spend</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      $48.3K
                    </p>
                  </div>
                  <div className="rounded-3xl bg-[#0B7A75]/10 p-4 text-[#0B7A75] transition-transform duration-500 hover:-translate-y-1">
                    <p className="text-sm">Saved from automation</p>
                    <p className="mt-2 text-2xl font-semibold">18%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl space-y-10 px-6 pb-16 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-[28px] border border-slate-800/80 bg-slate-900/80 p-8 transition hover:-translate-y-1 hover:border-[#0B7A75] hover:bg-slate-950/80"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B7A75]/15 text-[#0B7A75] shadow-sm shadow-[#0B7A75]/20 transition group-hover:bg-[#0B7A75]/20">
                  <span className="text-lg font-semibold">✓</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-4 text-slate-400">{feature.description}</p>
              </article>
            ))}
          </div>

          <div className="overflow-hidden rounded-[40px] bg-[#0B7A75] p-8 shadow-2xl shadow-[#0B7A75]/10 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white">
                  Trusted by modern businesses and start-up
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                  Scale finance operations without complexity.
                </h2>
                <p className="mt-4 max-w-xl text-slate-300">
                  Whether you are a startup or a growing enterprise, LedgerLite
                  helps you stay ahead with clear workflows and intelligent
                  dashboards.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-gray-200  p-6 text-[#0B7A75] shadow-lg shadow-slate-950/20 transition hover:-translate-y-1">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#0B7A75]">
                    Revenue
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-[#0B7A75]">
                    $2.1M
                  </p>
                </div>
                <div className="rounded-3xl bg-gray-200 p-6 text-[#0B7A75] shadow-lg shadow-slate-950/20 transition hover:-translate-y-1">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#0B7A75]">
                    Projects
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-[#0B7A75]">
                    34
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
