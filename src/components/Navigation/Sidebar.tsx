import React from 'react';
import {
  LayoutDashboard,
  BookOpenCheck,
  Radio,
  Users,
  CheckSquare,
  Settings,
  Sparkles,
  WifiOff,
  Moon,
  RotateCcw,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import { TeacherSettings } from '../../types';

export type ActiveTab = 'dashboard' | 'planner' | 'command' | 'classes' | 'tasks' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  settings: TeacherSettings;
  onResetDemo: () => void;
  pendingTasksCount: number;
  unreadParentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  settings,
  onResetDemo,
  pendingTasksCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      subtitle: 'Overview & Timetable',
      icon: LayoutDashboard,
    },
    {
      id: 'planner' as ActiveTab,
      label: 'Lesson Planner',
      subtitle: 'CAPS Draft Builder',
      icon: BookOpenCheck,
      badge: 'CAPS',
    },
    {
      id: 'command' as ActiveTab,
      label: 'Command Centre',
      subtitle: 'Multilingual Parent Comms',
      icon: Radio,
    },
    {
      id: 'classes' as ActiveTab,
      label: 'My Classes',
      subtitle: 'Learners & CSV Import',
      icon: Users,
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Tasks & Assistant',
      subtitle: 'Smart Briefings',
      icon: CheckSquare,
      badgeCount: pendingTasksCount,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      subtitle: 'Profile & CAPS Config',
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden lg:flex w-72 flex-col bg-[#171936] text-white shrink-0 border-r border-[#262A56] select-none h-screen sticky top-0">
      {/* Brand & School Header */}
      <div className="p-5 border-b border-[#262A56]/80 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5145C5] to-[#7162E8] flex items-center justify-center shadow-lg shadow-[#5145C5]/20 ring-1 ring-white/10">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white text-base">NexGen Teacher</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#5145C5]/40 text-[#F0EEFF] border border-[#7162E8]/40">
                MVP
              </span>
            </div>
            <p className="text-xs text-[#9DA2C7] font-medium truncate">Plan. Communicate. Manage.</p>
          </div>
        </div>

        {/* School Context Chip */}
        <div className="bg-[#1F2347] rounded-lg p-2.5 border border-[#2B3060] flex items-center justify-between">
          <div className="truncate">
            <div className="text-[11px] font-semibold text-white tracking-wide truncate">
              {settings.schoolName}
            </div>
            <div className="text-[10px] text-[#9DA2C7] truncate">
              {settings.province} • CAPS
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Term 2 Active" />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A80B0] px-3 py-1.5">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-[#5145C5] text-white shadow-md shadow-[#5145C5]/25 font-semibold'
                  : 'text-[#C5C8E5] hover:bg-[#20254D] hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-white' : 'text-[#8E94C5] group-hover:text-white'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="leading-tight truncate">{item.label}</div>
                <div className={`text-[10px] truncate ${isActive ? 'text-[#E2E0FF]' : 'text-[#7B82B5]'}`}>
                  {item.subtitle}
                </div>
              </div>

              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-white shrink-0">
                  {item.badge}
                </span>
              )}

              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white shrink-0">
                  {item.badgeCount}
                </span>
              )}

              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-white/70 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Status safeguards & Simulator bar */}
      <div className="p-3 border-t border-[#262A56] space-y-2 bg-[#141630]/60">
        {/* Quiet hours notification if active */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#1B1E3F] text-[11px] text-[#A6ACD8] border border-[#2B3060]">
          <div className="flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Quiet Hours: {settings.quietHoursStart} – {settings.quietHoursEnd}</span>
          </div>
          <span className="text-[9px] font-semibold uppercase text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
            Enforced
          </span>
        </div>

        {/* Connectivity status toggle */}
        <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border bg-[#1C2044] border-[#2D3369] text-indigo-200" title="Browser-local storage only; no cloud connection exists.">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
            <span>Browser-local storage</span>
          </div>
          <span className="text-[10px] opacity-70">No cloud sync</span>
        </div>

        {/* Teacher Profile Footer & Reset Demo button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-700 text-white font-bold text-xs flex items-center justify-center ring-1 ring-white/20">
              {settings.teacherName ? settings.teacherName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() : 'NT'}
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-white leading-tight">Your profile</div>
              <div className="text-[10px] text-[#8C93C7]">Set up your profile</div>
            </div>
          </div>
          <button
            onClick={onResetDemo}
            className="p-1.5 text-[#8C93C7] hover:text-white hover:bg-[#20254D] rounded-lg transition-colors"
            title="Clear local prototype data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
