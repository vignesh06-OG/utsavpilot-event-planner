import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Users, 
  IndianRupee, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Info
} from 'lucide-react';
import type { EventInput, EventType, EventTier } from '../../domain/types';
import { MINIMUM_PER_GUEST_BENCHMARKS, EVENT_CATEGORY_CONFIG } from '../../domain/eventDefaults';
import { formatINR } from '../../engine/budgetEngine';
import { CelebrationImage } from '../common/CelebrationImage';
import { tabContentVariants } from '../../motion/motionTokens';

interface EventWizardProps {
  initialValues?: Partial<EventInput>;
  onSubmit: (input: EventInput) => void;
  onCancel?: () => void;
  isLoading: boolean;
}

const TIER_DESCRIPTIONS: Record<EventTier, { title: string; desc: string }> = {
  budget: { title: 'Budget Conscious', desc: 'Practical community venues, core catering, smart essentials' },
  standard: { title: 'Standard / Comfort', desc: 'Quality banquet hall, full buffet spread, pleasant florals' },
  premium: { title: 'Premium / Elegant', desc: 'Top tier hotel/lawn, candid cinema, live food counters' },
  luxury: { title: 'Luxury / Royal', desc: 'Palatial destination, custom designer decor, celebrity artists' },
};

export const EventWizard: React.FC<EventWizardProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [eventType, setEventType] = useState<EventType>(initialValues?.eventType || 'wedding');
  // Title starts empty for new plans so contextual placeholders and examples are clearly displayed
  const [title, setTitle] = useState<string>(initialValues?.title || '');
  const [hasUserEditedTitle, setHasUserEditedTitle] = useState<boolean>(Boolean(initialValues?.title));
  const [date, setDate] = useState<string>(() => initialValues?.date || '2026-11-28');
  const [durationDays, setDurationDays] = useState<number>(initialValues?.durationDays || 2);
  const [city, setCity] = useState<string>(initialValues?.city || 'Jaipur, Rajasthan');
  const [tier, setTier] = useState<EventTier>(initialValues?.tier || 'standard');
  const [guestCount, setGuestCount] = useState<number>(initialValues?.guestCount || 250);
  const [totalBudget, setTotalBudget] = useState<number>(initialValues?.totalBudget || 2000000);
  const [dietaryRequirements, setDietaryRequirements] = useState<string[]>(
    initialValues?.dietaryRequirements || ['Strict Vegetarian', 'Live Chaat Counter']
  );
  const [accessibilityNeeds, setAccessibilityNeeds] = useState<string[]>(
    initialValues?.accessibilityNeeds || ['Wheelchair ramp for elders']
  );
  const [priorities, setPriorities] = useState<string[]>(
    initialValues?.priorities || ['Memorable dining experience', 'Authentic traditional decor']
  );
  const [styleTheme, setStyleTheme] = useState<string>(
    initialValues?.styleTheme || ''
  );
  const [notes, setNotes] = useState<string>(
    initialValues?.notes || ''
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentCategoryConfig = EVENT_CATEGORY_CONFIG[eventType] || EVENT_CATEGORY_CONFIG.wedding;

  // Dynamic cost per guest check
  const costPerGuest = guestCount > 0 ? Math.round(totalBudget / guestCount) : 0;
  const benchmarkCost = MINIMUM_PER_GUEST_BENCHMARKS[eventType]?.[tier] || 500;
  const isUnderBudget = costPerGuest < benchmarkCost;

  const handleCategorySelect = (newType: EventType) => {
    setEventType(newType);
    const cfg = EVENT_CATEGORY_CONFIG[newType];
    
    // If user has not typed a custom title, keep title empty so new category placeholder/hint is shown.
    // If user HAS entered a custom title, it is strictly preserved.
    if (!hasUserEditedTitle || !title.trim()) {
      setTitle('');
    }

    // Adapt default guest scale and budget if fresh wizard
    if (!initialValues) {
      setGuestCount(cfg.defaultGuestCount);
      setTotalBudget(cfg.defaultBudget);
      setDurationDays(cfg.defaultDurationDays);
    }
  };

  const toggleArrayItem = (item: string, current: string[], setter: (v: string[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter((i) => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 3) {
      errs.title = `Please enter your celebration title (e.g. "${currentCategoryConfig.exampleTitle}").`;
    }
    if (!date) errs.date = 'Please select an event date.';
    if (!city.trim()) errs.city = 'City or location is required.';
    if (durationDays < 1) errs.durationDays = 'Duration must be at least 1 day.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (guestCount < 5) errs.guestCount = 'Guest count must be at least 5.';
    if (totalBudget < 10000) errs.totalBudget = 'Budget must be at least ₹10,000.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;

    const inputData: EventInput = {
      eventType,
      title: title.trim(),
      date,
      durationDays,
      city: city.trim(),
      tier,
      guestCount,
      totalBudget,
      currency: 'INR',
      dietaryRequirements,
      accessibilityNeeds,
      priorities,
      styleTheme: styleTheme.trim(),
      notes: notes.trim(),
    };

    onSubmit(inputData);
  };

  return (
    <div className="card card-elevated" style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Wizard Header & Stepper */}
      <div style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles style={{ color: 'var(--color-gold)' }} size={24} />
            <span>Plan Your Celebration</span>
          </h2>
          <span className="badge badge-gold">Step {step} of 3</span>
        </div>

        {/* Step tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {[
            { s: 1, label: '1. Basics & Date', short: '1. Basics' },
            { s: 2, label: '2. Scale & Budget', short: '2. Budget' },
            { s: 3, label: '3. Nuances & Review', short: '3. Review' },
          ].map((st) => (
            <div
              key={st.s}
              onClick={() => {
                if (st.s < step) setStep(st.s as any);
              }}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: 'var(--radius-md)',
                background: step === st.s ? 'rgba(232, 93, 63, 0.12)' : 'var(--bg-input)',
                border: `1px solid ${step === st.s ? 'var(--color-vermilion)' : 'var(--border-subtle)'}`,
                color: step === st.s ? 'var(--color-aubergine)' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: step === st.s ? 700 : 500,
                textAlign: 'center',
                cursor: st.s < step ? 'pointer' : 'default',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={st.label}
            >
              <span>{st.short}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <AnimatePresence mode="wait">
          {/* STEP 1: Celebration Basics */}
          {step === 1 && (
            <motion.div
              key="step-1"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
            <div className="form-group">
              <label className="form-label" htmlFor="event-type-grid">
                Celebration Type
              </label>
              <div id="event-type-grid" className="grid-3" role="radiogroup" aria-label="Celebration Type">
                {(Object.keys(EVENT_CATEGORY_CONFIG) as EventType[]).map((type) => {
                  const meta = EVENT_CATEGORY_CONFIG[type];
                  const isSelected = eventType === type;
                  return (
                    <div
                      key={type}
                      tabIndex={0}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleCategorySelect(type)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') handleCategorySelect(type);
                      }}
                      className={`card card-interactive ${isSelected ? 'card-elevated' : ''}`}
                      style={{
                        padding: 0,
                        overflow: 'hidden',
                        borderColor: isSelected ? 'var(--color-vermilion)' : 'var(--border-subtle)',
                        background: isSelected ? 'rgba(232, 93, 63, 0.08)' : 'var(--bg-card)',
                        boxShadow: isSelected ? '0 0 0 2px var(--color-vermilion), var(--shadow-md)' : 'none',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <div style={{ position: 'relative' }}>
                        <CelebrationImage
                          src={meta.image}
                          alt={meta.label}
                          aspectRatio="16/9"
                          borderRadius="0"
                          overlay={
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: isSelected 
                                  ? 'linear-gradient(to top, rgba(40, 21, 47, 0.88) 0%, rgba(232, 93, 63, 0.35) 100%)'
                                  : 'linear-gradient(to top, rgba(40, 21, 47, 0.78) 0%, rgba(40, 21, 47, 0.2) 100%)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                padding: '8px 10px',
                              }}
                            >
                              <span style={{ fontSize: '1.25rem', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>{meta.icon}</span>
                              {isSelected && (
                                <span
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-vermilion)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                                  }}
                                >
                                  <CheckCircle2 size={14} />
                                </span>
                              )}
                            </div>
                          }
                        />
                      </div>
                      <div style={{ padding: 'var(--space-3)' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.925rem', color: isSelected ? 'var(--color-vermilion)' : 'var(--text-primary)' }}>
                          {meta.label}
                        </div>
                        <p style={{ fontSize: '0.75rem', marginTop: '3px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                          {meta.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="event-title">
                  Celebration Title <span style={{ color: 'var(--color-primary)' }}>*</span>
                </label>
                <input
                  id="event-title"
                  type="text"
                  className={`form-input ${errors.title ? 'form-input-error' : ''}`}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setHasUserEditedTitle(true);
                    if (errors.title) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.title;
                        return next;
                      });
                    }
                  }}
                  placeholder={currentCategoryConfig.titlePlaceholder}
                  required
                />
                <div 
                  id="event-title-example-hint"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Category example:</span>
                  <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontWeight: 500 }}>
                    {currentCategoryConfig.exampleTitle}
                  </span>
                </div>
                {errors.title && <div className="form-error-msg">{errors.title}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="event-city">
                  City & Venue Area <span style={{ color: 'var(--color-primary)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="event-city"
                    type="text"
                    className={`form-input ${errors.city ? 'form-input-error' : ''}`}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={currentCategoryConfig.cityPlaceholder}
                    required
                  />
                  <MapPin size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-muted)' }} />
                </div>
                {errors.city && <div className="form-error-msg">{errors.city}</div>}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="event-date">
                  Event Start Date <span style={{ color: 'var(--color-primary)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="event-date"
                    type="date"
                    className={`form-input ${errors.date ? 'form-input-error' : ''}`}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                  <Calendar size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                </div>
                {errors.date && <div className="form-error-msg">{errors.date}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="event-duration">
                  Duration (Days)
                </label>
                <select
                  id="event-duration"
                  className="form-select"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                >
                  <option value={1}>1 Day (Single Celebration)</option>
                  <option value={2}>2 Days (e.g. Sangeet + Wedding)</option>
                  <option value={3}>3 Days (Mehendi, Sangeet, Wedding & Reception)</option>
                  <option value={4}>4+ Days (Extended Destination Wedding)</option>
                </select>
              </div>
            </div>
          </motion.div>
          )}

          {/* STEP 2: Scale, Budget & Tier */}
          {step === 2 && (
            <motion.div
              key="step-2"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="guest-count">
                  Expected Guests
                  <span className="form-label-hint">{guestCount} attendees</span>
                </label>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <input
                    id="guest-count"
                    type="number"
                    min={5}
                    max={5000}
                    step={10}
                    className={`form-input ${errors.guestCount ? 'form-input-error' : ''}`}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    required
                  />
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}>
                    <Users size={18} />
                  </div>
                </div>
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '8px', accentColor: 'var(--color-primary)' }}
                  aria-label="Guest count slider"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="total-budget">
                  Total Budget (INR ₹)
                  <span className="form-label-hint">{formatINR(totalBudget)}</span>
                </label>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <input
                    id="total-budget"
                    type="number"
                    min={10000}
                    max={100000000}
                    step={25000}
                    className={`form-input ${errors.totalBudget ? 'form-input-error' : ''}`}
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    required
                  />
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}>
                    <IndianRupee size={18} />
                  </div>
                </div>
                {/* Quick budget increment buttons */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {[100000, 300000, 500000, 1500000, 3500000].map((presetVal) => (
                    <button
                      key={presetVal}
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.75rem', padding: '2px 8px', border: '1px solid var(--border-subtle)' }}
                      onClick={() => setTotalBudget(presetVal)}
                    >
                      {formatINR(presetVal)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Real-time Feasibility Banner */}
            <div
              className={`card ${isUnderBudget ? 'badge-danger' : 'badge-success'}`}
              style={{
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-4)',
                border: `1px solid ${isUnderBudget ? 'var(--color-danger-border)' : 'var(--color-success-border)'}`,
                background: isUnderBudget ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                {isUnderBudget ? (
                  <AlertCircle size={20} style={{ color: 'var(--color-danger)', flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <CheckCircle2 size={20} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.925rem', color: isUnderBudget ? '#FCA5A5' : '#6EE7B7' }}>
                    {isUnderBudget ? 'Budget Feasibility Warning' : 'Healthy Feasibility Metric'}
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    Current unit cost: <strong>{formatINR(costPerGuest)}/guest</strong>. Benchmark for {tier} {eventType.replace('_', ' ')} is <strong>{formatINR(benchmarkCost)}/guest</strong>.
                    {isUnderBudget && ` Estimated shortfall: ${formatINR(benchmarkCost * guestCount - totalBudget)}. You can adjust scale or continue with DIY trade-offs.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Celebration Tier Selection */}
            <div className="form-group">
              <label className="form-label" htmlFor="tier-selection">
                Celebration Tier & Atmosphere
              </label>
              <div id="tier-selection" className="grid-2">
                {(['budget', 'standard', 'premium', 'luxury'] as EventTier[]).map((t) => {
                  const meta = TIER_DESCRIPTIONS[t];
                  const isSelected = tier === t;
                  return (
                    <div
                      key={t}
                      tabIndex={0}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setTier(t)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') setTier(t);
                      }}
                      className="card card-interactive"
                      style={{
                        padding: 'var(--space-3)',
                        borderColor: isSelected ? 'var(--color-gold)' : 'var(--border-subtle)',
                        background: isSelected ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-card)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: isSelected ? 'var(--color-gold-light)' : 'var(--text-primary)' }}>
                          {meta.title}
                        </span>
                        <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                          ~{formatINR(MINIMUM_PER_GUEST_BENCHMARKS[eventType]?.[t] || 500)}/head
                        </span>
                      </div>
                      <p style={{ fontSize: '0.775rem', marginTop: '4px' }}>{meta.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Nuances, Dietary, Accessibility & Review */}
        {step === 3 && (
          <motion.div
            key="step-3"
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Dietary */}
            <div className="form-group">
              <label className="form-label">Dietary & Catering Preferences</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  'Strict Vegetarian',
                  'Separate Jain Counter (No Onion/Garlic)',
                  'Live Chaat & Street Food Stalls',
                  'North Indian Royal Cuisine',
                  'South Indian Traditional Banana Leaf',
                  'Mughlai / Non-Veg Options',
                  'Dessert & Jalebi Rabdi Bar',
                ].map((diet) => {
                  const isChecked = dietaryRequirements.includes(diet);
                  return (
                    <button
                      key={diet}
                      type="button"
                      className={`btn btn-sm ${isChecked ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                      onClick={() => toggleArrayItem(diet, dietaryRequirements, setDietaryRequirements)}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {diet}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accessibility */}
            <div className="form-group">
              <label className="form-label">Accessibility & Family Care</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  'Wheelchair ramp for elders',
                  'Low seating / Gaddi for Puja',
                  'Quiet decompression zone for toddlers',
                  'Stroller parking area',
                  'Reserved front rows for senior citizens',
                ].map((acc) => {
                  const isChecked = accessibilityNeeds.includes(acc);
                  return (
                    <button
                      key={acc}
                      type="button"
                      className={`btn btn-sm ${isChecked ? 'btn-gold' : 'btn-secondary'}`}
                      style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                      onClick={() => toggleArrayItem(acc, accessibilityNeeds, setAccessibilityNeeds)}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {acc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priorities & Boundaries */}
            <div className="form-group">
              <label className="form-label">Core Celebration Priorities</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  'Memorable dining experience',
                  'Authentic traditional decor',
                  'Candid cinematic photography',
                  'High-energy music & Sangeet DJ',
                  'Eco-friendly / Minimal plastic',
                  'Strict budget discipline',
                ].map((prio) => {
                  const isChecked = priorities.includes(prio);
                  return (
                    <button
                      key={prio}
                      type="button"
                      className={`btn btn-sm ${isChecked ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                      onClick={() => toggleArrayItem(prio, priorities, setPriorities)}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {prio}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Style & Theme */}
            <div className="form-group">
              <label className="form-label" htmlFor="style-theme">
                Style, Vibe & Aesthetic Theme
              </label>
              <input
                id="style-theme"
                type="text"
                className="form-input"
                value={styleTheme}
                onChange={(e) => setStyleTheme(e.target.value)}
                placeholder={currentCategoryConfig.styleThemePlaceholder}
              />
            </div>

            {/* Additional Host Notes */}
            <div className="form-group">
              <label className="form-label" htmlFor="host-notes">
                Special Priorities or Constraints (Optional)
              </label>
              <textarea
                id="host-notes"
                className="form-textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={currentCategoryConfig.notesPlaceholder}
              />
            </div>

            {/* Pre-generation Summary Pill */}
            <div
              className="card"
              style={{
                background: 'var(--bg-input)',
                borderColor: 'var(--border-gold)',
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Info size={16} style={{ color: 'var(--color-gold)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-gold-light)' }}>
                  Ready to Generate Plan
                </span>
              </div>
              <p style={{ fontSize: '0.825rem' }}>
                You are planning a <strong>{durationDays}-day {eventType}</strong> in <strong>{city}</strong> for{' '}
                <strong>{guestCount} guests</strong> with a budget of <strong>{formatINR(totalBudget)}</strong>.
                Deterministic budget allocations and contingency reserves will be calculated instantly.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wizard Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'var(--space-6)',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          {step > 1 ? (
            <motion.button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep((step - 1) as any)}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChevronLeft size={16} /> Previous
            </motion.button>
          ) : onCancel ? (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          ) : null}
        </div>

        <div>
          {step < 3 ? (
            <motion.button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue <ChevronRight size={16} />
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              className="btn btn-gold btn-lg pulse-glow"
              disabled={isLoading}
              aria-busy={isLoading}
              style={{ maxWidth: '100%', whiteSpace: 'normal', padding: '0.8rem 1.4rem', textAlign: 'center' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isLoading ? (
                <>
                  <Sparkles className="animate-spin" size={18} />
                  <span>Crafting Celebration Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Actionable Plan</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
      </form>
    </div>
  );
};
