import React, { useState } from 'react';
import { Building2, Search, Shield, Sparkles, Users } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';

const LinkedInInput = () => {
  const [searchType, setSearchType] = useState('people');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    if (!query.trim() || searching) return;

    setSearching(true);
    setMessage('');

    await new Promise((resolve) => setTimeout(resolve, 2200));

    setSearching(false);
    setMessage(
      `Queued a ${searchType === 'people' ? 'people' : 'company'} search for "${query}"${location ? ` in ${location}` : ''}.`
    );
  };

  return (
    <div className="space-y-6">
      <section className="page-shell px-6 py-7 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="section-label mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              LinkedIn Explorer
            </span>
            <h1 className="page-title">Compose a more intentional LinkedIn search experience.</h1>
            <p className="page-copy mt-4 max-w-2xl">
              Tune the query, choose whether you want people or company signals, and keep the interface clean enough that every search feels deliberate instead of improvised.
            </p>
          </div>

          <div className="panel-muted px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Search posture
            </p>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <p>Use exact role phrases for people searches.</p>
              <p>Use category + region language for company discovery.</p>
              <p>Keep a compliance-first mindset and respect rate limits.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="panel px-6 py-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-50">Search configuration</h2>
              <p className="mt-2 text-sm text-slate-400">
                Decide whether you are chasing decision-makers or account-level intelligence.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                id: 'people',
                title: 'People search',
                copy: 'Great for operators building outreach-ready lead lists.',
                icon: Users
              },
              {
                id: 'companies',
                title: 'Company search',
                copy: 'Better when you want target accounts before contacts.',
                icon: Building2
              }
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSearchType(option.id)}
                className={`rounded-[24px] border px-5 py-5 text-left transition duration-300 ${
                  searchType === option.id
                    ? 'border-cyan-300/25 bg-cyan-300/10 text-slate-50'
                    : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <option.icon className="mb-4 h-5 w-5" />
                <p className="text-lg font-semibold">{option.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">{option.copy}</p>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <Input
              label="Search Query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchType === 'people'
                  ? 'VP Sales SaaS'
                  : 'Fintech infrastructure company'
              }
              required
            />

            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Remote, London, Bangalore"
            />
          </div>

          <Button
            variant="gradient"
            size="lg"
            icon={Search}
            onClick={handleSearch}
            disabled={searching || !query.trim()}
            className="mt-2 w-full"
          >
            {searching ? 'Queuing search...' : `Start ${searchType === 'people' ? 'people' : 'company'} search`}
          </Button>

          {message && (
            <p className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {message}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="panel px-6 py-6">
            <span className="section-label mb-3">Prompt design</span>
            <h2 className="text-2xl font-semibold text-slate-50">Three quick prompts that work well</h2>
            <div className="mt-6 space-y-3">
              {[
                '"Founder" OR "Co-founder" B2B SaaS',
                '"Revenue operations" healthcare Europe',
                'Cloud security company North America'
              ].map((item) => (
                <div key={item} className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="panel px-6 py-6">
            <span className="section-label mb-3">Guardrails</span>
            <div className="panel-muted flex gap-4 px-4 py-4">
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-amber-200">
                <Shield className="h-4 w-4" />
              </div>
              <p className="text-sm leading-7 text-slate-300">
                Keep LinkedIn collection respectful and compliant. Prefer clean, narrowly scoped searches and avoid aggressive repetition or unnecessary volume.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LinkedInInput;
