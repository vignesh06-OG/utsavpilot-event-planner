import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Printer, ShieldCheck, Cpu, LayoutDashboard, Compass } from 'lucide-react';
import { SAMPLE_DEMO_EVENTS } from '../../domain/eventDefaults';
import type { EventInput } from '../../domain/types';

interface NavbarProps {
  currentView: 'landing' | 'workspace';
  onNavigate: (view: 'landing' | 'workspace') => void;
  onNewPlan: () => void;
  onLoadPreset: (preset: EventInput) => void;
  onPrint: () => void;
  modelUsed?: 'gemini-flash' | 'deterministic-fallback';
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onNewPlan,
  onLoadPreset,
  onPrint,
  modelUsed,
}) => {
  return (
    <motion.header
      className="navbar"
      role="banner"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container navbar-content">
        {/* Brand Link */}
        <motion.div
          className="brand-link"
          tabIndex={0}
          role="link"
          aria-label="UtsavPilot Home"
          onClick={() => onNavigate('landing')}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') onNavigate('landing');
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="brand-logo-icon" aria-hidden="true">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="brand-title">
              UtsavPilot <span style={{ fontSize: '0.85rem', color: 'var(--color-vermilion)' }}>✦</span>
            </div>
            <div className="brand-tagline">Celebration Editorial & Budget Precision</div>
          </div>
        </motion.div>

        {/* Center Nav Switcher: Editorial vs Workspace */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-canvas-subtle)',
            padding: '3px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            position: 'relative',
          }}
          aria-label="Main View Navigation"
        >
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-full)',
              padding: '5px 14px',
              fontSize: '0.8rem',
              color: currentView === 'landing' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: currentView === 'landing' ? 700 : 500,
              zIndex: 1,
            }}
            onClick={() => onNavigate('landing')}
            aria-current={currentView === 'landing' ? 'page' : undefined}
          >
            {currentView === 'landing' && (
              <motion.div
                layoutId="activeNavPill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-medium)',
                  zIndex: -1,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
            <Compass size={14} />
            <span>Overview</span>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-full)',
              padding: '5px 14px',
              fontSize: '0.8rem',
              color: currentView === 'workspace' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: currentView === 'workspace' ? 700 : 500,
              zIndex: 1,
            }}
            onClick={() => onNavigate('workspace')}
            aria-current={currentView === 'workspace' ? 'page' : undefined}
          >
            {currentView === 'workspace' && (
              <motion.div
                layoutId="activeNavPill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-medium)',
                  zIndex: -1,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
            <LayoutDashboard size={14} />
            <span>Planner Workspace</span>
          </button>
        </nav>

        {/* Right Action Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
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
            <span>{modelUsed === 'gemini-flash' ? 'Gemini Flash' : 'Deterministic'}</span>
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
                padding: '0.4rem 0.75rem',
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
                ✦ Sample Plans...
              </option>
              {SAMPLE_DEMO_EVENTS.map((demo, idx) => (
                <option key={idx} value={idx}>
                  {demo.title.split(':')[0]} ({demo.city.split(',')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Print Dossier Button */}
          <motion.button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onPrint}
            aria-label="Export or Print Event Dossier"
            title="Print or export complete event dossier"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Printer size={15} />
            <span>Print Dossier</span>
          </motion.button>

          {/* Plan New Event Button */}
          <motion.button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onNewPlan}
            aria-label="Create New Event Plan"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Calendar size={15} />
            <span>Plan Celebration</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
