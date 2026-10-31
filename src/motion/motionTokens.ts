import type { Variants, Transition } from 'motion/react';

/**
 * Coherent Motion Tokens for UtsavPilot Celebration Editorial
 * Aligned with 120-200ms interaction feedback, 200-350ms standard UI, and 300-450ms page transitions.
 */
export const MOTION_DURATIONS = {
  fast: 0.18,
  normal: 0.3,
  page: 0.38,
  slow: 0.55,
} as const;

export const MOTION_EASINGS = {
  easeOutCubic: [0.22, 1, 0.36, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  celebrationSpring: { type: 'spring', damping: 22, stiffness: 280 } as Transition,
  gentleSpring: { type: 'spring', damping: 28, stiffness: 220 } as Transition,
} as const;

// Transition presets
export const smoothTransition: Transition = {
  duration: MOTION_DURATIONS.normal,
  ease: MOTION_EASINGS.easeOutCubic,
};

export const pageTransition: Transition = {
  duration: MOTION_DURATIONS.page,
  ease: MOTION_EASINGS.easeOutCubic,
};

/**
 * Page and View Transitions (for App.tsx view switching & modal overlays)
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: pageTransition,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

/**
 * Tab and Content Switch Variants
 */
export const tabContentVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: MOTION_EASINGS.easeOutCubic,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

/**
 * Modal & Overlay Backdrop and Sheet Variants
 */
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
};

export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 14 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: MOTION_EASINGS.easeOutCubic,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 10,
    transition: {
      duration: 0.18,
      ease: 'easeIn',
    },
  },
};

/**
 * Toast Notification Variants
 */
export const toastVariants: Variants = {
  initial: { opacity: 0, y: 24, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.26,
      ease: MOTION_EASINGS.easeOutCubic,
    },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.96,
    transition: {
      duration: 0.18,
      ease: 'easeIn',
    },
  },
};

/**
 * Viewport Scroll Reveal Variants (whileInView)
 */
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: MOTION_EASINGS.easeOutCubic,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: MOTION_EASINGS.easeOutCubic,
    },
  },
};

/**
 * Accordion / Collapsible Section Variants
 */
export const accordionVariants: Variants = {
  collapsed: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  expanded: {
    opacity: 1,
    height: 'auto',
    overflow: 'hidden',
    transition: {
      duration: 0.3,
      ease: MOTION_EASINGS.easeOutCubic,
    },
  },
};

/**
 * Micro-interactions: Card Hover / Tap
 */
export const cardInteractiveVariants: Variants = {
  hover: {
    y: -4,
    boxShadow: '0 12px 28px -6px rgba(40, 21, 47, 0.12), 0 4px 10px -2px rgba(40, 21, 47, 0.06)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    y: -1,
    scale: 0.99,
    transition: {
      duration: 0.1,
    },
  },
};
