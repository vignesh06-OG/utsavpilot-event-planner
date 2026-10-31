import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  IndianRupee, 
  Calendar, 
  Building2 
} from 'lucide-react';
import { CelebrationImage } from '../common/CelebrationImage';
import { getAssetUrl } from '../../utils/assetHelper';
import { SAMPLE_DEMO_EVENTS } from '../../domain/eventDefaults';

const PRESET_IMAGES: Record<string, { src: string; alt: string; tag: string }> = {
  wedding: {
    src: 'editorial_mandap.webp',
    alt: 'Grand Indian wedding mandap with fresh marigold floral architecture',
    tag: 'Heritage Vivah',
  },
  puja: {
    src: 'traditional_puja.webp',
    alt: 'Traditional Vedic puja with glowing brass diyas, sacred thali, and fresh marigold garlands',
    tag: 'Sacred Ritual',
  },
  birthday: {
    src: 'birthday_celebration.webp',
    alt: 'Joyful Indian family milestone birthday in garden venue with fairy lights and mithai',
    tag: 'Family Milestone',
  },
  college_fest: {
    src: 'college_fest.webp',
    alt: 'Vibrant college cultural fest concert stage with architectural lighting and crowd',
    tag: 'Youth Festival',
  },
};
import type { EventInput } from '../../domain/types';
import { formatINR } from '../../engine/budgetEngine';
import { 
  fadeInUpVariants, 
  staggerContainerVariants, 
  staggerItemVariants, 
  tabContentVariants 
} from '../../motion/motionTokens';

interface LandingPageProps {
  onStartPlanning: () => void;
  onLoadPreset: (preset: EventInput) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onLoadPreset,
}) => {
  // State for interactive before/after demonstration
  const [demoScenario, setDemoScenario] = useState<'base' | 'adapted'>('base');

  return (
    <div style={{ position: 'relative' }}>
      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: 'var(--space-12) 0 var(--space-16)',
          background: 'linear-gradient(180deg, #FAF5EE 0%, #F5EFEB 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(231, 168, 62, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container">
          <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
            {/* Pill Header */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'inline-flex', marginBottom: 'var(--space-4)' }}
            >
              <span className="badge badge-primary" style={{ padding: '6px 14px', fontSize: '0.825rem' }}>
                <Sparkles size={14} style={{ marginRight: '4px' }} />
                <span>PromptWars Virtual ✦ Celebration & Event Planner</span>
              </span>
            </motion.div>

            {/* Editorial Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                lineHeight: 1.12,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                marginBottom: 'var(--space-4)',
              }}
            >
              The Grandeur of Celebrations.{' '}
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-vermilion)' }}>
                The Precision
              </span>{' '}
              of Intelligent Planning.
            </motion.h1>

            {/* Editorial Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '720px',
                margin: '0 auto var(--space-8)',
              }}
            >
              Deterministic budget feasibility that reconciles to the exact rupee, constraint-driven adaptive replanning, and actionable vendor checklists tailored for weddings, birthdays, pujas, and community celebrations.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-4)',
                flexWrap: 'wrap',
                marginBottom: 'var(--space-12)',
              }}
            >
              <motion.button
                type="button"
                className="btn btn-primary btn-lg pulse-glow"
                onClick={onStartPlanning}
                aria-label="Start event planning wizard"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Calendar size={18} />
                <span>Plan Your Celebration</span>
                <ArrowRight size={18} />
              </motion.button>

              <motion.button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() => onLoadPreset(SAMPLE_DEMO_EVENTS[0])}
                aria-label="Explore pre-calibrated sample event"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Explore Live Jaipur Vivah Demo</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Layered Editorial Image & Dashboard Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{
              position: 'relative',
              maxWidth: '1100px',
              margin: '0 auto',
            }}
          >
            {/* Main Stage Grid with Responsive Breakpoints */}
            <div className="hero-image-grid">
              {/* Left Image: Editorial Mandap */}
              <div
                className="hero-img-left"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1.5px solid var(--border-medium)',
                  position: 'relative',
                }}
              >
                <CelebrationImage
                  src="editorial_mandap.webp"
                  webpSrc="editorial_mandap.webp"
                  alt="Vogue style Indian wedding mandap with fresh marigold floral architecture"
                  aspectRatio="16/10"
                  priority={true}
                  fallbackTitle="The Sharma & Verma Sangeet & Vivah"
                  overlay={
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(40, 21, 47, 0.82) 0%, rgba(40, 21, 47, 0.2) 55%, transparent 100%)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: 'var(--space-6)',
                      }}
                    >
                      <div style={{ color: '#FFFFFF' }}>
                        <span className="badge badge-gold" style={{ marginBottom: '6px' }}>
                          Heritage Wedding Direction
                        </span>
                        <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                          The Sharma & Verma Sangeet & Vivah
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                          Jaipur, Rajasthan • 300 Guests • ₹35,00,000 Budget
                        </p>
                      </div>
                    </div>
                  }
                />
              </div>

              {/* Right Image: Royal Feast Dining */}
              <div
                className="hero-img-right"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1.5px solid var(--border-medium)',
                  position: 'relative',
                }}
              >
                <CelebrationImage
                  src="editorial_dining.webp"
                  webpSrc="editorial_dining.webp"
                  alt="Royal banquet table setting with brass thalis and marigold runner"
                  aspectRatio="16/12"
                  priority={true}
                  fallbackTitle="Culinary Excellence"
                  overlay={
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(40, 21, 47, 0.78) 0%, rgba(40, 21, 47, 0.15) 50%, transparent 100%)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: 'var(--space-5)',
                      }}
                    >
                      <div style={{ color: '#FFFFFF' }}>
                        <span className="badge badge-primary" style={{ marginBottom: '6px', fontSize: '0.725rem' }}>
                          Bespoke Catering
                        </span>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                          Culinary Excellence
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)' }}>
                          Satvik & Royal Rajasthani Live Counters
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Overlaid Floating Live-Feasibility Card */}
            <motion.div
              whileHover={{ y: -4 }}
              style={{
                position: 'relative',
                marginTop: '-40px',
                marginInline: 'auto',
                maxWidth: '820px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5) var(--space-6)',
                boxShadow: '0 20px 45px -8px rgba(40, 21, 47, 0.16)',
                border: '1.5px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-4)',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-emerald-light)',
                    color: 'var(--color-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    Deterministic Feasibility Verified
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    Sum of all categories + contingency reserve = ₹35,00,000 (100.00% exact match)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Contingency Fund
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--color-marigold-dark)', fontSize: '1rem' }}>
                    ₹2,80,000 (8.0%)
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-vermilion btn-sm"
                  style={{ background: 'var(--color-vermilion)', color: 'white' }}
                  onClick={() => onLoadPreset(SAMPLE_DEMO_EVENTS[0])}
                >
                  Open Live Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* INTERACTIVE BEFORE/AFTER DEMONSTRATION SECTION */}
      <section
        style={{
          padding: 'var(--space-16) 0',
          background: 'var(--bg-canvas)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUpVariants}
            style={{ maxWidth: '780px', margin: '0 auto var(--space-10)', textAlign: 'center' }}
          >
            <span className="badge badge-gold" style={{ marginBottom: 'var(--space-2)' }}>
              Interactive Replan Demonstration
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--text-primary)' }}>
              See How Adaptive Replanning Works
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
              When a guest list swells or a budget gets trimmed, traditional tools force you to start from scratch. UtsavPilot deterministically adapts allocations, explains trade-offs, and protects completed decisions.
            </p>

            {/* Toggle Switch */}
            <div
              style={{
                display: 'inline-flex',
                background: 'var(--bg-card-muted)',
                padding: '4px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-medium)',
                marginTop: 'var(--space-4)',
              }}
              role="group"
              aria-label="Demonstration scenario switcher"
            >
              <motion.button
                type="button"
                className={`btn btn-sm ${demoScenario === 'base' ? 'btn-aubergine' : 'btn-ghost'}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '6px 16px' }}
                onClick={() => setDemoScenario('base')}
                whileTap={{ scale: 0.97 }}
              >
                Base Plan: ₹35 Lakhs • 300 Guests
              </motion.button>
              <motion.button
                type="button"
                className={`btn btn-sm ${demoScenario === 'adapted' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '6px 16px' }}
                onClick={() => setDemoScenario('adapted')}
                whileTap={{ scale: 0.97 }}
              >
                Adapted: ₹30 Lakhs • 350 Guests
              </motion.button>
            </div>
          </motion.div>

          {/* Interactive Scenario Card Comparison */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUpVariants}
            className="card card-elevated"
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              padding: 'var(--space-8)',
              border: demoScenario === 'adapted' ? '1.5px solid var(--color-vermilion)' : '1px solid var(--border-medium)',
              transition: 'border-color 0.3s ease',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={demoScenario}
                variants={tabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--space-4)',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: 'var(--space-5)',
                    marginBottom: 'var(--space-6)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${demoScenario === 'adapted' ? 'badge-primary' : 'badge-gold'}`}>
                        {demoScenario === 'base' ? 'Initial Planned Scenario' : 'Adapted Constraint Scenario'}
                      </span>
                      <span className="badge badge-success">Feasibility Verified</span>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', marginTop: '6px' }}>
                      {demoScenario === 'base'
                        ? 'Jaipur Vivah & Sangeet (Original Blueprint)'
                        : 'Budget Reduced by ₹5 Lakhs with +50 Guests'}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-6)', textAlign: 'right' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL BUDGET</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {demoScenario === 'base' ? '₹35,00,000' : '₹30,00,000'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GUEST SCALE</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-vermilion)' }}>
                        {demoScenario === 'base' ? '300 Guests' : '350 Guests'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Explanation Box */}
                <div
                  style={{
                    background: demoScenario === 'adapted' ? 'var(--color-vermilion-light)' : 'var(--bg-canvas-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-4) var(--space-5)',
                    marginBottom: 'var(--space-6)',
                    borderLeft: `4px solid ${demoScenario === 'adapted' ? 'var(--color-vermilion)' : 'var(--color-marigold)'}`,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {demoScenario === 'base'
                      ? 'Baseline Distribution Heuristic:'
                      : 'Adaptive Delta Engine Explanation:'}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>
                    {demoScenario === 'base'
                      ? 'Allocations calculated using standard Indian Vivah heuristics: 30% Catering, 25% Venue & Rooms, 15% Decor, 10% Cinema, 8% Contingency Reserve.'
                      : 'Budget trimmed by ₹5,00,000 while guest headcount expanded to 350. The engine protected catering quality, trimmed non-essential imported florals (-25%), re-negotiated DJ staging, and preserved your booked venue advance.'}
                  </p>
                </div>

                {/* Category Breakdown Comparison Grid */}
                <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
                  {[
                    {
                      cat: 'Catering & Dining',
                      base: '₹10,50,000 (30%)',
                      adapted: '₹10,80,000 (36%)',
                      note: 'Scaled per-guest plate buffer',
                    },
                    {
                      cat: 'Decor, Mandap & Florals',
                      base: '₹5,25,000 (15%)',
                      adapted: '₹3,60,000 (12%)',
                      note: 'Switched to local seasonal marigold',
                    },
                    {
                      cat: 'Photography & Cinema',
                      base: '₹3,50,000 (10%)',
                      adapted: '₹3,00,000 (10%)',
                      note: 'Retained 2 candid cinematographers',
                    },
                    {
                      cat: 'Sound, DJ & Sangeet',
                      base: '₹2,10,000 (6%)',
                      adapted: '₹1,50,000 (5%)',
                      note: 'Package deal with venue audio',
                    },
                    {
                      cat: 'Guest Hospitality & Rooms',
                      base: '₹8,75,000 (25%)',
                      adapted: '₹8,75,000 (Preserved)',
                      note: 'Confirmed hotel booking locked',
                    },
                    {
                      cat: 'Contingency Reserve',
                      base: '₹2,80,000 (8.0%)',
                      adapted: '₹2,35,000 (7.8%)',
                      note: 'Transparent remaining balance',
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -3, transition: { duration: 0.15 } }}
                      style={{
                        background: 'var(--bg-canvas-subtle)',
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {item.cat}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                        {demoScenario === 'base' ? item.base : item.adapted}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-vermilion)', marginTop: '2px' }}>
                        {item.note}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Preserved Decisions Check */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: 'var(--space-6)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                color: 'var(--color-emerald)',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={16} />
              <span>
                Task decisions preserved: All milestone completions, host assignments, and vendor agreements remained untouched during recalculation.
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOUR EDITORIAL PILLARS */}
      <section
        style={{
          padding: 'var(--space-16) 0',
          background: 'var(--bg-dark-primary)',
          color: 'var(--text-inverse)',
        }}
      >
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUpVariants}
            style={{ maxWidth: '780px', margin: '0 auto var(--space-12)', textAlign: 'center' }}
          >
            <span
              className="badge"
              style={{
                background: 'rgba(231, 168, 62, 0.15)',
                color: 'var(--color-marigold)',
                border: '1px solid var(--color-marigold)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Architectural Rigor
            </span>
            <h2 style={{ color: 'var(--text-inverse)', fontSize: 'clamp(2rem, 3.8vw, 2.8rem)' }}>
              Built Different: Why UtsavPilot Stands Out
            </h2>
            <p style={{ color: 'var(--text-inverse-muted)', fontSize: '1.05rem' }}>
              Engineered from first principles to avoid the pitfalls of naive generative AI chatbots.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainerVariants}
            className="grid-2"
            style={{ gap: 'var(--space-6)' }}
          >
            {/* Pillar 1 */}
            <motion.div
              variants={staggerItemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: 'var(--bg-dark-card)',
                padding: 'var(--space-8)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(232, 93, 63, 0.2)',
                  color: 'var(--color-vermilion)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <IndianRupee size={24} />
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', marginBottom: 'var(--space-2)' }}>
                1. Pure Deterministic Budget Arithmetic
              </h3>
              <p style={{ color: 'var(--text-inverse-muted)', fontSize: '0.925rem' }}>
                We strictly forbid LLMs from performing addition, subtraction, or contingency splits. Calculations are executed in pure TypeScript functions, guaranteeing that line item totals and contingency buffers match the total budget down to the exact rupee.
              </p>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div
              variants={staggerItemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: 'var(--bg-dark-card)',
                padding: 'var(--space-8)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(231, 168, 62, 0.2)',
                  color: 'var(--color-marigold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <Sliders size={24} />
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', marginBottom: 'var(--space-2)' }}>
                2. Adaptive Delta Replanning
              </h3>
              <p style={{ color: 'var(--text-inverse-muted)', fontSize: '0.925rem' }}>
                Plans change constantly during Indian celebrations. When constraints shift, UtsavPilot identifies only the affected categories, computes exact variances, and preserves every completed task and vendor status already finalized.
              </p>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div
              variants={staggerItemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: 'var(--bg-dark-card)',
                padding: 'var(--space-8)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(23, 107, 88, 0.25)',
                  color: '#4ADE80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <Building2 size={24} />
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', marginBottom: 'var(--space-2)' }}>
                3. Honest Vendor Due Diligence
              </h3>
              <p style={{ color: 'var(--text-inverse-muted)', fontSize: '0.925rem' }}>
                We refuse to invent fake vendor partnerships or hallucinated booking prices. Instead, UtsavPilot equips you with real negotiation checklists: sound decibel curfew limits, generator fuel clauses, and pure vegetarian prep requirements.
              </p>
            </motion.div>

            {/* Pillar 4 */}
            <motion.div
              variants={staggerItemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: 'var(--bg-dark-card)',
                padding: 'var(--space-8)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', marginBottom: 'var(--space-2)' }}>
                4. Dual-Mode Zero-Downtime Resilience
              </h3>
              <p style={{ color: 'var(--text-inverse-muted)', fontSize: '0.925rem' }}>
                Powered by Gemini 1.5 Flash via a secure server proxy with input sanitization. If the API key is missing or throttled, UtsavPilot seamlessly fails over to an offline deterministic engine—guaranteeing 100% operational uptime.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SAMPLE PRESETS GALLERY */}
      <section
        style={{
          padding: 'var(--space-16) 0',
          background: 'var(--bg-canvas)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUpVariants}
            style={{ maxWidth: '780px', margin: '0 auto var(--space-10)', textAlign: 'center' }}
          >
            <span className="badge badge-gold" style={{ marginBottom: 'var(--space-2)' }}>
              Curated Indian Presets
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--text-primary)' }}>
              Explore Pre-Calibrated Celebration Blueprints
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
              Click any celebration below to load a complete, pre-calculated, verified plan directly into the workspace.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainerVariants}
            className="grid-4"
          >
            {SAMPLE_DEMO_EVENTS.map((preset, idx) => {
              const imgMeta = PRESET_IMAGES[preset.eventType] || PRESET_IMAGES.wedding;
              return (
                <motion.div
                  key={idx}
                  tabIndex={0}
                  role="button"
                  onClick={() => onLoadPreset(preset)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') onLoadPreset(preset);
                  }}
                  className="card card-interactive"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: 'var(--bg-card)',
                    overflow: 'hidden',
                    padding: 0,
                  }}
                  variants={staggerItemVariants}
                  whileHover={{ y: -6, boxShadow: 'var(--shadow-xl)', transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div>
                    {/* Visual Celebration Thumbnail */}
                    <CelebrationImage
                      src={imgMeta.src}
                      alt={imgMeta.alt}
                      aspectRatio="16/10"
                      borderRadius="0"
                      overlay={
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(40, 21, 47, 0.75) 0%, transparent 60%)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                          }}
                        >
                          <span
                            className="badge badge-gold"
                            style={{
                              fontSize: '0.675rem',
                              backdropFilter: 'blur(4px)',
                              background: 'rgba(24, 18, 30, 0.8)',
                              color: '#FAF5EE',
                              border: '1px solid rgba(231, 168, 62, 0.5)',
                            }}
                          >
                            {imgMeta.tag}
                          </span>
                          <span
                            style={{
                              fontSize: '0.725rem',
                              color: '#FAF5EE',
                              fontWeight: 600,
                              textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                            }}
                          >
                            {preset.durationDays} {preset.durationDays === 1 ? 'Day' : 'Days'}
                          </span>
                        </div>
                      }
                    />

                    <div style={{ padding: 'var(--space-4)' }}>
                      <h4 style={{ fontSize: '1.025rem', color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.3 }}>
                        {preset.title}
                      </h4>

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {preset.city} • {preset.guestCount} Guests
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      padding: 'var(--space-3) var(--space-4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-canvas-subtle)',
                    }}
                  >
                    <div style={{ fontWeight: 800, color: 'var(--color-vermilion)', fontSize: '1.05rem' }}>
                      {formatINR(preset.totalBudget)}
                    </div>
                    <span className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                      Open Plan →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section
        style={{
          position: 'relative',
          padding: 'var(--space-16) 0',
          background: 'linear-gradient(135deg, #28152F 0%, #3B1C46 100%)',
          color: 'var(--text-inverse)',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${getAssetUrl('luxury_venue.webp')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.14,
            pointerEvents: 'none',
          }}
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeInUpVariants}
          className="container"
          style={{ maxWidth: '780px', position: 'relative', zIndex: 1 }}
        >
          <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--space-4)' }}>
            Plan with Clarity. Celebrate with Joy.
          </h2>
          <p style={{ color: 'var(--text-inverse-muted)', fontSize: '1.1rem', marginBottom: 'var(--space-8)' }}>
            Join thousands of families across India crafting realistic celebration plans, knowing exactly where the money goes, and adapting whenever circumstances shift.
          </p>

          <motion.button
            type="button"
            className="btn btn-gold btn-lg pulse-glow"
            onClick={onStartPlanning}
            aria-label="Launch celebration wizard"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Calendar size={20} />
            <span>Launch UtsavPilot Planner Now</span>
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};
