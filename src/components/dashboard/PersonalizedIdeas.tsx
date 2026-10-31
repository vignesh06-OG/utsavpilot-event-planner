import { 
  UtensilsCrossed, 
  Palette, 
  Music, 
  HeartHandshake, 
  Accessibility, 
  HelpCircle
} from 'lucide-react';
import type { PersonalizedSuggestions } from '../../domain/types';

interface PersonalizedIdeasProps {
  suggestions: PersonalizedSuggestions;
  assumptions: string[];
  unresolvedDecisions: string[];
}

export const PersonalizedIdeas = ({
  suggestions,
  assumptions,
  unresolvedDecisions,
}: PersonalizedIdeasProps) => {
  return (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      {/* 2-Column Grid of Inspiration Cards */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-4)' }}>
        {/* Decor & Theme */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <Palette size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Decor & Aesthetic Ambience</h3>
          </div>
          <ul style={{ paddingLeft: '16px', listStyleType: 'disc' }}>
            {suggestions.themeAndDecor.map((item) => (
              <li key={item} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Food & Dining */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <UtensilsCrossed size={20} style={{ color: 'var(--color-gold)' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Food, Chaat & Dining Ideas</h3>
          </div>
          <ul style={{ paddingLeft: '16px', listStyleType: 'disc' }}>
            {suggestions.foodAndBeverage.map((item) => (
              <li key={item} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--space-4)' }}>
        {/* Entertainment & Rituals */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <Music size={20} style={{ color: '#818CF8' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Entertainment & Rituals</h3>
          </div>
          <ul style={{ paddingLeft: '16px', listStyleType: 'disc' }}>
            {suggestions.entertainmentAndRituals.map((item) => (
              <li key={item} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Accessibility & Family Inclusivity */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <Accessibility size={20} style={{ color: 'var(--color-success)' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Accessibility & Senior Comfort</h3>
          </div>
          <ul style={{ paddingLeft: '16px', listStyleType: 'disc' }}>
            {suggestions.accessibilityPlan.map((item) => (
              <li key={item} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Assumptions & Unresolved Decisions Strip */}
      <div className="grid-2">
        <div className="card" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
            <HeartHandshake size={18} style={{ color: 'var(--color-gold)' }} />
            <h4 style={{ fontSize: '0.95rem', color: 'var(--color-gold-light)' }}>
              Core Planning Assumptions
            </h4>
          </div>
          <ul style={{ paddingLeft: '16px', listStyleType: 'circle' }}>
            {assumptions.map((asm) => (
              <li key={asm} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {asm}
              </li>
            ))}
          </ul>
        </div>

        <div className="card" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
            <HelpCircle size={18} style={{ color: 'var(--color-primary)' }} />
            <h4 style={{ fontSize: '0.95rem', color: '#FFA07A' }}>
              Unresolved Decisions to Lock Next
            </h4>
          </div>
          <ul style={{ paddingLeft: '16px', listStyleType: 'circle' }}>
            {unresolvedDecisions.map((dec) => (
              <li key={dec} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {dec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
