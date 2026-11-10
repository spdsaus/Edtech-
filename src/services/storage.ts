import {
  Learner,
  ParentContact,
  ClassGroup,
  LessonPlan,
  MessageTemplate,
  MessageLog,
  TeacherTask,
  TeacherSettings,
  TimetablePeriod,
} from '../types';
import { INITIAL_TEMPLATES, INITIAL_SETTINGS } from '../data/initialData';

const STORAGE_KEYS = {
  CLASSES: 'nexgen_classes_v2',
  LEARNERS: 'nexgen_learners_v2',
  PARENTS: 'nexgen_parents_v2',
  LESSON_PLANS: 'nexgen_lesson_plans_v2',
  TEMPLATES: 'nexgen_templates_v2',
  MESSAGE_LOGS: 'nexgen_message_logs_v2',
  TASKS: 'nexgen_tasks_v2',
  SETTINGS: 'nexgen_settings_v2',
  TIMETABLE: 'nexgen_timetable_v2',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  getClasses(): ClassGroup[] {
    return safeGet<ClassGroup[]>(STORAGE_KEYS.CLASSES, []);
  },
  saveClasses(classes: ClassGroup[]): void {
    safeSet(STORAGE_KEYS.CLASSES, classes);
  },

  getLearners(): Learner[] {
    return safeGet<Learner[]>(STORAGE_KEYS.LEARNERS, []);
  },
  saveLearners(learners: Learner[]): void {
    safeSet(STORAGE_KEYS.LEARNERS, learners);
  },

  getParents(): ParentContact[] {
    return safeGet<ParentContact[]>(STORAGE_KEYS.PARENTS, []);
  },
  saveParents(parents: ParentContact[]): void {
    safeSet(STORAGE_KEYS.PARENTS, parents);
  },

  getLessonPlans(): LessonPlan[] {
    return safeGet<LessonPlan[]>(STORAGE_KEYS.LESSON_PLANS, []);
  },
  saveLessonPlans(plans: LessonPlan[]): void {
    safeSet(STORAGE_KEYS.LESSON_PLANS, plans);
  },

  getTemplates(): MessageTemplate[] {
    return safeGet<MessageTemplate[]>(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES);
  },
  saveTemplates(templates: MessageTemplate[]): void {
    safeSet(STORAGE_KEYS.TEMPLATES, templates);
  },

  getMessageLogs(): MessageLog[] {
    return safeGet<MessageLog[]>(STORAGE_KEYS.MESSAGE_LOGS, []);
  },
  saveMessageLogs(logs: MessageLog[]): void {
    safeSet(STORAGE_KEYS.MESSAGE_LOGS, logs);
  },

  getTasks(): TeacherTask[] {
    return safeGet<TeacherTask[]>(STORAGE_KEYS.TASKS, []);
  },
  saveTasks(tasks: TeacherTask[]): void {
    safeSet(STORAGE_KEYS.TASKS, tasks);
  },

  getSettings(): TeacherSettings {
    return safeGet<TeacherSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },
  saveSettings(settings: TeacherSettings): void {
    safeSet(STORAGE_KEYS.SETTINGS, settings);
  },

  getTimetable(): TimetablePeriod[] {
    return safeGet<TimetablePeriod[]>(STORAGE_KEYS.TIMETABLE, []);
  },
  saveTimetable(timetable: TimetablePeriod[]): void {
    safeSet(STORAGE_KEYS.TIMETABLE, timetable);
  },

  resetAllDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.CLASSES);
    localStorage.removeItem(STORAGE_KEYS.LEARNERS);
    localStorage.removeItem(STORAGE_KEYS.PARENTS);
    localStorage.removeItem(STORAGE_KEYS.LESSON_PLANS);
    localStorage.removeItem(STORAGE_KEYS.TEMPLATES);
    localStorage.removeItem(STORAGE_KEYS.MESSAGE_LOGS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.TIMETABLE);

    safeSet(STORAGE_KEYS.CLASSES, []);
    safeSet(STORAGE_KEYS.LEARNERS, []);
    safeSet(STORAGE_KEYS.PARENTS, []);
    safeSet(STORAGE_KEYS.LESSON_PLANS, []);
    safeSet(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES);
    safeSet(STORAGE_KEYS.MESSAGE_LOGS, []);
    safeSet(STORAGE_KEYS.TASKS, []);
    safeSet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    safeSet(STORAGE_KEYS.TIMETABLE, []);
  },
};
