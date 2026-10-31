import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Tag
} from 'lucide-react';
import type { VendorChecklistItem, VendorStatus } from '../../domain/types';
import { accordionVariants } from '../../motion/motionTokens';

interface VendorBoardProps {
  vendors: VendorChecklistItem[];
  onUpdateVendorStatus: (vendorId: string, status: VendorStatus, bookedName?: string, agreedPrice?: number) => void;
}

const STATUS_LABELS: Record<VendorStatus, { label: string; badgeClass: string }> = {
  not_contacted: { label: 'Not Contacted', badgeClass: 'badge-ghost' },
  shortlisted: { label: 'Shortlisted', badgeClass: 'badge-info' },
  negotiating: { label: 'Negotiating', badgeClass: 'badge-warning' },
  booked: { label: 'Booked & Confirmed', badgeClass: 'badge-success' },
};

export const VendorBoard: React.FC<VendorBoardProps> = ({
  vendors,
  onUpdateVendorStatus,
}) => {
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedVendorId(expandedVendorId === id ? null : id);
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
          marginBottom: 'var(--space-4)',
        }}
      >
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={22} style={{ color: 'var(--color-primary)' }} />
            <span>Vendor Negotiation & Transparency Checklist</span>
          </h2>
          <p style={{ fontSize: '0.875rem' }}>
            Honest market benchmark ranges with critical due-diligence and contract negotiation questions.
          </p>
        </div>

        <div className="badge badge-gold">
          <ShieldCheck size={14} />
          <span>Zero Fabricated Quotes • 100% Transparent</span>
        </div>
      </div>

      {/* Transparency Guarantee Note */}
      <div
        className="card"
        style={{
          background: 'rgba(23, 107, 88, 0.08)',
          border: '1px solid var(--border-emerald)',
          padding: 'var(--space-3) var(--space-4)',
          marginBottom: 'var(--space-4)',
          fontSize: '0.825rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <ShieldCheck size={18} style={{ color: 'var(--color-emerald)', flexShrink: 0 }} />
        <span style={{ color: 'var(--text-primary)' }}>
          <strong>Pricing Integrity Disclosure:</strong> Costs shown below are based on regional industry benchmarks for this celebration tier. UtsavPilot does not fabricate live quotes or pretend to hold automated booking partnerships.
        </span>
      </div>

      {/* Vendors List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {vendors.map((v) => {
          const isExpanded = expandedVendorId === v.id;
          const statusMeta = STATUS_LABELS[v.status] || STATUS_LABELS.not_contacted;

          return (
            <motion.div
              key={v.id}
              layout
              className="card"
              style={{
                padding: 'var(--space-4)',
                background: isExpanded ? 'var(--bg-card-elevated)' : 'var(--bg-card)',
                borderColor: v.status === 'booked' ? 'var(--color-success-border)' : 'var(--border-subtle)',
              }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
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
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.975rem' }}>{v.serviceTitle}</span>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {v.category}
                    </span>
                    <span className={`badge ${statusMeta.badgeClass}`} style={{ fontSize: '0.7rem' }}>
                      {statusMeta.label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Benchmark Range: <strong style={{ color: 'var(--color-gold-light)' }}>{v.benchmarkCostRange}</strong>
                    </span>
                    <span className="badge badge-gold" style={{ fontSize: '0.675rem' }}>
                      <Tag size={10} /> {v.provenance}
                    </span>
                  </div>
                </div>

                {/* Status Selector & Expand button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor={`vendor-status-${v.id}`} className="sr-only">
                    Change status for {v.serviceTitle}
                  </label>
                  <select
                    id={`vendor-status-${v.id}`}
                    className="form-select"
                    style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', width: 'auto' }}
                    value={v.status}
                    onChange={(e) => onUpdateVendorStatus(v.id, e.target.value as VendorStatus)}
                  >
                    <option value="not_contacted">Not Contacted</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="negotiating">Negotiating</option>
                    <option value="booked">Booked & Confirmed</option>
                  </select>

                  <motion.button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggleExpand(v.id)}
                    aria-expanded={isExpanded}
                    aria-label={`Toggle details for ${v.serviceTitle}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    <span>{isExpanded ? 'Hide Due Diligence' : 'Questions & Tips'}</span>
                  </motion.button>
                </div>
              </div>

              {/* Due Diligence & Negotiation Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    variants={accordionVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    style={{
                      overflow: 'hidden',
                      marginTop: 'var(--space-4)',
                      paddingTop: 'var(--space-4)',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ marginBottom: 'var(--space-3)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gold-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Key Questions to Ask This Vendor:
                      </div>
                      <ul style={{ paddingLeft: '18px', listStyleType: 'circle' }}>
                        {v.keyQuestionsToAsk.map((q, idx) => (
                          <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      style={{
                        background: 'var(--bg-input)',
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-sm)',
                        borderLeftColor: 'var(--color-gold)',
                        borderLeftWidth: '3px',
                        borderLeftStyle: 'solid',
                        fontSize: '0.825rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <strong>💡 Pro Verification Tip:</strong> {v.verificationTip}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
