import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  BookOpenCheck,
  Radio,
  CheckSquare,
  AlertCircle,
  Users,
  Sparkles,
  ChevronRight,
  Sun,
  ShieldCheck,
  Send,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Printer,
} from 'lucide-react';
import {
  TimetablePeriod,
  TeacherTask,
  MessageLog,
  LessonPlan,
  TeacherSettings,
} from '../../types';
import { ActiveTab } from '../Navigation/Sidebar';

interface DashboardViewProps {
  timetable: TimetablePeriod[];
  tasks: TeacherTask[];
  messageLogs: MessageLog[];
  lessonPlans: LessonPlan[];
  settings: TeacherSettings;
  onNavigateTab: (tab: ActiveTab) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onSelectLessonForView: (plan: LessonPlan) => void;
  onStartNewLesson: () => void;
  onStartNewMessage: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  timetable,
  tasks,
  messageLogs,
  lessonPlans,
  settings,
  onNavigateTab,
  onToggleTaskStatus,
  onSelectLessonForView,
  onStartNewLesson,
  onStartNewMessage,
}) => {
  const [showBriefModal, setShowBriefModal] = useState(false);

  const pendingTasks = tasks.filter((t) => t.status === 'Pending' || t.status === 'In progress' || t.status === 'Suggested');
  const todayClasses = timetable.filter((p) => p.gradeClass.startsWith('Grade'));
  const currentPeriod = timetable.find((p) => p.status === 'Current');

  const currentDateFormatted = new Date().toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 pb-12">
      {/* South African Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-[#171936] via-[#26285A] to-[#5145C5] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#7162E8]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -top-10 w-48 h-48 bg-[#5145C5]/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#F0EEFF] border border-white/15">
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>Sawubona, {settings.teacherName}</span>
              <span className="opacity-40">•</span>
              <span>{settings.schoolName}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Your teaching workspace
            </h2>

            <p className="text-sm text-[#C5C8E5] leading-relaxed">
              Your dashboard will reflect your classes, lesson plans, tasks and communications as you add your own information.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => setShowBriefModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all shadow-sm active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Morning Briefing</span>
            </button>

            <button
              onClick={onStartNewLesson}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#171936] hover:bg-[#F0EEFF] text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <BookOpenCheck className="w-4 h-4 text-[#5145C5]" />
              <span>Draft CAPS Lesson</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-gray-500">Today's Classes</div>
            <div className="text-2xl font-bold text-[#171936] mt-1">{todayClasses.length} Periods</div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5">From your timetable</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F0EEFF] text-[#5145C5] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-gray-500">CAPS Lesson Plans</div>
            <div className="text-2xl font-bold text-[#171936] mt-1">{lessonPlans.length} Ready</div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5">Saved in this browser</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpenCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-gray-500">Open Tasks</div>
            <div className="text-2xl font-bold text-[#171936] mt-1">{pendingTasks.length} Pending</div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5">From your task list</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-gray-500">Parent Comms</div>
            <div className="text-2xl font-bold text-[#171936] mt-1">{messageLogs.reduce((total, log) => total + log.recipientCount, 0)} Recipients</div>
            <div className="text-[11px] text-purple-600 font-medium mt-0.5">5 language options</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Timetable Timeline + Tasks & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Today's Timetable */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F0EEFF] text-[#5145C5] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#171936]">Today's Teaching Schedule</h3>
                  <p className="text-xs text-gray-500">{currentDateFormatted} • 7-Period Timetable</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('planner')}
                className="text-xs font-semibold text-[#5145C5] hover:text-[#7162E8] flex items-center gap-1"
              >
                <span>Full Planner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Period items */}
            <div className="space-y-3">
              {timetable.map((period) => {
                const isCurrent = period.status === 'Current';
                const isCompleted = period.status === 'Completed';
                const hasLesson = Boolean(period.lessonPlanId);
                const matchingLesson = lessonPlans.find((l) => l.id === period.lessonPlanId);

                return (
                  <div
                    key={period.periodNumber}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-[#F0EEFF]/50 border-[#5145C5] ring-2 ring-[#5145C5]/20 shadow-sm'
                        : isCompleted
                        ? 'bg-gray-50/70 border-gray-200 opacity-80'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? 'bg-[#5145C5] text-white shadow-xs'
                              : isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          P{period.periodNumber}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500">
                              {period.timeRange}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isCurrent
                                  ? 'bg-indigo-600 text-white animate-pulse'
                                  : isCompleted
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {period.status}
                            </span>
                            {period.room && (
                              <span className="text-[11px] text-gray-500 font-medium">
                                • {period.room}
                              </span>
                            )}
                          </div>

                          <div className="text-sm font-bold text-[#171936] mt-0.5">
                            {period.gradeClass}: {period.subject}
                          </div>

                          <div className="text-xs text-gray-600 mt-0.5 flex items-center gap-1.5">
                            <span>{period.topic}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {matchingLesson ? (
                          <button
                            onClick={() => onSelectLessonForView(matchingLesson)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#5145C5] bg-[#F0EEFF] hover:bg-[#E2E0FF] transition-colors border border-[#5145C5]/20"
                            title="Open verified lesson plan"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Plan</span>
                          </button>
                        ) : (
                          period.gradeClass.startsWith('Grade') && (
                            <button
                              onClick={onStartNewLesson}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              <BookOpenCheck className="w-3.5 h-3.5 text-gray-500" />
                              <span>Attach Plan</span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Hub */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Direct Educator Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={onStartNewLesson}
                className="p-3.5 rounded-xl border border-gray-200 hover:border-[#5145C5] hover:bg-[#F0EEFF]/30 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F0EEFF] text-[#5145C5] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <BookOpenCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#171936]">New CAPS Lesson</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Generate or write timing-checked plan</div>
              </button>

              <button
                onClick={onStartNewMessage}
                className="p-3.5 rounded-xl border border-gray-200 hover:border-violet-500 hover:bg-violet-50/30 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Radio className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#171936]">Broadcast Parent Note</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Multilingual safe workflow & templates</div>
              </button>

              <button
                onClick={() => onNavigateTab('classes')}
                className="p-3.5 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#171936]">Learner Directory</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Class lists, contacts & CSV import</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Tasks & Parent Comms */}
        <div className="space-y-4">
          {/* Priority Tasks widget */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#5145C5]" />
                <h3 className="text-sm font-bold text-[#171936]">Priority Tasks</h3>
              </div>
              <button
                onClick={() => onNavigateTab('tasks')}
                className="text-xs font-semibold text-[#5145C5] hover:underline"
              >
                View all ({tasks.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 4).map((task) => {
                const isCompleted = task.status === 'Completed';
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isCompleted ? 'bg-gray-50/60 border-gray-200 opacity-60' : 'bg-[#F7F8FC] border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => onToggleTaskStatus(task.id)}
                      className="mt-1 w-4 h-4 rounded text-[#5145C5] focus:ring-[#5145C5] cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-xs font-semibold leading-snug ${
                            isCompleted ? 'line-through text-gray-500' : 'text-[#171936]'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
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
                        {task.duePeriod && (
                          <span className="text-[10px] text-gray-500">{task.duePeriod}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Parent Communications Widget */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-bold text-[#171936]">Recent Parent Comms</h3>
              </div>
              <button
                onClick={() => onNavigateTab('command')}
                className="text-xs font-semibold text-violet-600 hover:underline"
              >
                Command Centre
              </button>
            </div>

            <div className="space-y-3">
              {messageLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#171936] truncate max-w-[170px]">
                      {log.recipientTarget}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Simulated Sent
                    </span>
                  </div>

                  <p className="text-gray-600 text-[11px] line-clamp-2">{log.subject}</p>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-200/60">
                    <span>
                      {log.channel} • {log.language.toUpperCase()}
                    </span>
                    <span>{log.sentAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Morning Briefing Modal */}
      {showBriefModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-[#5145C5]">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-[#171936]">Morning Briefing • Term 2</h3>
              </div>
              <button
                onClick={() => setShowBriefModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="p-3 bg-[#F0EEFF] rounded-xl text-[#171936] border border-[#5145C5]/20">
                <div className="font-bold text-xs uppercase tracking-wider text-[#5145C5]">
                  Your Daily Overview
                </div>
                <p className="text-xs mt-1 leading-relaxed">
                  Your schedule and priority tasks will appear here once you add them.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-500 uppercase">3 Urgent Action Items</div>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">1.</span>
                    <span>Check 7 optical microscopes and onion root tip slides in Biology Lab 2 before 09:45.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">2.</span>
                    <span>Grade 9A exit tickets need scoring during period 6 free admin period.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">3.</span>
                    <span>POPIA Safeguard: Kagiso Modise (10B) parent is opted out of broadcasts; communicate via term report only.</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 border border-gray-200">
                <strong>Quiet Hours Notice:</strong> Quiet hours use the schedule configured in Settings. Messaging is simulated in this prototype.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBriefModal(false)}
                className="px-4 py-2 rounded-xl bg-[#5145C5] text-white text-xs font-semibold hover:bg-[#4337b0] transition-colors"
              >
                Acknowledge & Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
