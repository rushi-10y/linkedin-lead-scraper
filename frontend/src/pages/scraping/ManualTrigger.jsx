import React, { useEffect, useRef, useState } from 'react';
import { Clock, Play, Sparkles, Square } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Select from '../../components/common/Select.jsx';

const ManualTrigger = () => {
  const [selectedScraper, setSelectedScraper] = useState('');
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);

  const intervalRef = useRef(null);

  const scrapers = [
    { id: 'linkedin', name: 'LinkedIn Scraper', description: 'Profile-oriented capture flow for decision-maker discovery.' },
    { id: 'google', name: 'Google Search', description: 'Broad intent exploration tuned for fresh keyword trails.' },
    { id: 'company_websites', name: 'Company Websites', description: 'Harvest contact and role data from owned properties.' },
    { id: 'social_media', name: 'Social Media', description: 'Scan social surfaces for lightweight lead context.' }
  ];

  const handleRunScraper = () => {
    if (!selectedScraper || running) return;

    setRunning(true);
    setProgress(0);
    setResults([]);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setRunning(false);
          setResults([
            { id: 1, name: 'Maya Patel', email: 'maya@example.com', source: selectedScraper },
            { id: 2, name: 'Jon Carter', email: 'jon@example.com', source: selectedScraper },
            { id: 3, name: 'Rina Lopez', email: 'rina@example.com', source: selectedScraper }
          ]);
          return 100;
        }
        return prev + 5;
      });
    }, 180);
  };

  const handleStopScraper = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="page-shell px-6 py-7 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="section-label mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Manual Trigger
            </span>
            <h1 className="page-title">Fire a one-off workflow when your team needs immediate fresh data.</h1>
            <p className="page-copy mt-4 max-w-2xl">
              Manual mode is built for controlled bursts. Pick the scraper, watch the progress sweep, and inspect the sample results without leaving the command deck.
            </p>
          </div>

          <div className="panel-muted px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Ideal use cases
            </p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>Fast validation before adding a new automation.</p>
              <p>Spot collection for a high-priority campaign sprint.</p>
              <p>Recovery work when a source needs a manual re-run.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="panel px-6 py-6">
          <h2 className="text-2xl font-semibold text-slate-50">Run control</h2>
          <p className="mt-2 text-sm text-slate-400">
            Select the collection lane and trigger it only when you actually need a burst of signal.
          </p>

          <div className="mt-6">
            <Select
              label="Scraper Type"
              value={selectedScraper}
              onChange={(e) => setSelectedScraper(e.target.value)}
              options={[
                { value: '', label: 'Choose a scraper...' },
                ...scrapers.map((scraper) => ({
                  value: scraper.id,
                  label: scraper.name
                }))
              ]}
            />
          </div>

          {selectedScraper && (
            <div className="panel-muted mt-4 px-4 py-4">
              <p className="text-sm font-semibold text-slate-100">
                {scrapers.find((scraper) => scraper.id === selectedScraper)?.name}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                {scrapers.find((scraper) => scraper.id === selectedScraper)?.description}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {!running ? (
              <Button
                variant="gradient"
                icon={Play}
                size="lg"
                onClick={handleRunScraper}
                disabled={!selectedScraper}
              >
                Run manual scrape
              </Button>
            ) : (
              <Button
                variant="danger"
                icon={Square}
                size="lg"
                onClick={handleStopScraper}
              >
                Stop workflow
              </Button>
            )}
          </div>

          {running && (
            <div className="panel-muted mt-6 px-4 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-slate-300">Capture progress</span>
                <span className="text-cyan-200">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06]">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(103,232,249,0.92),rgba(34,197,94,0.92))] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {results.length > 0 && (
            <div className="panel px-6 py-6">
              <span className="section-label mb-3">Sample output</span>
              <h2 className="text-2xl font-semibold text-slate-50">Recent result set</h2>
              <div className="mt-6 space-y-3">
                {results.map((result) => (
                  <div key={result.id} className="panel-muted px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-slate-100">{result.name}</p>
                        <p className="mt-1 text-sm text-slate-400">{result.email}</p>
                      </div>
                      <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                        {result.source}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="panel px-6 py-6">
            <span className="section-label mb-3">Operating note</span>
            <div className="panel-muted flex gap-4 px-4 py-4">
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-amber-200">
                <Clock className="h-4 w-4" />
              </div>
              <p className="text-sm leading-7 text-slate-300">
                Manual runs are best for controlled collection. For repeatable lead motion, move proven flows into scheduled jobs and keep this screen for urgent bursts only.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManualTrigger;
