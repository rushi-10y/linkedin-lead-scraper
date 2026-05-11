import React, { useState } from 'react';
import { Plus, Search, Sparkles, Target, X } from 'lucide-react';
import { useLeads } from '../../context/LeadContext.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import api from '../../services/api.js';

const MAX_KEYWORDS = 5;

const KeywordInput = () => {
  const [keywords, setKeywords] = useState(['']);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState('');
  const { fetchLeads } = useLeads();

  const addKeyword = () => {
    if (keywords.length >= MAX_KEYWORDS) return;
    setKeywords([...keywords, '']);
  };

  const removeKeyword = (index) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  const updateKeyword = (index, value) => {
    const updated = [...keywords];
    updated[index] = value;
    setKeywords(updated);
  };

  const validKeywords = keywords.map((keyword) => keyword.trim()).filter(Boolean);

  const handleSearch = async () => {
    if (validKeywords.length === 0 || searching) return;

    setSearching(true);
    setMessage('');

    try {
      const data = await api.post('/scrape', {
        source: 'google_keywords',
        keywordsFile: validKeywords.join(', ')
      });

      setMessage(`Scraped ${data.scraped || data.saved || 0} leads. Your vault is refreshing now.`);
      await fetchLeads();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      console.error('Scraping error:', err);
    } finally {
      setSearching(false);
    }
  };

  const messageTone = message.startsWith('Error')
    ? 'border-rose-300/20 bg-rose-500/10 text-rose-200'
    : 'border-emerald-300/20 bg-emerald-500/10 text-emerald-200';

  return (
    <div className="space-y-6">
      <section className="page-shell px-6 py-7 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="section-label mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Keyword Capture
            </span>
            <h1 className="page-title">Turn search intent into a polished lead stream.</h1>
            <p className="page-copy mt-4 max-w-2xl">
              Feed the crawler a compact keyword set and let the workspace translate raw search terms into outreach-ready prospect records with a premium, low-noise workflow.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="kpi-pill">Max {MAX_KEYWORDS} live phrases</span>
              <span className="kpi-pill">Google to LinkedIn handoff</span>
              <span className="kpi-pill">Vault refresh after every run</span>
            </div>
          </div>

          <div className="panel-muted px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Best performing patterns
            </p>
            <div className="mt-5 space-y-3">
              {[
                'SaaS founder remote',
                'ERP consultant India',
                'Growth marketing director fintech',
                'Chief revenue officer healthcare'
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="panel px-6 py-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-50">Build the keyword stack</h2>
              <p className="mt-2 text-sm text-slate-400">
                Each line acts like a search lane. Keep it tight and intent-rich.
              </p>
            </div>

            <Button
              variant="secondary"
              icon={Plus}
              onClick={addKeyword}
              disabled={keywords.length >= MAX_KEYWORDS}
            >
              Add line
            </Button>
          </div>

          <div className="space-y-4">
            {keywords.map((keyword, index) => (
              <div key={index} className="panel-muted flex items-start gap-3 px-4 py-4">
                <div className="mt-3 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <Input
                    value={keyword}
                    onChange={(e) => updateKeyword(index, e.target.value)}
                    placeholder={`Keyword lane ${index + 1}`}
                    className="mb-0"
                  />
                </div>
                {keywords.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKeyword(index)}
                    className="mt-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              {validKeywords.length} keyword lanes armed for the next scrape.
            </p>

            <Button
              variant="gradient"
              size="lg"
              icon={Search}
              onClick={handleSearch}
              disabled={searching || validKeywords.length === 0}
            >
              {searching ? 'Running capture...' : 'Launch keyword scrape'}
            </Button>
          </div>

          {message && (
            <p className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${messageTone}`}>
              {message}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="panel px-6 py-6">
            <span className="section-label mb-3">Targeting notes</span>
            <h2 className="text-2xl font-semibold text-slate-50">How to keep the results premium</h2>
            <div className="mt-6 space-y-4">
              {[
                'Pair role + industry for stronger relevance.',
                'Use geography only when location really matters.',
                'Avoid broad single-word phrases that produce noisy lead lists.'
              ].map((tip) => (
                <div key={tip} className="panel-muted flex items-start gap-3 px-4 py-4">
                  <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-2 text-amber-200">
                    <Target className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-7 text-slate-300">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel px-6 py-6">
            <span className="section-label mb-3">Sample plays</span>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'CTO SaaS Europe',
                'Operations lead logistics',
                'Recruiting manager remote',
                'Founder fintech APAC'
              ].map((play) => (
                <button
                  key={play}
                  type="button"
                  onClick={() => setKeywords([play])}
                  className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-left text-sm font-medium text-slate-200 transition hover:border-cyan-300/20 hover:bg-cyan-300/10"
                >
                  {play}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KeywordInput;
