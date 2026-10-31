import React from 'react';
import { motion } from 'motion/react';
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
import { staggerContainerVariants, staggerItemVariants } from '../../motion/motionTokens';

interface ExecutiveSummaryProps {
  plan: EventPlan;
  onOpenReplan: () => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ plan, onOpenReplan }) => {
  const { input, budgetReport, summary, modelUsed, isDemoSample } = plan;

  // Calculate days remaining in pure memoized state
  const [now] = React.useState(() => Date.now());
  const daysRemaining = React.useMemo(() => {
    const eventTime = new Date(input.date).getTime();
    return Math.ceil((eventTime - now) / (1000 * 60 * 60 * 24));
  }, [input.date, now]);

  return (
    <motion.div
      className="card card-elevated"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 'var(--space-6)',
        border: '1.5px solid var(--border-gold)',
        background: 'var(--bg-card)',
        padding: 'var(--space-8)',
      }}
    >
      {/* Editorial Decorative Background Watermark */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '45%',
          backgroundImage: 'url(/editorial_mandap.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          pointerEvents: 'none',
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Top Badges Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
          <span className="badge badge-primary">
            ✦ {input.eventType.replace('_', ' ').toUpperCase()}
          </span>

          <span className={`badge ${budgetReport.isFeasible ? 'badge-success' : 'badge-danger'}`}>
            {budgetReport.isFeasible ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}
            {budgetReport.isFeasible ? 'Budget Feasible' : 'Feasibility Shortfall'}
          </span>

          <span className={`badge ${modelUsed === 'gemini-flash' ? 'badge-info' : 'badge-gold'}`}>
            {modelUsed === 'gemini-flash' ? 'AI: Gemini 1.5 Flash' : 'Deterministic Engine'}
          </span>

          {isDemoSample && (
            <span className="badge badge-gold" title="Loaded from pre-calibrated sample data">
              Sample Celebration
            </span>
          )}

          {daysRemaining > 0 ? (
            <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              <span>{daysRemaining} Days to Celebration</span>
            </span>
          ) : (
            <span className="badge badge-gold">Celebration Day</span>
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
          <div style={{ maxWidth: '820px' }}>
            <h1 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
              {input.title}
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {summary}
            </p>
          </div>

          <div>
            <motion.button
              type="button"
              className="btn btn-primary pulse-glow"
              onClick={onOpenReplan}
              aria-label="Adapt or replan event constraints"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Sliders size={16} />
              <span>Adapt & Replan</span>
            </motion.button>
          </div>
        </div>

        {/* Financial Hierarchy Metric Cards */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid-4"
          style={{
            marginTop: 'var(--space-8)',
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {/* Card 1: Event Schedule */}
          <motion.div
            variants={staggerItemVariants}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            style={{
              background: 'var(--bg-canvas-subtle)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-marigold-light)',
                color: 'var(--color-marigold-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calendar size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Celebration Date
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.975rem', color: 'var(--text-primary)' }}>
                {input.date}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-vermilion)' }}>
                {input.durationDays} {input.durationDays === 1 ? 'Day Ceremony' : 'Days Celebrations'}
              </div>
            </div>
          </motion.div>

          {/* Card 2: Venue & Tier */}
          <motion.div
            variants={staggerItemVariants}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            style={{
              background: 'var(--bg-canvas-subtle)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: '#F2EEF5',
                color: 'var(--bg-dark-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Venue & Atmosphere
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.975rem', color: 'var(--text-primary)' }}>
                {input.city}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {input.tier} Tier Excellence
              </div>
            </div>
          </motion.div>

          {/* Card 3: Guests & Per Head */}
          <motion.div
            variants={staggerItemVariants}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            style={{
              background: 'var(--bg-canvas-subtle)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-emerald-light)',
                color: 'var(--color-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Guest Scale
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.975rem', color: 'var(--text-primary)' }}>
                {input.guestCount} Guests
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                ~{formatINR(budgetReport.costPerGuest)} / head
              </div>
            </div>
          </motion.div>

          {/* Card 4: Total Reconciled Budget */}
          <motion.div
            variants={staggerItemVariants}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            style={{
              background: 'var(--bg-canvas-subtle)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-vermilion-light)',
                color: 'var(--color-vermilion)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IndianRupee size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Reconciled Budget
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-vermilion)' }}>
                {formatINR(input.totalBudget)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-marigold-dark)', fontWeight: 600 }}>
                {formatLakhCrore(input.totalBudget)} (100% Match)
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
