import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Mail,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import { useLeads } from '../../context/LeadContext.jsx';
import Table from '../../components/common/Table.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import LeadAnalytics from '../../components/LeadAnalytics.jsx';

const statusTone = {
  pending: 'border-amber-300/20 bg-amber-300/10 text-amber-200',
  scraped: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200',
  verified: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200',
  failed: 'border-rose-300/20 bg-rose-300/10 text-rose-200'
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { leads = [], fetchLeads, loading } = useLeads();

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const overview = useMemo(() => {
    const verified = leads.filter((lead) => lead.status === 'verified').length;
    const reachable = leads.filter(
      (lead) => lead.email || (Array.isArray(lead.emails) && lead.emails.length > 0)
    ).length;
    const failed = leads.filter((lead) => lead.status === 'failed').length;
    const sources = new Set(leads.map((lead) => lead.source).filter(Boolean)).size;

    return {
      total: leads.length,
      verified,
      reachable,
      failed,
      sources
    };
  }, [leads]);

  const cards = [
    {
      label: 'Tracked leads',
      value: overview.total,
      note: 'Fresh prospects flowing into the vault.',
      icon: Users,
      accent: 'from-cyan-300/30 to-sky-400/10'
    },
    {
      label: 'Verified signals',
      value: overview.verified,
      note: 'Contacts already validated for outreach.',
      icon: Shield,
      accent: 'from-emerald-300/30 to-teal-400/10'
    },
    {
      label: 'Reachable contacts',
      value: overview.reachable,
      note: 'Lead records with an email ready to use.',
      icon: Mail,
      accent: 'from-amber-300/30 to-orange-400/10'
    },
    {
      label: 'Source spread',
      value: overview.sources || 0,
      note: overview.failed > 0 ? `${overview.failed} records need attention.` : 'No failure spikes detected.',
      icon: TrendingUp,
      accent: 'from-fuchsia-300/20 to-cyan-300/10'
    }
  ];

  const stages = [
    {
      label: 'Pending capture',
      count: leads.filter((lead) => lead.status === 'pending').length,
      tone: 'bg-amber-300'
    },
    {
      label: 'Scraped',
      count: leads.filter((lead) => lead.status === 'scraped').length,
      tone: 'bg-cyan-300'
    },
    {
      label: 'Verified',
      count: overview.verified,
      tone: 'bg-emerald-300'
    },
    {
      label: 'Failed',
      count: overview.failed,
      tone: 'bg-rose-300'
    }
  ];

  const totalStageCount = stages.reduce((sum, stage) => sum + stage.count, 0) || 1;

  const automationNotes = [
    {
      title: 'Signal quality',
      copy: overview.total > 0 ? `${Math.round((overview.verified / Math.max(overview.total, 1)) * 100)}% of current leads are verified.` : 'Run a scrape to begin measuring verified lead quality.',
      icon: Sparkles
    },
    {
      title: 'Coverage',
      copy: `${overview.sources || 0} active sources contributing to your current pipeline snapshot.`,
      icon: Search
    },
    {
      title: 'Risk watch',
      copy: overview.failed > 0 ? `${overview.failed} records failed and may need manual review.` : 'No failed records are currently blocking the funnel.',
      icon: AlertTriangle
    }
  ];

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-8">
      <section className="page-shell surface-glow px-6 py-7 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div>
            <span className="section-label mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Revenue Signal Deck
            </span>
            <h1 className="page-title max-w-3xl">
              Your pipeline at a glance, tuned for speed, clarity, and fresh signal capture.
            </h1>
            <p className="page-copy mt-4 max-w-2xl">
              Watch lead quality move in real time, jump into scraping operations, and keep the whole outbound system visually calm even when your workflows are moving fast.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="gradient"
                size="lg"
                icon={ArrowRight}
                onClick={() => navigate('/scraping/jobs')}
              >
                Launch scraping ops
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={Users}
                onClick={() => navigate('/leads')}
              >
                Open lead vault
              </Button>
            </div>
          </div>

          <div className="panel-muted flex flex-col justify-between px-5 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
                Live snapshot
              </p>
              <p className="mt-3 text-4xl font-semibold text-slate-50">{overview.total}</p>
              <p className="mt-2 text-sm text-slate-400">
                Prospects currently tracked across your active workspace.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {stages.map((stage) => (
                <div key={stage.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-300">{stage.label}</span>
                    <span className="text-slate-500">{stage.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06]">
                    <div
                      className={`h-2 rounded-full ${stage.tone}`}
                      style={{ width: `${(stage.count / totalStageCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={card.label}
            className="panel px-5 py-5"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className={`mb-5 inline-flex rounded-[22px] border border-white/10 bg-gradient-to-br ${card.accent} p-3 text-slate-50`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-50">{card.value}</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">{card.note}</p>
          </div>
        ))}
      </section>

      {/* Lead Analytics Section */}
      <LeadAnalytics />

      <section className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="panel px-6 py-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <span className="section-label mb-3">Recent signals</span>
              <h2 className="text-2xl font-semibold text-slate-50">Latest lead activity</h2>
            </div>
            <Button variant="ghost" icon={ArrowRight} onClick={() => navigate('/leads')}>
              See all
            </Button>
          </div>

          <Table
            rowKey="_id"
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'company', label: 'Company' },
              {
                key: 'status',
                label: 'Status',
                render: (value = 'pending') => (
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusTone[value] || statusTone.pending}`}>
                    {value}
                  </span>
                )
              },
              {
                key: 'createdAt',
                label: 'Created',
                render: (value) => (value ? new Date(value).toLocaleDateString() : '--')
              }
            ]}
            data={leads.slice(0, 5)}
            emptyMessage="No leads yet. Run a scrape to populate this feed."
          />
        </div>

        <div className="space-y-6">
          <div className="panel px-6 py-6">
            <span className="section-label mb-3">Automation pulse</span>
            <h2 className="text-2xl font-semibold text-slate-50">What deserves attention next</h2>
            <div className="mt-6 space-y-4">
              {automationNotes.map((item) => (
                <div key={item.title} className="panel-muted flex gap-4 px-4 py-4">
                  <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                    <p className="mt-1 text-sm leading-7 text-slate-400">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel px-6 py-6">
            <span className="section-label mb-3">Operator note</span>
            <h2 className="text-2xl font-semibold text-slate-50">Stay ahead of the next scrape wave</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Use the scraping deck to launch config-based jobs, refine keyword searches, or run manual triggers when your team needs a burst of fresh leads.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primary" icon={Search} onClick={() => navigate('/scraping/keyword')}>
                Explore keywords
              </Button>
              <Button variant="secondary" icon={ArrowRight} onClick={() => navigate('/scraping/manual')}>
                Open manual trigger
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
