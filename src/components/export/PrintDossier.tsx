import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Printer, X, Download } from 'lucide-react';
import type { EventPlan } from '../../domain/types';
import { formatINR } from '../../engine/budgetEngine';
import { backdropVariants, modalVariants } from '../../motion/motionTokens';

interface PrintDossierProps {
  plan: EventPlan;
  onClose: () => void;
}

export const PrintDossier = ({ plan, onClose }: PrintDossierProps) => {
  const { input, budgetReport, summary, tasks, vendorChecklist, suggestions } = plan;

  // Accessible Escape key listener for dialog dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${plan.input.title.toLowerCase().replace(/\s+/g, '_')}_dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <motion.div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-title"
      variants={backdropVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="modal-content"
        style={{
          maxWidth: '880px',
          background: '#FFFFFF',
          color: '#1E293B',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(1rem, 3vw, 2rem)',
        }}
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Print Actions Bar (hidden during actual paper print) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-6)',
            paddingBottom: 'var(--space-4)',
            borderBottom: '2px solid #E2E8F0',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h2 id="dossier-title" style={{ color: '#0F172A', fontSize: '1.4rem' }}>
              Celebration Execution Dossier
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
              Print-ready formatted document for banquet managers, family elders, and vendor teams.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handlePrint}
              aria-label="Send to printer"
            >
              <Printer size={16} /> Print / Save PDF
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleExportJSON}
              aria-label="Download raw JSON plan"
            >
              <Download size={16} /> Export JSON
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              aria-label="Close dossier view"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Dossier Document Content */}
        <div id="printable-dossier" style={{ fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-marigold-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              UtsavPilot Master Celebration Plan
            </div>
            <h1 style={{ color: '#0F172A', fontFamily: 'var(--font-heading)', fontSize: '2.4rem', margin: '6px 0', letterSpacing: '-0.02em' }}>
              {input.title}
            </h1>
            <div style={{ fontSize: '0.95rem', color: '#475569' }}>
              {input.date} ({input.durationDays} Days) • {input.city} • {input.guestCount} Guests • {formatINR(input.totalBudget)} Budget
            </div>
          </div>

          {/* Executive Summary */}
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
            <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Executive Summary</div>
            <p style={{ color: '#334155', fontSize: '0.925rem' }}>{summary}</p>
          </div>

          {/* Budget Breakdown Table */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#0F172A', fontSize: '1.15rem', marginBottom: '10px', borderBottom: '2px solid #E2E8F0', paddingBottom: '4px' }}>
              Deterministic Budget Breakdown
            </h3>
            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '440px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
                    <th style={{ textAlign: 'right', padding: '8px' }}>Allocated Amount</th>
                    <th style={{ textAlign: 'right', padding: '8px' }}>% of Total</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Cost Provenance</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetReport.categories.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '8px', fontWeight: 600, color: '#1E293B' }}>{c.name}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                        {formatINR(c.allocatedAmount)}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', color: '#475569' }}>{c.percentage}%</td>
                      <td style={{ padding: '8px', color: '#64748B', textTransform: 'capitalize' }}>{c.provenance}</td>
                    </tr>
                  ))}
                  <tr style={{ background: '#F8FAFC', fontWeight: 800, borderTop: '2px solid #0F172A' }}>
                    <td style={{ padding: '10px 8px' }}>TOTAL RECONCILED</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: '#D97706' }}>
                      {formatINR(budgetReport.totalBudget)}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right' }}>100%</td>
                    <td style={{ padding: '10px 8px', color: '#16A34A' }}>Feasibility: {budgetReport.isFeasible ? 'Pass' : 'Deficit'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Milestone Action Steps */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#0F172A', fontSize: '1.15rem', marginBottom: '10px', borderBottom: '2px solid #E2E8F0', paddingBottom: '4px' }}>
              Milestone Execution Tasks
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {tasks.map((t, idx) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748B', fontWeight: 700, width: '24px' }}>{idx + 1}.</span>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: '#0F172A' }}>{t.title}</strong>
                    <span style={{ color: '#64748B', marginLeft: '6px' }}>({t.category})</span>
                    {t.assignedOwner && <span style={{ color: '#D97706', marginLeft: '6px' }}>[Lead: {t.assignedOwner}]</span>}
                    {t.notes && <div style={{ color: '#475569', fontSize: '0.8rem' }}>{t.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Due Diligence */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#0F172A', fontSize: '1.15rem', marginBottom: '10px', borderBottom: '2px solid #E2E8F0', paddingBottom: '4px' }}>
              Vendor Negotiation Checklist
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {vendorChecklist.map((v) => (
                <div key={v.id} style={{ background: '#F8FAFC', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0F172A', fontSize: '0.875rem' }}>
                    <span>{v.serviceTitle} ({v.category})</span>
                    <span style={{ color: '#D97706' }}>Est: {v.benchmarkCostRange}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                    <strong>Key Questions:</strong> {v.keyQuestionsToAsk.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural & Decor Highlights */}
          {suggestions && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#0F172A', fontSize: '1.15rem', marginBottom: '10px', borderBottom: '2px solid #E2E8F0', paddingBottom: '4px' }}>
                Cultural & Dining Directives
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
                <div>
                  <strong style={{ color: '#0F172A' }}>Decor Direction:</strong>
                  <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                    {suggestions.themeAndDecor.slice(0, 2).map((item, idx) => (
                      <li key={idx} style={{ color: '#475569' }}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong style={{ color: '#0F172A' }}>Dining & Accessibility:</strong>
                  <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                    {suggestions.foodAndBeverage.slice(0, 2).map((item, idx) => (
                      <li key={idx} style={{ color: '#475569' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
            Generated with UtsavPilot AI Celebration Navigator • Verified deterministic calculations • Plan ID: {plan.id}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
