import React from 'react';
import { Sparkles, Calendar, Printer, ShieldCheck, Cpu } from 'lucide-react';
import { SAMPLE_DEMO_EVENTS } from '../../domain/eventDefaults';
import type { EventInput } from '../../domain/types';

interface NavbarProps {
  onNewPlan: () => void;
  onLoadPreset: (preset: EventInput) => void;
  onPrint: () => void;
  modelUsed?: 'gemini-flash' | 'deterministic-fallback';
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewPlan,
  onLoadPreset,
  onPrint,
  modelUsed,
}) => {
  return (
    <header className="navbar" role="banner">
      <div className="container navbar-content">
        <div className="brand-link" tabIndex={0} role="link" aria-label="UtsavPilot Home">
          <div className="brand-logo-icon" aria-hidden="true">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="brand-title">
              UtsavPilot <span style={{ fontSize: '0.85rem', color: '#F59E0B' }}>✦</span>
            </div>
            <div className="brand-tagline">AI Celebration & Budget Navigator</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {/* Engine Status Badge */}
          <div
            className={`badge ${modelUsed === 'gemini-flash' ? 'badge-primary' : 'badge-gold'}`}
            title={
              modelUsed === 'gemini-flash'
                ? 'Gemini 1.5 Flash GenAI Model Active'
                : 'Deterministic Indian Celebration Engine Active (Safe & Offline Ready)'
            }
            aria-label={`Planning engine: ${modelUsed === 'gemini-flash' ? 'Gemini GenAI' : 'Deterministic Heuristic Engine'}`}
          >
            {modelUsed === 'gemini-flash' ? <Cpu size={13} /> : <ShieldCheck size={13} />}
            <span>{modelUsed === 'gemini-flash' ? 'Gemini Flash' : 'Deterministic Mode'}</span>
          </div>

          {/* Quick Demo Preset Dropdown */}
          <div style={{ position: 'relative' }}>
            <label htmlFor="preset-select" className="sr-only">
              Load sample celebration
            </label>
            <select
              id="preset-select"
              className="form-select"
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.825rem',
                background: 'var(--bg-card)',
                borderColor: 'var(--border-medium)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)',
              }}
              defaultValue=""
              onChange={(e) => {
                const idx = parseInt(e.target.value, 10);
                if (!isNaN(idx) && SAMPLE_DEMO_EVENTS[idx]) {
                  onLoadPreset(SAMPLE_DEMO_EVENTS[idx]);
                }
              }}
            >
              <option value="" disabled>
                ✦ Load Sample Indian Celebration...
              </option>
              {SAMPLE_DEMO_EVENTS.map((demo, idx) => (
                <option key={idx} value={idx}>
                  {demo.title} ({demo.city.split(',')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Print Dossier */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onPrint}
            aria-label="Export or Print Event Dossier"
            title="Print or export complete event dossier"
          >
            <Printer size={15} />
            <span>Print Dossier</span>
          </button>

          {/* Plan New Event Button */}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onNewPlan}
            aria-label="Create New Event Plan"
          >
            <Calendar size={15} />
            <span>New Plan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
