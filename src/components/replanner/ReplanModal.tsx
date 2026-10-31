import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Sliders, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import type { EventPlan, ReplanDelta, EventTier } from '../../domain/types';
import { calculateReplanDelta } from '../../engine/replanEngine';
import { formatINR } from '../../engine/budgetEngine';
import { backdropVariants, modalVariants } from '../../motion/motionTokens';

interface ReplanModalProps {
  currentPlan: EventPlan;
  onApplyReplan: (updatedPlan: EventPlan, delta: ReplanDelta) => void;
  onClose: () => void;
}

export const ReplanModal: React.FC<ReplanModalProps> = ({
  currentPlan,
  onApplyReplan,
  onClose,
}) => {
  const [budget, setBudget] = useState<number>(currentPlan.input.totalBudget);
  const [guestCount, setGuestCount] = useState<number>(currentPlan.input.guestCount);
  const [date, setDate] = useState<string>(currentPlan.input.date);
  const [tier, setTier] = useState<EventTier>(currentPlan.input.tier);

  // Accessible Escape key listener for dialog dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Compute live preview of delta
  const { updatedPlan, delta } = calculateReplanDelta(currentPlan, {
    newBudget: budget,
    newGuestCount: guestCount,
    newDate: date,
    newTier: tier,
  });

  const budgetDiff = budget - currentPlan.input.totalBudget;
  const guestDiff = guestCount - currentPlan.input.guestCount;

  const handleApply = () => {
    onApplyReplan(updatedPlan, delta);
  };

  return (
    <motion.div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="replan-modal-title"
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
        style={{ maxWidth: '780px' }}
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 'var(--space-3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={22} style={{ color: 'var(--color-gold)' }} />
            <div>
              <h2 id="replan-modal-title" style={{ fontSize: '1.35rem' }}>
                Adaptive Constraint Replanning
              </h2>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                {budgetDiff !== 0 && (
                  <span className={`badge ${budgetDiff > 0 ? 'badge-primary' : 'badge-success'}`}>
                    Budget: {budgetDiff > 0 ? `+${formatINR(budgetDiff)}` : formatINR(budgetDiff)}
                  </span>
                )}
                {guestDiff !== 0 && (
                  <span className="badge badge-gold">
                    Guests: {guestDiff > 0 ? `+${guestDiff}` : guestDiff}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px' }}
            onClick={onClose}
            aria-label="Close replan modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info banner */}
        <div
          className="card"
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            borderColor: 'var(--border-gold)',
            padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-4)',
            fontSize: '0.825rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-light)', fontWeight: 600 }}>
            <ShieldCheck size={16} />
            <span>Preservation Guarantee:</span>
          </div>
          <p style={{ marginTop: '2px', color: 'var(--text-primary)' }}>
            All tasks you have marked completed, custom notes, and confirmed vendor bookings will be preserved intact. Only affected budget lines and recommendations are updated.
          </p>
        </div>

        {/* Constraint Modification Controls */}
        <div className="grid-2" style={{ marginBottom: 'var(--space-4)' }}>
          {/* Budget */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="replan-budget">
                Revised Budget
              </label>
              <span style={{ fontWeight: 700, color: 'var(--color-gold-light)', fontSize: '0.9rem' }}>
                {formatINR(budget)}
              </span>
            </div>
            <input
              id="replan-budget"
              type="number"
              step={25000}
              className="form-input"
              value={budget}
              onChange={(e) => setBudget(Math.max(10000, Number(e.target.value)))}
            />
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                onClick={() => setBudget((b) => Math.max(10000, b - 100000))}
              >
                - ₹1 Lakh
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                onClick={() => setBudget((b) => b + 100000)}
              >
                + ₹1 Lakh
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                onClick={() => setBudget((b) => b + 250000)}
              >
                + ₹2.5 Lakh
              </button>
            </div>
          </div>

          {/* Guest Count */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="replan-guests">
                Revised Guest Count
              </label>
              <span style={{ fontWeight: 700, color: 'var(--color-gold-light)', fontSize: '0.9rem' }}>
                {guestCount} Guests
              </span>
            </div>
            <input
              id="replan-guests"
              type="number"
              step={10}
              min={5}
              max={5000}
              className="form-input"
              value={guestCount}
              onChange={(e) => setGuestCount(Math.max(5, Number(e.target.value)))}
            />
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                onClick={() => setGuestCount((g) => Math.max(5, g - 50))}
              >
                - 50 Guests
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                onClick={() => setGuestCount((g) => g + 50)}
              >
                + 50 Guests
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                onClick={() => setGuestCount((g) => g + 100)}
              >
                + 100 Guests
              </button>
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 'var(--space-4)' }}>
          {/* Event Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="replan-date">
              Revised Event Date
            </label>
            <input
              id="replan-date"
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Tier */}
          <div className="form-group">
            <label className="form-label" htmlFor="replan-tier">
              Celebration Tier
            </label>
            <select
              id="replan-tier"
              className="form-select"
              value={tier}
              onChange={(e) => setTier(e.target.value as EventTier)}
            >
              <option value="budget">Budget Conscious</option>
              <option value="standard">Standard / Comfort</option>
              <option value="premium">Premium / Elegant</option>
              <option value="luxury">Luxury / Royal</option>
            </select>
          </div>
        </div>

        {/* Live Delta Explanation */}
        <div
          className="card"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-medium)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
            <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
              Deterministic Delta Analysis
            </span>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
            {delta.explanation}
          </p>

          {/* Trade-off bullet list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {delta.tradeOffSuggestions.map((sug, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.825rem' }}>
                <span style={{ color: 'var(--color-gold)', marginTop: '2px' }}>✦</span>
                <span style={{ color: 'var(--text-secondary)' }}>{sug}</span>
              </div>
            ))}
          </div>

          {/* Category Diff Mini-Table */}
          <div style={{ marginTop: 'var(--space-4)', maxHeight: '160px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ textAlign: 'left', padding: '4px' }}>Category</th>
                  <th style={{ textAlign: 'right', padding: '4px' }}>Previous</th>
                  <th style={{ textAlign: 'right', padding: '4px' }}>New</th>
                  <th style={{ textAlign: 'right', padding: '4px' }}>Variance</th>
                </tr>
              </thead>
              <tbody>
                {delta.categoryDiffs.map((diff) => (
                  <tr key={diff.categoryId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '6px 4px', fontWeight: 600 }}>{diff.categoryName}</td>
                    <td style={{ padding: '6px 4px', textAlign: 'right', color: 'var(--text-muted)' }}>
                      {formatINR(diff.previousAmount)}
                    </td>
                    <td style={{ padding: '6px 4px', textAlign: 'right', fontWeight: 600 }}>
                      {formatINR(diff.newAmount)}
                    </td>
                    <td
                      style={{
                        padding: '6px 4px',
                        textAlign: 'right',
                        fontWeight: 700,
                        color:
                          diff.deltaAmount > 0
                            ? 'var(--color-vermilion)'
                            : diff.deltaAmount < 0
                            ? 'var(--color-emerald)'
                            : 'var(--text-muted)',
                      }}
                    >
                      {diff.deltaAmount > 0 ? `+${formatINR(diff.deltaAmount)}` : formatINR(diff.deltaAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <motion.button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="button"
            className="btn btn-vermilion"
            onClick={handleApply}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Apply Changes & Replan
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
