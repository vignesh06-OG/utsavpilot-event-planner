import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  IndianRupee, 
  Sliders, 
  AlertTriangle, 
  CheckCircle,
  Clock
} from 'lucide-react';
import type { EventPlan } from '../../domain/types';
import { formatINR, formatLakhCrore } from '../../engine/budgetEngine';

interface ExecutiveSummaryProps {
  plan: EventPlan;
  onOpenReplan: () => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ plan, onOpenReplan }) => {
  const { input, budgetReport, summary, modelUsed, isDemoSample } = plan;

  // Calculate days remaining
  const [now] = React.useState(() => Date.now());
  const daysRemaining = React.useMemo(() => {
    const eventTime = new Date(input.date).getTime();
    return Math.ceil((eventTime - now) / (1000 * 60 * 60 * 24));
  }, [input.date, now]);

  return (
    <div
      className="card card-elevated"
      style={{
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 'var(--space-6)',
        border: '1px solid var(--border-gold)',
      }}
    >
      {/* Festive Background Image Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '50%',
          backgroundImage: 'url(/celebration_banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          opacity: 0.18,
          pointerEvents: 'none',
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Top Badges Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
          <span className="badge badge-gold">
            ✦ {input.eventType.replace('_', ' ').toUpperCase()}
          </span>

          <span className={`badge ${budgetReport.isFeasible ? 'badge-success' : 'badge-danger'}`}>
            {budgetReport.isFeasible ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}
            {budgetReport.isFeasible ? 'Budget Feasible' : 'Feasibility Alert'}
          </span>

          <span className={`badge ${modelUsed === 'gemini-flash' ? 'badge-primary' : 'badge-info'}`}>
            {modelUsed === 'gemini-flash' ? 'AI: Gemini 1.5 Flash' : 'Deterministic Engine'}
          </span>

          {isDemoSample && (
            <span className="badge badge-warning" title="This plan is loaded from pre-calibrated sample data">
              Sample Demo Plan
            </span>
          )}

          {daysRemaining > 0 ? (
            <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              <span>{daysRemaining} Days to Celebration</span>
            </span>
          ) : (
            <span className="badge badge-gold">Today / Celebrated</span>
          )}
        </div>

        {/* Title & Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: '780px' }}>
            <h1 style={{ marginBottom: 'var(--space-2)' }}>{input.title}</h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {summary}
            </p>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-gold pulse-glow"
              onClick={onOpenReplan}
              aria-label="Adapt or replan event constraints"
            >
              <Sliders size={16} />
              <span>Adapt & Replan</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Strip */}
        <div
          className="grid-4"
          style={{
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.12)',
                color: 'var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calendar size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Event Date
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.975rem' }}>{input.date}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-light)' }}>
                {input.durationDays} {input.durationDays === 1 ? 'Day' : 'Days'} Duration
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.12)',
                color: '#818CF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Location & Tier
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.975rem' }}>{input.city}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {input.tier} Tier Celebration
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Guest Scale
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.975rem' }}>{input.guestCount} Guests</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                ~{formatINR(budgetReport.costPerGuest)} / head
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 90, 31, 0.12)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IndianRupee size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Budget
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-gold-light)' }}>
                {formatINR(input.totalBudget)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {formatLakhCrore(input.totalBudget)} (100% reconciled)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
