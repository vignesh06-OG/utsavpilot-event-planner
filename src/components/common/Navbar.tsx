import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Printer, ShieldCheck, Cpu, LayoutDashboard, Compass, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (action: () => void) => {
    setIsMobileMenuOpen(false);
    action();
  };

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
            <Sparkles size={20} />
          </div>
          <div>
            <div className="brand-title" style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>
              UtsavPilot <span style={{ fontSize: '0.8rem', color: 'var(--color-vermilion)' }}>✦</span>
            </div>
            <div className="brand-tagline desktop-nav-only" style={{ fontSize: '0.65rem' }}>
              Celebration Editorial & Budget Precision
            </div>
          </div>
        </motion.div>

        {/* Center Nav Switcher: Editorial vs Workspace (Desktop only) */}
        <nav
          className="desktop-nav-only"
          style={{
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

        {/* Right Action Tools (Desktop only) */}
        <div className="desktop-nav-only" style={{ alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
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

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="mobile-nav-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Accessible Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Nav Switcher */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className={`btn btn-sm ${currentView === 'landing' ? 'btn-aubergine' : 'btn-secondary'}`}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => handleMobileNav(() => onNavigate('landing'))}
              >
                <Compass size={15} />
                <span>Overview</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${currentView === 'workspace' ? 'btn-aubergine' : 'btn-secondary'}`}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => handleMobileNav(() => onNavigate('workspace'))}
              >
                <LayoutDashboard size={15} />
                <span>Workspace</span>
              </button>
            </div>

            {/* Plan Celebration CTA */}
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1rem' }}
              onClick={() => handleMobileNav(onNewPlan)}
            >
              <Calendar size={18} />
              <span>Plan New Celebration</span>
            </button>

            {/* Print Dossier CTA */}
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.65rem 1rem' }}
              onClick={() => handleMobileNav(onPrint)}
            >
              <Printer size={16} />
              <span>Print / PDF Dossier</span>
            </button>

            {/* Sample Plans Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label htmlFor="mobile-preset-select" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                ✦ Load Sample Celebration:
              </label>
              <select
                id="mobile-preset-select"
                className="form-select"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.85rem',
                  background: 'var(--bg-canvas-subtle)',
                }}
                defaultValue=""
                onChange={(e) => {
                  const idx = parseInt(e.target.value, 10);
                  if (!isNaN(idx) && SAMPLE_DEMO_EVENTS[idx]) {
                    handleMobileNav(() => onLoadPreset(SAMPLE_DEMO_EVENTS[idx]));
                  }
                }}
              >
                <option value="" disabled>
                  Choose a pre-calibrated sample...
                </option>
                {SAMPLE_DEMO_EVENTS.map((demo, idx) => (
                  <option key={idx} value={idx}>
                    {demo.title.split(':')[0]} ({demo.city.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Engine Status Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'var(--bg-canvas-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Engine Mode</span>
              <div
                className={`badge ${modelUsed === 'gemini-flash' ? 'badge-primary' : 'badge-gold'}`}
                style={{ fontSize: '0.725rem' }}
              >
                {modelUsed === 'gemini-flash' ? <Cpu size={12} /> : <ShieldCheck size={12} />}
                <span>{modelUsed === 'gemini-flash' ? 'Gemini Flash' : 'Deterministic Offline Engine'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
