import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AuthShell = ({
  badge,
  title,
  description,
  icon: Icon,
  highlights = [],
  metrics = [],
  footerText,
  footerLabel,
  footerTo,
  children
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="grid-overlay absolute inset-0 opacity-50" />
        <div className="float-drift absolute left-[6%] top-[10%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="float-drift absolute right-[8%] top-[6%] h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="float-drift absolute bottom-[-6rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-300/10 blur-3xl" style={{ animationDelay: '3.5s' }} />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="fade-rise">
          <span className="section-label mb-4">{badge}</span>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              {description}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="panel-muted px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-50">{metric.value}</p>
                <p className="mt-2 text-sm text-slate-400">{metric.copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item.title} className="panel px-5 py-5">
                <div className="mb-4 inline-flex rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.12] p-3 text-cyan-100">
                  <item.icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-slate-50">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="fade-rise">
          <div className="page-shell shimmer-sweep mx-auto max-w-xl px-6 py-7 sm:px-8 sm:py-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/[0.12] p-3 text-cyan-100">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Secure Portal
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-50">
                  Identity checkpoint
                </p>
              </div>
            </div>

            {children}

            <div className="mt-6 border-t border-white/10 pt-6 text-sm text-slate-400">
              <span>{footerText} </span>
              <Link
                to={footerTo}
                className="inline-flex items-center gap-2 font-semibold text-cyan-200 transition hover:text-cyan-100"
              >
                {footerLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthShell;
