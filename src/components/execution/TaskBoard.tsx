import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckSquare, 
  Square, 
  User, 
  Plus, 
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { PlanTask, TaskMilestonePhase, TaskPriority } from '../../domain/types';
import { accordionVariants, smoothTransition } from '../../motion/motionTokens';

interface TaskBoardProps {
  tasks: PlanTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<PlanTask, 'id'>) => void;
}

const PHASE_LABELS: Record<TaskMilestonePhase, string> = {
  months_before: '2-3 Months Before',
  weeks_before: '2-4 Weeks Before',
  days_before: 'Days Before',
  day_of: 'Day-of Execution',
  post_event: 'Post-Event Wrapup',
};

export const TaskBoard = ({
  tasks,
  onToggleTask,
  onAddTask,
}: TaskBoardProps) => {
  const [selectedPhase, setSelectedPhase] = useState<TaskMilestonePhase | 'all'>('all');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Logistics');
  const [newPhase, setNewPhase] = useState<TaskMilestonePhase>('weeks_before');
  const [newPriority, setNewPriority] = useState<TaskPriority>('high');
  const [newOwner, setNewOwner] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleToggle = (task: PlanTask) => {
    onToggleTask(task.id);
    if (!task.isCompleted) {
      // Fire confetti celebration!
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#E85D3F', '#E7A83E', '#176B58', '#FAF5EE'],
      });
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      phase: newPhase,
      daysBeforeEvent: newPhase === 'months_before' ? 60 : newPhase === 'weeks_before' ? 14 : newPhase === 'days_before' ? 3 : 0,
      isCompleted: false,
      priority: newPriority,
      assignedOwner: newOwner.trim() || undefined,
      notes: newNotes.trim() || undefined,
    });

    setNewTitle('');
    setNewOwner('');
    setNewNotes('');
    setIsAddingTask(false);
  };

  const filteredTasks = selectedPhase === 'all' 
    ? tasks 
    : tasks.filter((t) => t.phase === selectedPhase);

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
            <CheckCircle2 size={22} style={{ color: 'var(--color-success)' }} />
            <span>Milestone Timeline & Action Board</span>
          </h2>
          <p style={{ fontSize: '0.875rem' }}>
            Actionable execution steps with deadlines, family ownership, and dependency tracking.
          </p>
        </div>

        <motion.button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setIsAddingTask(!isAddingTask)}
          aria-label="Add custom milestone task"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={16} />
          <span>Add Custom Task</span>
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            Execution Completion: <strong>{completedCount} of {tasks.length} tasks finished</strong>
          </span>
          <span style={{ fontWeight: 700, color: progressPercent === 100 ? 'var(--color-success)' : 'var(--color-gold-light)' }}>
            {progressPercent}%
          </span>
        </div>
        <div
          style={{
            height: '8px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-input)',
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: progressPercent === 100 
                ? 'var(--color-success)' 
                : 'linear-gradient(90deg, var(--color-primary), var(--color-gold))',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={smoothTransition}
          />
        </div>
      </div>

      {/* Add Task Form Collapsible */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.form
            onSubmit={handleCreateTask}
            className="card"
            style={{
              background: 'var(--bg-input)',
              borderColor: 'var(--border-gold)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-5)',
              overflow: 'hidden',
            }}
            variants={accordionVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            <div style={{ fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--color-gold-light)' }}>
              Add New Celebration Task
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="new-task-title">Task Title</label>
                <input
                  id="new-task-title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Finalize sweet boxes, arrange transport, or confirm sound check"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="new-task-phase">Milestone Phase</label>
                  <select
                    id="new-task-phase"
                    className="form-select"
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value as TaskMilestonePhase)}
                  >
                    {Object.entries(PHASE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="new-task-priority">Priority</label>
                  <select
                    id="new-task-priority"
                    className="form-select"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="new-task-owner">Assigned Family Member / Host</label>
                <input
                  id="new-task-owner"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rohan (Brother), Priya (Sister), Pandit Ji"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="new-task-category">Category</label>
                <input
                  id="new-task-category"
                  type="text"
                  className="form-input"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'var(--space-2)' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setIsAddingTask(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Task
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Phase Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 'var(--space-2)',
          marginBottom: 'var(--space-4)',
        }}
        role="tablist"
        aria-label="Filter tasks by milestone phase"
      >
        <motion.button
          type="button"
          className={`btn btn-sm ${selectedPhase === 'all' ? 'btn-gold' : 'btn-ghost'}`}
          onClick={() => setSelectedPhase('all')}
          role="tab"
          aria-selected={selectedPhase === 'all'}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          All Tasks ({tasks.length})
        </motion.button>
        {(Object.keys(PHASE_LABELS) as TaskMilestonePhase[]).map((phaseKey) => {
          const count = tasks.filter((t) => t.phase === phaseKey).length;
          const isSelected = selectedPhase === phaseKey;
          return (
            <motion.button
              key={phaseKey}
              type="button"
              className={`btn btn-sm ${isSelected ? 'btn-gold' : 'btn-ghost'}`}
              onClick={() => setSelectedPhase(phaseKey)}
              role="tab"
              aria-selected={isSelected}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {PHASE_LABELS[phaseKey]} ({count})
            </motion.button>
          );
        })}
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
            No tasks found in this phase.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              onClick={() => handleToggle(task)}
              tabIndex={0}
              role="checkbox"
              aria-checked={task.isCompleted}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleToggle(task);
                }
              }}
              className="card card-interactive"
              style={{
                padding: 'var(--space-3) var(--space-4)',
                background: task.isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)',
                borderColor: task.isCompleted ? 'var(--color-success-border)' : 'var(--border-subtle)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 'var(--space-3)',
                opacity: task.isCompleted ? 0.75 : 1,
                flexWrap: 'wrap',
              }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.99 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: '1 1 200px', minWidth: 0 }}>
                <div style={{ color: task.isCompleted ? 'var(--color-success)' : 'var(--text-muted)', marginTop: '2px' }}>
                  {task.isCompleted ? <CheckSquare size={18} /> : <Square size={18} />}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '0.925rem',
                      textDecoration: task.isCompleted ? 'line-through' : 'none',
                      color: task.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {task.title}
                  </div>

                  {task.notes && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {task.notes}
                    </p>
                  )}

                  {/* Task Metadata row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span className="badge badge-info" style={{ fontSize: '0.675rem' }}>
                      {task.category}
                    </span>

                    {task.assignedOwner && (
                      <span className="badge badge-gold" style={{ fontSize: '0.675rem' }}>
                        <User size={10} />
                        {task.assignedOwner}
                      </span>
                    )}

                    {task.dependencies && task.dependencies.length > 0 && (
                      <span className="badge badge-warning" style={{ fontSize: '0.675rem' }}>
                        Depends on previous milestone
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Priority & Timeline */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span
                  className={`badge ${
                    task.priority === 'critical'
                      ? 'badge-danger'
                      : task.priority === 'high'
                      ? 'badge-warning'
                      : 'badge-info'
                  }`}
                  style={{ fontSize: '0.675rem' }}
                >
                  {task.priority.toUpperCase()}
                </span>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {task.daysBeforeEvent > 0 
                    ? `D - ${task.daysBeforeEvent}` 
                    : task.daysBeforeEvent === 0 
                    ? 'Day of Event' 
                    : `D + ${Math.abs(task.daysBeforeEvent)}`}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
