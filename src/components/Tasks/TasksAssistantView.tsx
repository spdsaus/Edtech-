import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Sparkles,
  Sun,
  Moon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Trash2,
  Edit2,
  Calendar,
  Filter,
  Search,
  ArrowRight,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { TeacherTask, TaskStatus, TaskPriority, TaskCategory } from '../../types';
import { useToast } from '../../context/ToastContext';

interface TasksAssistantViewProps {
  tasks: TeacherTask[];
  onAddTask: (task: TeacherTask) => void;
  onUpdateTask: (task: TeacherTask) => void;
  onDeleteTask: (taskId: string) => void;
  onApproveSuggestedTask: (taskId: string) => void;
  onDismissSuggestedTask: (taskId: string) => void;
}

export const TasksAssistantView: React.FC<TasksAssistantViewProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onApproveSuggestedTask,
  onDismissSuggestedTask,
}) => {
  const { showToast } = useToast();

  const [activeStatusTab, setActiveStatusTab] = useState<string>('Active');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [activeAssistantWidget, setActiveAssistantWidget] = useState<'morning' | 'between' | 'wrapup'>('morning');

  // Form State for creating task
  const [formData, setFormData] = useState<Partial<TeacherTask>>({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Normal',
    category: 'Lesson Prep',
    dueDate: new Date().toISOString().split('T')[0],
    duePeriod: 'Period 6',
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showToast('error', 'Validation Error', 'Task title is required.');
      return;
    }

    const newTask: TeacherTask = {
      id: `task-${Date.now()}`,
      title: formData.title!,
      description: formData.description || '',
      status: formData.status || 'Pending',
      priority: formData.priority || 'Normal',
      category: formData.category || 'Lesson Prep',
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      duePeriod: formData.duePeriod,
      isAiSuggested: false,
    };

    onAddTask(newTask);
    setShowAddModal(false);
    setFormData({
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Normal',
      category: 'Lesson Prep',
      dueDate: new Date().toISOString().split('T')[0],
      duePeriod: 'Period 6',
    });
    showToast('success', 'Task Created', `"${newTask.title}" added to your workspace.`);
  };

  const handleToggleCompleted = (task: TeacherTask) => {
    const nextStatus: TaskStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    onUpdateTask({
      ...task,
      status: nextStatus,
      completedAt: nextStatus === 'Completed' ? new Date().toISOString() : undefined,
    });
    showToast('info', 'Status Updated', `Task marked as ${nextStatus}.`);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    let matchesStatus = true;
    if (activeStatusTab === 'Active') {
      matchesStatus = t.status === 'Pending' || t.status === 'In progress' || t.status === 'Suggested';
    } else if (activeStatusTab !== 'All') {
      matchesStatus = t.status === activeStatusTab;
    }

    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const suggestedTasks = tasks.filter((t) => t.status === 'Suggested');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#171936] tracking-tight">
            Tasks & Teacher Assistant
          </h2>
          <p className="text-xs text-gray-500">
            Smart agenda, period checklists & educator-approved suggestions
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5145C5] text-white text-xs font-bold hover:bg-[#4337b0] transition-colors shadow-sm self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* THREE ASSISTANT BRIEFING WIDGETS */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
        {/* Widget Selector Pills */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#171936]">
              Briefing Previews
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveAssistantWidget('morning')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeAssistantWidget === 'morning'
                  ? 'bg-amber-100 text-amber-900 font-bold'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>Morning Brief</span>
            </button>

            <button
              onClick={() => setActiveAssistantWidget('between')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeAssistantWidget === 'between'
                  ? 'bg-indigo-100 text-indigo-900 font-bold'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Between-Lesson Reminders</span>
            </button>

            <button
              onClick={() => setActiveAssistantWidget('wrapup')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeAssistantWidget === 'wrapup'
                  ? 'bg-purple-100 text-purple-900 font-bold'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-purple-600" />
              <span>End-of-Day Wrap-Up</span>
            </button>
          </div>
        </div>

        {/* Widget 1: Morning Brief */}
        {activeAssistantWidget === 'morning' && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span className="text-amber-900">Morning Briefing • Prototype</span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                Live timetable not connected
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              This preview does not read a live timetable yet. Add your own tasks below to organise the work you need to complete.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="bg-white/80 p-2 rounded-lg border border-amber-200 font-medium">
                • {tasks.filter((t) => ['Pending', 'In progress', 'Suggested'].includes(t.status)).length} Open Tasks
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-amber-200 font-medium">
                • {tasks.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed').length} Urgent Tasks
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-amber-200 font-medium">
                • Local task list only
              </div>
            </div>
          </div>
        )}

        {/* Widget 2: Between-Lesson Reminders */}
        {activeAssistantWidget === 'between' && (
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span className="text-indigo-900">Between-Lesson Prompts & Transit Alerts</span>
              <span className="text-[10px] bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded-full">
                Live timetable not connected
              </span>
            </div>
            <ul className="space-y-1.5 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Automated period reminders are not connected in this prototype.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Add a task manually to track lesson preparation, marking or follow-up.</span>
              </li>
            </ul>
          </div>
        )}

        {/* Widget 3: End-of-Day Wrap-Up */}
        {activeAssistantWidget === 'wrapup' && (
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-950 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span className="text-purple-900">End-of-Day Wrap-Up Protocol</span>
              <span className="text-[10px] bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded-full">
                Local Summary
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              You have <strong>{tasks.filter((t) => t.status === 'Completed').length} tasks completed</strong>. Parent messages are local drafts only; this prototype does not send or automatically schedule them.
            </p>
          </div>
        )}
      </div>

      {/* TEACHER APPROVAL QUEUE FOR SUGGESTED TASKS */}
      {suggestedTasks.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-amber-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-[#171936]">
                Assistant Suggestions Awaiting Teacher Approval ({suggestedTasks.length})
              </h3>
            </div>
            <span className="text-[11px] text-amber-800 bg-amber-100 font-semibold px-2 py-0.5 rounded-full">
              Teacher Authority Enforced
            </span>
          </div>

          <p className="text-xs text-gray-500">
            The assistant never autonomously commits tasks or sends messages. Review and approve or dismiss:
          </p>

          <div className="space-y-2.5">
            {suggestedTasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#171936]">{task.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                      {task.priority}
                    </span>
                    <span className="text-[10px] text-gray-500">{task.category}</span>
                  </div>
                  <p className="text-gray-600 text-[11px]">{task.description}</p>
                  {task.aiRationale && (
                    <div className="text-[10px] text-[#5145C5] font-medium">
                      <strong>Rationale:</strong> {task.aiRationale}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onApproveSuggestedTask(task.id);
                      showToast('success', 'Suggestion Approved', `"${task.title}" added to active tasks.`);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#5145C5] text-white text-xs font-bold hover:bg-[#4337b0] transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => {
                      onDismissSuggestedTask(task.id);
                      showToast('info', 'Suggestion Dismissed', 'Task dismissed.');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status tabs: Active, Pending, In progress, Completed, Dismissed, All */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['Active', 'Pending', 'In progress', 'Completed', 'Dismissed', 'All'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatusTab(status)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors shrink-0 ${
                activeStatusTab === status
                  ? 'bg-[#171936] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs bg-white font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Lesson Prep">Lesson Prep</option>
            <option value="Parent Communication">Parent Comms</option>
            <option value="Assessment Marking">Marking</option>
            <option value="School Admin">School Admin</option>
            <option value="Department">Department</option>
          </select>

          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5145C5]/30"
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center text-xs text-gray-400">
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isDismissed = task.status === 'Dismissed';
            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isCompleted
                    ? 'bg-gray-50/70 border-gray-200 opacity-70'
                    : isDismissed
                    ? 'bg-gray-50 border-gray-200 opacity-50'
                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-xs'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => handleToggleCompleted(task)}
                  className="mt-1 w-4 h-4 rounded text-[#5145C5] focus:ring-[#5145C5] cursor-pointer"
                />

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-bold text-sm ${
                          isCompleted ? 'line-through text-gray-500' : 'text-[#171936]'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          task.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-indigo-50 text-indigo-700">
                        {task.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      {task.duePeriod && <span>Due: {task.duePeriod}</span>}
                      <span>• {task.dueDate}</span>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-gray-600 mt-1 leading-relaxed text-[11px]">{task.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (confirm(`Delete task "${task.title}"?`)) {
                        onDeleteTask(task.id);
                        showToast('info', 'Task Deleted', 'Task removed.');
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-base font-bold text-[#171936]">Create New Educator Task</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Set up optical microscopes in Lab 2"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Priority</label>
                  <select
                    value={formData.priority || 'Normal'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    className="w-full px-2 py-2 rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={formData.category || 'Lesson Prep'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
                    className="w-full px-2 py-2 rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="Lesson Prep">Lesson Prep</option>
                    <option value="Parent Communication">Parent Comms</option>
                    <option value="Assessment Marking">Marking</option>
                    <option value="School Admin">School Admin</option>
                    <option value="Department">Department</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Target Period</label>
                  <input
                    type="text"
                    placeholder="e.g. Period 3 or Wrap-up"
                    value={formData.duePeriod || ''}
                    onChange={(e) => setFormData({ ...formData, duePeriod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5145C5] text-white font-bold hover:bg-[#4337b0]"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
