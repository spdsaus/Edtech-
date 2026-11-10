import React from 'react';
import {
  Wifi,
  WifiOff,
  Sparkles,
  Calendar,
  Clock,
  RotateCcw,
  Plus,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';
import { TeacherSettings } from '../../types';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  activeTab: ActiveTab;
  settings: TeacherSettings;
  onToggleOnline: () => void;
  onOpenQuickAction: (action: 'lesson' | 'message' | 'task') => void;
  onResetDemo: () => void;
  onOpenOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  settings,
  onToggleOnline,
  onOpenQuickAction,
  onResetDemo,
  onOpenOnboarding,
}) => {
  const getTabDetails = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Educator Dashboard', subtitle: 'Overview, timetable, and priority alerts' };
      case 'planner':
        return { title: 'CAPS Lesson Planner', subtitle: 'Curriculum-aligned lesson drafts & timing verification' };
      case 'command':
        return { title: 'Teacher Command Centre', subtitle: 'Safe multilingual parent broadcasts across 5 official languages' };
      case 'classes':
        return { title: 'My Classes & Learners', subtitle: 'Class cohorts, learner directory & CSV batch import' };
      case 'tasks':
        return { title: 'Tasks & Assistant', subtitle: 'Morning briefs, period alerts & teacher-approved workflows' };
      case 'settings':
        return { title: 'Platform Settings', subtitle: 'Educator profile, CAPS curriculum & quiet hours' };
    }
  };

  const details = getTabDetails();

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 px-4 md:px-8 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Title & Context */}
        <div className="flex items-center gap-3">
          {/* Mobile Logo Brand */}
          <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-tr from-[#5145C5] to-[#7162E8] flex items-center justify-center shadow text-white shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-[#171936] tracking-tight">
                {details.title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#5145C5] bg-[#F0EEFF] px-2 py-0.5 rounded-md border border-[#5145C5]/20">
                <Calendar className="w-3 h-3" />
                Term 2 • Week 4
              </span>
            </div>
            <p className="text-xs text-[#6B7280] font-normal truncate max-w-md">
              {details.subtitle}
            </p>
          </div>
        </div>

        {/* Right Actions: Sync status, Quick actions, Help */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Local storage status pill */}
          <button
            onClick={onToggleOnline}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              settings.isOnlineMode
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 animate-pulse'
            }`}
            title="Toggle prototype local/offline indicator"
          >
            {settings.isOnlineMode ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span className="text-[11px]">
              {settings.isOnlineMode ? 'Online' : 'Offline Mode'}
            </span>
            {settings.pendingSyncCount > 0 && (
              <span className="ml-1 bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {settings.pendingSyncCount}
              </span>
            )}
          </button>

          {/* Quick Action Menu */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#F7F8FC] p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => onOpenQuickAction('lesson')}
              className="flex items-center gap-1.5 text-xs font-medium text-[#171936] hover:bg-white hover:shadow-xs px-2.5 py-1 rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#5145C5]" />
              <span>Plan Lesson</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('message')}
              className="flex items-center gap-1.5 text-xs font-medium text-[#171936] hover:bg-white hover:shadow-xs px-2.5 py-1 rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-violet-600" />
              <span>Parent Note</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('task')}
              className="flex items-center gap-1.5 text-xs font-medium text-[#171936] hover:bg-white hover:shadow-xs px-2.5 py-1 rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Task</span>
            </button>
          </div>

          {/* Guided Tour / Help */}
          <button
            onClick={onOpenOnboarding}
            className="p-1.5 text-gray-500 hover:text-[#5145C5] hover:bg-[#F0EEFF] rounded-lg transition-colors border border-transparent hover:border-[#5145C5]/20"
            title="App Tour & Overview"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Reset Demo Quick Button */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
            title="Clear local prototype data"
          >
            <RotateCcw className="w-3 h-3 text-gray-500" />
            <span className="hidden lg:inline text-[11px]">Clear Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
