import React from 'react';
import {
  LayoutDashboard,
  BookOpenCheck,
  Radio,
  Users,
  CheckSquare,
  Settings,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface MobileNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingTasksCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  pendingTasksCount,
}) => {
  const items = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner' as ActiveTab, label: 'Planner', icon: BookOpenCheck },
    { id: 'command' as ActiveTab, label: 'Comms', icon: Radio },
    { id: 'classes' as ActiveTab, label: 'Classes', icon: Users },
    { id: 'tasks' as ActiveTab, label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#171936] border-t border-[#262A56] pb-safe px-1 py-1 shadow-2xl">
      <div className="grid grid-cols-6 gap-0.5 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-white'
                  : 'text-[#8E94C5] hover:text-[#C5C8E5] active:scale-95'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-[#5145C5] text-white shadow-sm' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-full font-medium ${isActive ? 'font-bold text-white' : ''}`}>
                {item.label}
              </span>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-2.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#171936]">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
