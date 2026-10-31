import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { ExecutiveSummary } from './components/dashboard/ExecutiveSummary';
import { BudgetDashboard } from './components/budget/BudgetDashboard';
import { TaskBoard } from './components/execution/TaskBoard';
import { VendorBoard } from './components/vendor/VendorBoard';
import { PersonalizedIdeas } from './components/dashboard/PersonalizedIdeas';
import { EventWizard } from './components/wizard/EventWizard';
import { ReplanModal } from './components/replanner/ReplanModal';
import { PrintDossier } from './components/export/PrintDossier';
import type { EventPlan, EventInput, ReplanDelta, VendorStatus, PlanTask } from './domain/types';
import { SAMPLE_DEMO_EVENTS } from './domain/eventDefaults';
import { generateDeterministicPlan } from './engine/deterministicFallback';
import { updateCategoryBudget } from './engine/budgetEngine';
import { requestPlanGeneration } from './services/aiClient';
import { Sparkles } from 'lucide-react';
import { pageVariants, tabContentVariants, toastVariants } from './motion/motionTokens';
import './styles/global.css';

const LOCAL_STORAGE_KEY = 'utsavpilot_current_plan_v1';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');

  const [currentPlan, setCurrentPlan] = useState<EventPlan | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.input && parsed.budgetReport) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read saved plan from localStorage', e);
    }
    const defaultSample = generateDeterministicPlan(SAMPLE_DEMO_EVENTS[0]);
    defaultSample.isDemoSample = true;
    return defaultSample;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isReplanOpen, setIsReplanOpen] = useState<boolean>(false);
  const [isPrintOpen, setIsPrintOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'budget' | 'tasks' | 'vendors' | 'ideas'>('all');
  // Keep URL hash in sync with current view and wizard state for back/forward navigation
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash === 'wizard') {
        setIsWizardOpen(true);
      } else if (hash === 'workspace') {
        setIsWizardOpen(false);
        setCurrentView('workspace');
      } else if (hash === 'landing' || hash === '') {
        setIsWizardOpen(false);
        setCurrentView('landing');
      }
    };

    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);

    // Initial sync
    if (window.location.hash) {
      syncFromHash();
    }

    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, []);

  // Save current plan to localStorage whenever it changes
  useEffect(() => {
    if (currentPlan) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentPlan));
      } catch (e) {
        console.warn('Could not save plan to localStorage', e);
      }
    }
  }, [currentPlan]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Safe navigation that updates browser history
  const navigateTo = (view: 'landing' | 'workspace', openWizard = false) => {
    setIsWizardOpen(openWizard);
    setCurrentView(view);
    const targetHash = openWizard ? 'wizard' : view;
    if (window.location.hash !== `#${targetHash}`) {
      window.location.hash = targetHash;
    }
  };

  // Handle plan generation from Wizard
  const handleGeneratePlan = async (input: EventInput) => {
    setIsLoading(true);
    try {
      const result = await requestPlanGeneration(input);
      setCurrentPlan(result.plan);
      navigateTo('workspace', false);
      showToast(result.message || 'Plan generated successfully!');
    } catch (err: any) {
      console.error('Error in handleGeneratePlan:', err);
      // Fallback
      const fallback = generateDeterministicPlan(input);
      setCurrentPlan(fallback);
      navigateTo('workspace', false);
      showToast('Operating in reliable deterministic mode.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle preset load
  const handleLoadPreset = (preset: EventInput) => {
    const plan = generateDeterministicPlan(preset);
    plan.isDemoSample = true;
    setCurrentPlan(plan);
    navigateTo('workspace', false);
    showToast(`Loaded blueprint: "${preset.title}"`);
  };

  // Handle category budget update
  const handleUpdateCategoryBudget = (categoryId: string, newAmount: number) => {
    if (!currentPlan) return;
    const updatedReport = updateCategoryBudget(currentPlan.budgetReport, categoryId, newAmount);
    setCurrentPlan({
      ...currentPlan,
      budgetReport: updatedReport,
    });
    showToast('Category allocation updated & contingency recalculated.');
  };

  // Handle task toggling
  const handleToggleTask = (taskId: string) => {
    if (!currentPlan) return;
    const updatedTasks = currentPlan.tasks.map((t) =>
      t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    );
    setCurrentPlan({
      ...currentPlan,
      tasks: updatedTasks,
    });
  };

  // Handle adding custom task
  const handleAddTask = (newTask: Omit<PlanTask, 'id'>) => {
    if (!currentPlan) return;
    const taskWithId: PlanTask = {
      ...newTask,
      id: `task_custom_${Date.now()}`,
    };
    setCurrentPlan({
      ...currentPlan,
      tasks: [taskWithId, ...currentPlan.tasks],
    });
    showToast('Custom task added to execution timeline.');
  };

  // Handle vendor status update
  const handleUpdateVendorStatus = (
    vendorId: string,
    status: VendorStatus,
    bookedName?: string,
    agreedPrice?: number
  ) => {
    if (!currentPlan) return;
    const updatedVendors = currentPlan.vendorChecklist.map((v) =>
      v.id === vendorId
        ? {
            ...v,
            status,
            bookedVendorName: bookedName || v.bookedVendorName,
            agreedPrice: agreedPrice !== undefined ? agreedPrice : v.agreedPrice,
          }
        : v
    );
    setCurrentPlan({
      ...currentPlan,
      vendorChecklist: updatedVendors,
    });
    showToast(`Vendor status updated to "${status.replace('_', ' ')}".`);
  };

  // Handle adaptive replanning
  const handleApplyReplan = (updatedPlan: EventPlan, delta: ReplanDelta) => {
    setCurrentPlan(updatedPlan);
    setIsReplanOpen(false);
    showToast(delta.explanation);
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => navigateTo(view, false)}
        onNewPlan={() => navigateTo(currentView, true)}
        onLoadPreset={handleLoadPreset}
        onPrint={() => setIsPrintOpen(true)}
        modelUsed={currentPlan?.modelUsed}
      />

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            role="status"
            aria-live="polite"
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: 'fixed',
              bottom: '16px',
              right: '16px',
              maxWidth: 'calc(100vw - 32px)',
              zIndex: 90,
              background: 'var(--bg-card)',
              border: '1.5px solid var(--color-vermilion)',
              boxShadow: 'var(--shadow-xl)',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              wordBreak: 'break-word',
            }}
          >
            <Sparkles size={16} style={{ color: 'var(--color-vermilion)' }} />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area with View Transitions */}
      <main style={{ flex: 1, position: 'relative' }}>
        <AnimatePresence mode="wait">
          {/* If Wizard is open, render Wizard view */}
          {isWizardOpen ? (
            <motion.div
              key="view-wizard"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="container"
              style={{ padding: 'clamp(1rem, 2.5vw, 2rem) 0' }}
            >
              <EventWizard
                initialValues={currentPlan?.isDemoSample ? undefined : currentPlan?.input}
                onSubmit={handleGeneratePlan}
                onCancel={() => navigateTo(currentView, false)}
                isLoading={isLoading}
              />
            </motion.div>
          ) : currentView === 'landing' ? (
            /* Editorial Landing Experience */
            <motion.div
              key="view-landing"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <LandingPage
                onStartPlanning={() => navigateTo(currentView, true)}
                onLoadPreset={handleLoadPreset}
              />
            </motion.div>
          ) : currentPlan ? (
            /* Product Workspace */
            <motion.div
              key="view-workspace"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="container"
              style={{ padding: 'clamp(1rem, 2.5vw, 2rem) 0' }}
            >
              {/* Executive Summary Hero Banner */}
              <ExecutiveSummary
                plan={currentPlan}
                onOpenReplan={() => setIsReplanOpen(true)}
              />

              {/* Navigation Tabs for Easy Section Jumps */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: 'var(--space-6)',
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  paddingBottom: '8px',
                  position: 'relative',
                }}
                role="tablist"
                aria-label="Event dashboard modules"
              >
                {[
                  { id: 'all', label: '✦ Complete Overview' },
                  { id: 'budget', label: '₹ Budget & Feasibility' },
                  { id: 'tasks', label: '✓ Milestone Tasks' },
                  { id: 'vendors', label: '🤝 Vendor Transparency' },
                  { id: 'ideas', label: '💡 Cultural & Decor Ideas' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`btn btn-sm ${activeTab === tab.id ? 'btn-aubergine' : 'btn-ghost'}`}
                    style={{ position: 'relative' }}
                    onClick={() => setActiveTab(tab.id as any)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        style={{
                          position: 'absolute',
                          bottom: '-9px',
                          left: '12%',
                          right: '12%',
                          height: '2.5px',
                          background: 'var(--color-vermilion)',
                          borderRadius: 'var(--radius-full)',
                        }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      />
                    )}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Modules with AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {(activeTab === 'all' || activeTab === 'budget') && (
                    <BudgetDashboard
                      report={currentPlan.budgetReport}
                      onUpdateCategoryBudget={handleUpdateCategoryBudget}
                    />
                  )}

                  {(activeTab === 'all' || activeTab === 'tasks') && (
                    <TaskBoard
                      tasks={currentPlan.tasks}
                      onToggleTask={handleToggleTask}
                      onAddTask={handleAddTask}
                    />
                  )}

                  {(activeTab === 'all' || activeTab === 'vendors') && (
                    <VendorBoard
                      vendors={currentPlan.vendorChecklist}
                      onUpdateVendorStatus={handleUpdateVendorStatus}
                    />
                  )}

                  {(activeTab === 'all' || activeTab === 'ideas') && (
                    <PersonalizedIdeas
                      suggestions={currentPlan.suggestions}
                      assumptions={currentPlan.assumptions}
                      unresolvedDecisions={currentPlan.unresolvedDecisions}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Adaptive Replan Modal with AnimatePresence */}
      <AnimatePresence>
        {isReplanOpen && currentPlan && (
          <ReplanModal
            currentPlan={currentPlan}
            onApplyReplan={handleApplyReplan}
            onClose={() => setIsReplanOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Print Dossier Modal with AnimatePresence */}
      <AnimatePresence>
        {isPrintOpen && currentPlan && (
          <PrintDossier
            plan={currentPlan}
            onClose={() => setIsPrintOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Professional Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: 'var(--space-8) 0',
          background: 'var(--bg-canvas-subtle)',
          marginTop: 'auto',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>UtsavPilot</strong> — Celebration Editorial meets Intelligent Planning. Built for PromptWars Virtual Challenge.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>India-First Heuristics</span>
            <span>Deterministic Precision</span>
            <span>Gemini Flash Ready</span>
            <span>WCAG 2.1 AA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
