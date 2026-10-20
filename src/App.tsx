import { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
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
import { Sparkles, Calendar } from 'lucide-react';
import './styles/global.css';

const LOCAL_STORAGE_KEY = 'utsavpilot_current_plan_v1';

export function App() {
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

  // Handle plan generation from Wizard
  const handleGeneratePlan = async (input: EventInput) => {
    setIsLoading(true);
    try {
      const result = await requestPlanGeneration(input);
      setCurrentPlan(result.plan);
      setIsWizardOpen(false);
      showToast(result.message || 'Plan generated successfully!');
    } catch (err: any) {
      console.error('Error in handleGeneratePlan:', err);
      // Fallback
      const fallback = generateDeterministicPlan(input);
      setCurrentPlan(fallback);
      setIsWizardOpen(false);
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
    setIsWizardOpen(false);
    showToast(`Loaded sample: "${preset.title}"`);
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
        onNewPlan={() => setIsWizardOpen(true)}
        onLoadPreset={handleLoadPreset}
        onPrint={() => setIsPrintOpen(true)}
        modelUsed={currentPlan?.modelUsed}
      />

      {/* Toast Notification Banner */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 90,
            background: 'var(--bg-card-elevated)',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-lg)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            animation: 'modalEnter 0.2s ease',
          }}
        >
          <Sparkles size={16} style={{ color: 'var(--color-gold)' }} />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, padding: 'var(--space-6) 0' }}>
        {/* If Wizard is Open, render Wizard modal/view */}
        {isWizardOpen ? (
          <EventWizard
            initialValues={currentPlan?.input}
            onSubmit={handleGeneratePlan}
            onCancel={() => setIsWizardOpen(false)}
            isLoading={isLoading}
          />
        ) : currentPlan ? (
          <div>
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
                paddingBottom: '8px',
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
                  className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Modules */}
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
          </div>
        ) : (
          /* Empty / Welcome State */
          <div className="card card-elevated" style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-6)' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, #FF5A1F, #F59E0B)',
                margin: '0 auto var(--space-4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Sparkles size={32} />
            </div>
            <h2>Welcome to UtsavPilot</h2>
            <p style={{ maxWidth: '520px', margin: 'var(--space-2) auto var(--space-6)' }}>
              Create realistic Indian celebration plans with deterministic budget feasibility, transparent vendor checklists, and adaptive replanning.
            </p>
            <button
              type="button"
              className="btn btn-gold btn-lg"
              onClick={() => setIsWizardOpen(true)}
            >
              <Calendar size={18} />
              <span>Start Planning Your Celebration</span>
            </button>
          </div>
        )}
      </main>

      {/* Adaptive Replan Modal */}
      {isReplanOpen && currentPlan && (
        <ReplanModal
          currentPlan={currentPlan}
          onApplyReplan={handleApplyReplan}
          onClose={() => setIsReplanOpen(false)}
        />
      )}

      {/* Print Dossier Modal */}
      {isPrintOpen && currentPlan && (
        <PrintDossier
          plan={currentPlan}
          onClose={() => setIsPrintOpen(false)}
        />
      )}

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: 'var(--space-6) 0',
          background: 'var(--bg-glass)',
          marginTop: 'auto',
          fontSize: '0.825rem',
          color: 'var(--text-muted)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <strong>UtsavPilot</strong> — Built for PromptWars Virtual Challenge. Deterministic Math • WCAG 2.1 AA Accessible • Zero Hallucinated Prices.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>India-First Engine</span>
            <span>Gemini Flash Ready</span>
            <span>Offline Capable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
