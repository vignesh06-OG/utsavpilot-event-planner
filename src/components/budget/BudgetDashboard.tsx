import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  IndianRupee, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Edit3
} from 'lucide-react';
import type { BudgetFeasibilityReport, BudgetCategory } from '../../domain/types';
import { formatINR } from '../../engine/budgetEngine';
import { accordionVariants } from '../../motion/motionTokens';

interface BudgetDashboardProps {
  report: BudgetFeasibilityReport;
  onUpdateCategoryBudget: (categoryId: string, newAmount: number) => void;
}

const CATEGORY_COLORS = [
  '#E85D3F', // Vermilion
  '#E7A83E', // Marigold
  '#176B58', // Emerald
  '#28152F', // Aubergine
  '#9333EA', // Royal Purple
  '#C2410C', // Rust
  '#0284C7', // Sky
  '#64748B', // Slate Contingency
];

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({
  report,
  onUpdateCategoryBudget,
}) => {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);

  const toggleExpand = (id: string) => {
    setExpandedCategoryId(expandedCategoryId === id ? null : id);
  };

  const startEdit = (cat: BudgetCategory) => {
    setEditingCategoryId(cat.id);
    setEditAmount(cat.allocatedAmount);
  };

  const saveEdit = (catId: string) => {
    onUpdateCategoryBudget(catId, editAmount);
    setEditingCategoryId(null);
  };

  return (
    <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-5)',
        }}
      >
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IndianRupee size={22} style={{ color: 'var(--color-gold)' }} />
            <span>Deterministic Budget Feasibility</span>
          </h2>
          <p style={{ fontSize: '0.875rem' }}>
            100% reconciled arithmetic with transparent contingency allocation and provenance tagging.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-gold">
            Contingency Reserve: {report.contingencyPercentage}% ({formatINR(report.contingencyAmount)})
          </span>
        </div>
      </div>

      {/* Shortfall Warning Banner if Infeasible */}
      {!report.isFeasible && (
        <div
          className="card"
          style={{
            background: 'var(--color-danger-bg)',
            borderColor: 'var(--color-danger-border)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <ShieldAlert size={22} style={{ color: 'var(--color-danger)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, color: '#FCA5A5', fontSize: '0.975rem' }}>
                Budget Deficit Detected: Shortfall of {formatINR(report.shortfallAmount)}
              </div>
              {report.feasibilityWarnings.map((w, idx) => (
                <p key={idx} style={{ color: 'var(--text-primary)', fontSize: '0.85rem', marginTop: '4px' }}>
                  {w}
                </p>
              ))}
              <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: '1px solid rgba(239,68,68,0.2)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FCD34D', textTransform: 'uppercase' }}>
                  Recommended Levers:
                </div>
                <ul style={{ paddingLeft: '16px', listStyleType: 'disc', marginTop: '4px' }}>
                  {report.actionableLevers.map((lever, idx) => (
                    <li key={idx} style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                      {lever}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Multi-Segment Budget Bar */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div
          style={{
            display: 'flex',
            height: '16px',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
          }}
          role="progressbar"
          aria-valuenow={100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Category Budget Distribution"
        >
          {report.categories.map((cat, idx) => {
            const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            return (
              <motion.div
                key={cat.id}
                initial={{ width: 0 }}
                animate={{ width: `${cat.percentage}%` }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  backgroundColor: color,
                }}
                title={`${cat.name}: ${cat.percentage}% (${formatINR(cat.allocatedAmount)})`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: 'var(--space-3)',
            fontSize: '0.775rem',
          }}
        >
          {report.categories.map((cat, idx) => {
            const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            return (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Cards / Interactive List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {report.categories.map((cat, idx) => {
          const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
          const isExpanded = expandedCategoryId === cat.id;
          const isEditing = editingCategoryId === cat.id;

          return (
            <div
              key={cat.id}
              className="card"
              style={{
                padding: 'var(--space-4)',
                background: isExpanded ? 'var(--bg-card-elevated)' : 'var(--bg-card)',
                borderTopColor: isExpanded ? 'var(--border-medium)' : 'var(--border-subtle)',
                borderRightColor: isExpanded ? 'var(--border-medium)' : 'var(--border-subtle)',
                borderBottomColor: isExpanded ? 'var(--border-medium)' : 'var(--border-subtle)',
                borderLeftColor: color,
                borderLeftWidth: '4px',
                borderLeftStyle: 'solid',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-3)',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '4px' }}
                    onClick={() => toggleExpand(cat.id)}
                    aria-expanded={isExpanded}
                    aria-label={`Toggle sub-items for ${cat.name}`}
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.975rem' }}>{cat.name}</span>
                      <span
                        className={`badge ${
                          cat.provenance === 'verified'
                            ? 'badge-success'
                            : cat.provenance === 'user_specified'
                            ? 'badge-primary'
                            : 'badge-gold'
                        }`}
                        style={{ fontSize: '0.7rem' }}
                      >
                        {cat.provenance === 'verified'
                          ? 'Verified Quote'
                          : cat.provenance === 'user_specified'
                          ? 'User Specified'
                          : 'Benchmark Estimate'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', marginTop: '2px' }}>{cat.rationale}</p>
                  </div>
                </div>

                {/* Amount and percentage */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '130px', padding: '4px 8px', fontSize: '0.85rem' }}
                        value={editAmount}
                        onChange={(e) => setEditAmount(Number(e.target.value))}
                        step={5000}
                        aria-label={`Edit budget amount for ${cat.name}`}
                      />
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => saveEdit(cat.id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setEditingCategoryId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-gold-light)' }}>
                          {formatINR(cat.allocatedAmount)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {cat.percentage}% of total
                        </div>
                      </div>
                      {cat.id !== 'contingency' && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '6px' }}
                          onClick={() => startEdit(cat)}
                          title="Tweak category allocation"
                          aria-label={`Edit budget for ${cat.name}`}
                        >
                          <Edit3 size={15} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Sub items dropdown with AnimatePresence */}
              <AnimatePresence>
                {isExpanded && cat.subItems && cat.subItems.length > 0 && (
                  <motion.div
                    variants={accordionVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    style={{
                      marginTop: 'var(--space-4)',
                      paddingTop: 'var(--space-3)',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        marginBottom: 'var(--space-2)',
                      }}
                    >
                      Sub-Item Itemized Allocation
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {cat.subItems.map((sub) => (
                        <div
                          key={sub.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 12px',
                            background: 'var(--bg-input)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                          }}
                        >
                          <span style={{ color: 'var(--text-primary)' }}>{sub.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {formatINR(sub.amount)}
                            </span>
                            <span
                              className="badge badge-info"
                              style={{ fontSize: '0.675rem', padding: '1px 6px' }}
                            >
                              {sub.provenance}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
