export type LanguageCode = 'en' | 'af' | 'zu' | 'xh' | 'st';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export type ChannelType = 'WhatsApp' | 'SMS' | 'Email';

export type ConsentStatus = 'opted-in' | 'opted-out' | 'pending';

export interface ParentContact {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerGrade: string;
  learnerClass: string;
  guardianName: string;
  relationship: 'Mother' | 'Father' | 'Grandmother' | 'Uncle' | 'Guardian';
  phone: string;
  email: string;
  preferredLanguage: LanguageCode;
  preferredChannel: ChannelType;
  consentStatus: ConsentStatus;
  consentDate?: string;
  optOutReason?: string;
  notes?: string;
}

export interface Learner {
  id: string;
  learnerNumber: string; // e.g. TSS-2026-089
  firstName: string;
  lastName: string;
  gender: 'Female' | 'Male' | 'Other';
  grade: string; // '9', '10', '11'
  classSection: string; // '9A', '9B', '10B', '11A'
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianRelationship: 'Mother' | 'Father' | 'Grandmother' | 'Uncle' | 'Guardian';
  homeLanguage: LanguageCode;
  specialNeedsNotes?: string;
  academicNotes?: string;
  consentStatus: ConsentStatus;
}

export interface ClassGroup {
  id: string;
  grade: string;
  section: string; // e.g. '9A'
  name: string;
  subject: string;
  room: string;
  learnerCount: number;
  periodSchedule: string;
}

export interface LessonActivity {
  id: string;
  title: string;
  durationMinutes: number;
  teacherRole: string;
  learnerRole: string;
  activityType: 'Introduction' | 'Direct Instruction' | 'Group Work' | 'Practical / Experiment' | 'Individual Practice' | 'Assessment Check' | 'Wrap-up / Homework';
}

export interface LessonPlan {
  id: string;
  title: string;
  grade: string;
  subject: string;
  capsStrand: string;
  term: number; // 1, 2, 3, 4
  week: number;
  date: string;
  periodDuration: number; // in minutes, e.g. 45
  assignedClass: string; // e.g. '9A'
  textbookReference: string;
  isAiGenerated: boolean;
  reviewedByTeacher: boolean;
  status: 'Draft' | 'Approved' | 'Taught' | 'Archived';
  objectives: string[];
  capsOutcomes: string[];
  introductionHook: {
    durationMinutes: number;
    description: string;
  };
  activities: LessonActivity[];
  diagnosticQuestions: {
    bloomLevel: 'Remembering / Understanding' | 'Applying / Analyzing' | 'Evaluating / Creating';
    question: string;
    expectedAnswer: string;
  }[];
  differentiation: {
    enrichment: string;
    scaffolding: string;
  };
  assessmentMethod: string;
  resourcesNeeded: string[];
  conclusionSummary: {
    durationMinutes: number;
    description: string;
    homeworkTask: string;
  };
  teacherReflectionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  category: 'Homework' | 'Assessment' | 'Behavior' | 'Meeting' | 'School Event' | 'Praise';
  translations: Record<LanguageCode, {
    subject: string;
    body: string;
  }>;
}

export interface MessageLog {
  id: string;
  recipientType: 'Individual' | 'Group' | 'Class';
  recipientTarget: string; // e.g. "Grade 9A Parents (32 recipients)" or "Mr. Bongani Khumalo"
  recipientCount: number;
  channel: ChannelType;
  language: LanguageCode;
  subject: string;
  body: string;
  status: 'Sent' | 'Scheduled' | 'Failed' | 'Draft';
  sentAt: string;
  scheduledFor?: string;
  isSimulated: boolean;
  excludedOptOutCount: number;
}

export type TaskStatus = 'Suggested' | 'Pending' | 'In progress' | 'Completed' | 'Dismissed';
export type TaskPriority = 'Urgent' | 'High' | 'Normal' | 'Low';
export type TaskCategory = 'Lesson Prep' | 'Parent Communication' | 'School Admin' | 'Assessment Marking' | 'Department';

export interface TeacherTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string;
  duePeriod?: string;
  isAiSuggested: boolean;
  aiRationale?: string;
  linkedEntityId?: string; // id of lesson or parent or class
  completedAt?: string;
}

export interface TimetablePeriod {
  periodNumber: number;
  timeRange: string;
  gradeClass: string;
  subject: string;
  room: string;
  topic: string;
  status: 'Completed' | 'Current' | 'Upcoming';
  lessonPlanId?: string;
}

export interface TeacherSettings {
  teacherName: string;
  teacherTitle: string;
  staffId: string;
  email: string;
  phone: string;
  schoolName: string;
  schoolDistrict: string;
  schoolCircuit: string;
  province: string;
  curriculum: string;
  subjectsTaught: string[];
  gradesTaught: string[];
  textbooks: string[];
  defaultLanguage: LanguageCode;
  defaultChannel: ChannelType;
  quietHoursStart: string; // "18:00"
  quietHoursEnd: string;   // "06:30"
  enforceQuietHours: boolean;
  enableMorningBrief: boolean;
  enablePeriodReminders: boolean;
  enableEndOfDayWrap: boolean;
  isOnlineMode: boolean;
  lastSyncedAt: string;
  pendingSyncCount: number;
}
