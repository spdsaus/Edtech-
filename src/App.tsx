/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { StorageService } from './services/storage';
import {
  ClassGroup,
  Learner,
  ParentContact,
  LessonPlan,
  MessageTemplate,
  MessageLog,
  TeacherTask,
  TeacherSettings,
  TimetablePeriod,
} from './types';
import { Sidebar, ActiveTab } from './components/Navigation/Sidebar';
import { MobileNav } from './components/Navigation/MobileNav';
import { Header } from './components/Navigation/Header';
import { DashboardView } from './components/Dashboard/DashboardView';
import { LessonPlannerView } from './components/LessonPlanner/LessonPlannerView';
import { CommandCentreView } from './components/CommandCentre/CommandCentreView';
import { MyClassesView } from './components/MyClasses/MyClassesView';
import { TasksAssistantView } from './components/Tasks/TasksAssistantView';
import { SettingsView } from './components/Settings/SettingsView';
import { OnboardingModal } from './components/OnboardingModal';

function MainApp() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Persistent States
  const [classes, setClasses] = useState<ClassGroup[]>(() => StorageService.getClasses());
  const [learners, setLearners] = useState<Learner[]>(() => StorageService.getLearners());
  const [parents, setParents] = useState<ParentContact[]>(() => StorageService.getParents());
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(() => StorageService.getLessonPlans());
  const [templates, setTemplates] = useState<MessageTemplate[]>(() => StorageService.getTemplates());
  const [messageLogs, setMessageLogs] = useState<MessageLog[]>(() => StorageService.getMessageLogs());
  const [tasks, setTasks] = useState<TeacherTask[]>(() => StorageService.getTasks());
  const [settings, setSettings] = useState<TeacherSettings>(() => StorageService.getSettings());
  const [timetable, setTimetable] = useState<TimetablePeriod[]>(() => StorageService.getTimetable());

  // Deep-link state for lesson viewing
  const [selectedLessonForView, setSelectedLessonForView] = useState<LessonPlan | null>(null);

  // Sync state mutation helper (increments pendingSync if offline)
  const notifyStateChange = () => {
    if (!settings.isOnlineMode) {
      const updated = {
        ...settings,
        pendingSyncCount: (settings.pendingSyncCount || 0) + 1,
      };
      setSettings(updated);
      StorageService.saveSettings(updated);
    }
  };

  // 1. Classes & Learners Handlers
  const handleAddLearner = (learner: Learner) => {
    const updated = [learner, ...learners];
    setLearners(updated);
    StorageService.saveLearners(updated);

    // Also auto-generate linked parent record
    const newParent: ParentContact = {
      id: `prnt-${Date.now()}`,
      learnerId: learner.id,
      learnerName: `${learner.firstName} ${learner.lastName}`,
      learnerGrade: learner.grade,
      learnerClass: learner.classSection,
      guardianName: learner.guardianName,
      relationship: learner.guardianRelationship,
      phone: learner.guardianPhone,
      email: learner.guardianEmail,
      preferredLanguage: learner.homeLanguage,
      preferredChannel: 'WhatsApp',
      consentStatus: learner.consentStatus,
      consentDate: new Date().toISOString().split('T')[0],
    };
    const updatedParents = [newParent, ...parents];
    setParents(updatedParents);
    StorageService.saveParents(updatedParents);

    notifyStateChange();
  };

  const handleUpdateLearner = (learner: Learner) => {
    const updated = learners.map((l) => (l.id === learner.id ? learner : l));
    setLearners(updated);
    StorageService.saveLearners(updated);

    // Sync guardian in parents
    const updatedParents = parents.map((p) => {
      if (p.learnerId === learner.id) {
        return {
          ...p,
          learnerName: `${learner.firstName} ${learner.lastName}`,
          guardianName: learner.guardianName,
          relationship: learner.guardianRelationship,
          phone: learner.guardianPhone,
          email: learner.guardianEmail,
          preferredLanguage: learner.homeLanguage,
        };
      }
      return p;
    });
    setParents(updatedParents);
    StorageService.saveParents(updatedParents);

    notifyStateChange();
  };

  const handleDeleteLearner = (learnerId: string) => {
    const updated = learners.filter((l) => l.id !== learnerId);
    setLearners(updated);
    StorageService.saveLearners(updated);

    const updatedParents = parents.filter((p) => p.learnerId !== learnerId);
    setParents(updatedParents);
    StorageService.saveParents(updatedParents);

    notifyStateChange();
  };

  const handleBatchImportLearners = (newLearners: Learner[]) => {
    const updatedLearners = [...newLearners, ...learners];
    setLearners(updatedLearners);
    StorageService.saveLearners(updatedLearners);

    // Generate parent records
    const newParents: ParentContact[] = newLearners.map((learner) => ({
      id: `prnt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      learnerId: learner.id,
      learnerName: `${learner.firstName} ${learner.lastName}`,
      learnerGrade: learner.grade,
      learnerClass: learner.classSection,
      guardianName: learner.guardianName,
      relationship: learner.guardianRelationship,
      phone: learner.guardianPhone,
      email: learner.guardianEmail,
      preferredLanguage: learner.homeLanguage,
      preferredChannel: 'WhatsApp',
      consentStatus: 'opted-in',
      consentDate: new Date().toISOString().split('T')[0],
    }));

    const updatedParents = [...newParents, ...parents];
    setParents(updatedParents);
    StorageService.saveParents(updatedParents);

    notifyStateChange();
  };

  // 2. Lesson Plans Handlers
  const handleSavePlan = (plan: LessonPlan) => {
    const exists = lessonPlans.some((p) => p.id === plan.id);
    let updated: LessonPlan[];
    if (exists) {
      updated = lessonPlans.map((p) => (p.id === plan.id ? plan : p));
    } else {
      updated = [plan, ...lessonPlans];
    }
    setLessonPlans(updated);
    StorageService.saveLessonPlans(updated);
    setSelectedLessonForView(plan);
    notifyStateChange();
  };

  const handleDeletePlan = (planId: string) => {
    const updated = lessonPlans.filter((p) => p.id !== planId);
    setLessonPlans(updated);
    StorageService.saveLessonPlans(updated);
    if (selectedLessonForView?.id === planId) {
      setSelectedLessonForView(null);
    }
    notifyStateChange();
  };

  // 3. Command Centre Handlers
  const handleSendSimulatedMessage = (log: MessageLog) => {
    const updated = [log, ...messageLogs];
    setMessageLogs(updated);
    StorageService.saveMessageLogs(updated);
    notifyStateChange();
  };

  const handleUpdateParentConsent = (parentId: string, newStatus: 'opted-in' | 'opted-out' | 'pending') => {
    const updated = parents.map((p) => (p.id === parentId ? { ...p, consentStatus: newStatus } : p));
    setParents(updated);
    StorageService.saveParents(updated);
    notifyStateChange();
  };

  // 4. Tasks Handlers
  const handleAddTask = (task: TeacherTask) => {
    const updated = [task, ...tasks];
    setTasks(updated);
    StorageService.saveTasks(updated);
    notifyStateChange();
  };

  const handleUpdateTask = (task: TeacherTask) => {
    const updated = tasks.map((t) => (t.id === task.id ? task : t));
    setTasks(updated);
    StorageService.saveTasks(updated);
    notifyStateChange();
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    StorageService.saveTasks(updated);
    notifyStateChange();
  };

  const handleToggleTaskStatus = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;
    const nextStatus = target.status === 'Completed' ? 'Pending' : 'Completed';
    handleUpdateTask({
      ...target,
      status: nextStatus,
      completedAt: nextStatus === 'Completed' ? new Date().toISOString() : undefined,
    });
    showToast('info', 'Task Status Updated', `Task marked as ${nextStatus}.`);
  };

  const handleApproveSuggestedTask = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;
    handleUpdateTask({
      ...target,
      status: 'Pending',
    });
  };

  const handleDismissSuggestedTask = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;
    handleUpdateTask({
      ...target,
      status: 'Dismissed',
    });
  };

  // 5. Settings & Network Mode Simulator
  const handleSaveSettings = (newSettings: TeacherSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleToggleOnline = () => {
    const nextOnline = !settings.isOnlineMode;
    const updated: TeacherSettings = {
      ...settings,
      isOnlineMode: nextOnline,
      lastSyncedAt: nextOnline
        ? new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) + ' (Reconnected)'
        : settings.lastSyncedAt,
      pendingSyncCount: nextOnline ? 0 : settings.pendingSyncCount,
    };
    setSettings(updated);
    StorageService.saveSettings(updated);

    if (nextOnline) {
      showToast('success', 'Back Online', 'Flushed pending offline cache to simulated cloud storage.');
    } else {
      showToast('warning', 'Offline / Load-Shedding Mode', 'Local storage active. Changes will queue until connection returns.');
    }
  };

  // 6. Reset Demo Data
  const handleResetDemoData = () => {
    StorageService.resetAllDemoData();
    setClasses(StorageService.getClasses());
    setLearners(StorageService.getLearners());
    setParents(StorageService.getParents());
    setLessonPlans(StorageService.getLessonPlans());
    setTemplates(StorageService.getTemplates());
    setMessageLogs(StorageService.getMessageLogs());
    setTasks(StorageService.getTasks());
    setSettings(StorageService.getSettings());
    setTimetable(StorageService.getTimetable());
    setSelectedLessonForView(null);
    showToast('success', 'Demo Reset Complete', 'All data restored to original Thandeka Secondary demo state.');
  };

  // Navigation shortcuts
  const handleSelectLessonForView = (plan: LessonPlan) => {
    setSelectedLessonForView(plan);
    setActiveTab('planner');
  };

  const handleOpenQuickAction = (action: 'lesson' | 'message' | 'task') => {
    if (action === 'lesson') {
      setActiveTab('planner');
    } else if (action === 'message') {
      setActiveTab('command');
    } else if (action === 'task') {
      setActiveTab('tasks');
    }
  };

  const pendingTasksCount = tasks.filter((t) => t.status === 'Pending' || t.status === 'In progress' || t.status === 'Suggested').length;
  const unreadParentsCount = parents.filter((p) => p.consentStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex text-[#171936]">
      {/* Desktop Sidebar (Linear/Apple inspired) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        settings={settings}
        onToggleOnline={handleToggleOnline}
        onResetDemo={handleResetDemoData}
        pendingTasksCount={pendingTasksCount}
        unreadParentsCount={unreadParentsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Header
          activeTab={activeTab}
          settings={settings}
          onToggleOnline={handleToggleOnline}
          onOpenQuickAction={handleOpenQuickAction}
          onResetDemo={handleResetDemoData}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              timetable={timetable}
              tasks={tasks}
              messageLogs={messageLogs}
              lessonPlans={lessonPlans}
              settings={settings}
              onNavigateTab={setActiveTab}
              onToggleTaskStatus={handleToggleTaskStatus}
              onSelectLessonForView={handleSelectLessonForView}
              onStartNewLesson={() => setActiveTab('planner')}
              onStartNewMessage={() => setActiveTab('command')}
            />
          )}

          {activeTab === 'planner' && (
            <LessonPlannerView
              lessonPlans={lessonPlans}
              onSavePlan={handleSavePlan}
              onDeletePlan={handleDeletePlan}
              initialSelectedPlan={selectedLessonForView}
            />
          )}

          {activeTab === 'command' && (
            <CommandCentreView
              parents={parents}
              templates={templates}
              messageLogs={messageLogs}
              settings={settings}
              onSendSimulatedMessage={handleSendSimulatedMessage}
              onUpdateParentConsent={handleUpdateParentConsent}
            />
          )}

          {activeTab === 'classes' && (
            <MyClassesView
              classes={classes}
              learners={learners}
              onAddLearner={handleAddLearner}
              onUpdateLearner={handleUpdateLearner}
              onDeleteLearner={handleDeleteLearner}
              onBatchImportLearners={handleBatchImportLearners}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksAssistantView
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onApproveSuggestedTask={handleApproveSuggestedTask}
              onDismissSuggestedTask={handleDismissSuggestedTask}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onToggleOnline={handleToggleOnline}
              onResetDemoData={handleResetDemoData}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Mobile Android-Friendly Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Guided Tour Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onJumpToTab={setActiveTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
