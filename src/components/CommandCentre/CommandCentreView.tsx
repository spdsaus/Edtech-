import React, { useState } from 'react';
import {
  Radio,
  Send,
  MessageSquare,
  Users,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Globe,
  Clock,
  Moon,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Eye,
  Edit2,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  Phone,
  Mail,
  Copy,
} from 'lucide-react';
import {
  ParentContact,
  MessageTemplate,
  MessageLog,
  TeacherSettings,
  LanguageCode,
  ChannelType,
} from '../../types';
import { OFFICIAL_LANGUAGES } from '../../data/initialData';
import { useToast } from '../../context/ToastContext';

interface CommandCentreViewProps {
  parents: ParentContact[];
  templates: MessageTemplate[];
  messageLogs: MessageLog[];
  settings: TeacherSettings;
  onSendSimulatedMessage: (log: MessageLog) => void;
  onUpdateParentConsent: (parentId: string, newStatus: 'opted-in' | 'opted-out' | 'pending') => void;
}

type WorkflowStep = 'compose' | 'preview' | 'edit' | 'approve' | 'confirmed';

export const CommandCentreView: React.FC<CommandCentreViewProps> = ({
  parents,
  templates,
  messageLogs,
  settings,
  onSendSimulatedMessage,
  onUpdateParentConsent,
}) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'compose' | 'directory' | 'history'>('compose');
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>('compose');

  // Form State
  const [recipientType, setRecipientType] = useState<'Class' | 'Group' | 'Individual'>('Class');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedIndividualParentId, setSelectedIndividualParentId] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>('WhatsApp');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');

  // Editable message contents
  const [messageSubject, setMessageSubject] = useState<string>(
    templates[0]?.translations.en.subject || ''
  );
  const [messageBody, setMessageBody] = useState<string>(
    templates[0]?.translations.en.body || ''
  );

  // Scheduling options
  const [scheduleOption, setScheduleOption] = useState<'now' | 'morning' | 'custom'>('now');
  const [customScheduleTime, setCustomScheduleTime] = useState<string>('');

  // Directory filter states
  const [directoryClassFilter, setDirectoryClassFilter] = useState<string>('All');
  const [directorySearch, setDirectorySearch] = useState<string>('');

  // Check Quiet Hours status (Simulated check against 18:00 - 06:30)
  const getMinutes = (value: string) => {
    const [hours, minutes] = value.split(':').map(Number);
    return Number.isInteger(hours) && Number.isInteger(minutes) ? hours * 60 + minutes : null;
  };
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const quietStart = getMinutes(settings.quietHoursStart);
  const quietEnd = getMinutes(settings.quietHoursEnd);
  const isQuietHoursActive = Boolean(settings.enforceQuietHours && quietStart !== null && quietEnd !== null &&
    (quietStart <= quietEnd
      ? currentMinutes >= quietStart && currentMinutes < quietEnd
      : currentMinutes >= quietStart || currentMinutes < quietEnd));

  // Recipient computation & Opt-out filtering
  const getRecipients = () => {
    if (recipientType === 'Class') {
      const classParents = parents.filter((p) => p.learnerClass === selectedClass);
      const eligible = classParents.filter((p) => p.consentStatus === 'opted-in');
      const excluded = classParents.filter((p) => p.consentStatus !== 'opted-in');
      return {
        targetName: `Grade ${selectedClass || '—'} Guardians (${eligible.length} eligible)`,
        eligible,
        excluded,
      };
    } else if (recipientType === 'Group') {
      const eligible = parents.filter((p) => p.learnerGrade === '9' && p.consentStatus === 'opted-in');
      const excluded = parents.filter((p) => p.learnerGrade === '9' && p.consentStatus !== 'opted-in');
      return {
        targetName: `Grade 9 Science Cohort (${eligible.length} eligible)`,
        eligible,
        excluded,
      };
    } else {
      const parent = parents.find((p) => p.id === selectedIndividualParentId);
      const isEligible = parent?.consentStatus === 'opted-in';
      return {
        targetName: `${parent?.guardianName} (${parent?.learnerName})`,
        eligible: isEligible && parent ? [parent] : [],
        excluded: !isEligible && parent ? [parent] : [],
      };
    }
  };

  const { targetName, eligible, excluded } = getRecipients();

  // Template switch handler
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      const translation = tmpl.translations[selectedLanguage] || tmpl.translations.en;
      setMessageSubject(translation.subject);
      setMessageBody(translation.body);
    }
  };

  // Language switch handler
  const handleSelectLanguage = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    const tmpl = templates.find((t) => t.id === selectedTemplateId);
    if (tmpl) {
      const translation = tmpl.translations[lang] || tmpl.translations.en;
      setMessageSubject(translation.subject);
      setMessageBody(translation.body);
    }
  };

  // Execute Simulated Send
  const handleConfirmSend = () => {
    if (eligible.length === 0) {
      showToast('warning', 'No Eligible Recipients', 'Add a guardian with recorded consent before creating a dispatch preview.');
      return;
    }
    if (scheduleOption === 'now' && settings.enforceQuietHours && isQuietHoursActive) {
      showToast('error', 'Quiet Hours Active', 'Choose a delivery time outside the configured quiet hours.');
      return;
    }
    if (scheduleOption === 'custom' && (!customScheduleTime || new Date(customScheduleTime).getTime() <= Date.now())) {
      showToast('error', 'Invalid Schedule', 'Choose a future date and time.');
      return;
    }
    const isScheduled = scheduleOption !== 'now';
    const newLog: MessageLog = {
      id: `msg-${Date.now()}`,
      recipientType,
      recipientTarget: targetName,
      recipientCount: eligible.length,
      channel: selectedChannel,
      language: selectedLanguage,
      subject: messageSubject,
      body: messageBody,
      status: isScheduled ? 'Scheduled' : 'Draft',
      sentAt: isScheduled
        ? `Scheduled for ${scheduleOption === 'morning' ? 'Tomorrow 07:30' : customScheduleTime}`
        : new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) + ' Today',
      isSimulated: true,
      excludedOptOutCount: excluded.length,
    };

    onSendSimulatedMessage(newLog);
    setWorkflowStep('confirmed');
    showToast(
      'success',
      isScheduled ? 'Broadcast Scheduled' : 'Simulated Dispatch Draft Created',
      `${eligible.length} parents queued. ${excluded.length} opted-out contacts safely bypassed.`
    );
  };

  const handleResetWorkflow = () => {
    setWorkflowStep('compose');
  };

  // Filtered parent directory
  const filteredParents = parents.filter((p) => {
    const matchesClass = directoryClassFilter === 'All' || p.learnerClass === directoryClassFilter;
    const matchesSearch =
      p.guardianName.toLowerCase().includes(directorySearch.toLowerCase()) ||
      p.learnerName.toLowerCase().includes(directorySearch.toLowerCase()) ||
      p.phone.includes(directorySearch);
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#171936] tracking-tight">
            Teacher Command Centre
          </h2>
          <p className="text-xs text-gray-500">
            Safe South African parent communication • POPIA opt-out protection • 5 Official Languages
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-gray-200 shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'compose'
                ? 'bg-[#5145C5] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#171936] hover:bg-gray-100'
            }`}
          >
            Compose Broadcast
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'directory'
                ? 'bg-[#5145C5] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#171936] hover:bg-gray-100'
            }`}
          >
            Parent Directory ({parents.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-[#5145C5] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#171936] hover:bg-gray-100'
            }`}
          >
            Dispatch Log ({messageLogs.length})
          </button>
        </div>
      </div>

      {/* Honest Sandbox Disclaimer */}
      <div className="p-3.5 rounded-xl bg-violet-50/70 border border-violet-200 text-violet-950 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-bold block">Local Simulated Messaging Engine</span>
          <span>
            NexGen Teacher operates safely within your sandboxed environment. Real WhatsApp/SMS gateway charges and external APIs are completely bypassed. All delivery states, translations, and opt-out filters are verified locally.
          </span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* TAB 1: COMPOSE WORKFLOW (Compose → Preview → Edit → Approve → Confirm) */}
      {/* ================================================================ */}
      {activeTab === 'compose' && (
        <div className="space-y-6">
          {/* 5-Step Visual Workflow Stepper Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="grid grid-cols-5 gap-1 text-center">
              {[
                { id: 'compose', stepNum: 1, label: 'Compose' },
                { id: 'preview', stepNum: 2, label: 'Language Preview' },
                { id: 'edit', stepNum: 3, label: 'Edit & Polish' },
                { id: 'approve', stepNum: 4, label: 'Teacher Approve' },
                { id: 'confirmed', stepNum: 5, label: 'Simulated Send' },
              ].map((step) => {
                const isActive = workflowStep === step.id;
                const isPast =
                  ['compose', 'preview', 'edit', 'approve', 'confirmed'].indexOf(workflowStep) >=
                  ['compose', 'preview', 'edit', 'approve', 'confirmed'].indexOf(step.id);
                return (
                  <div
                    key={step.id}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#5145C5] text-white shadow-xs'
                        : isPast
                        ? 'bg-[#F0EEFF] text-[#5145C5]'
                        : 'text-gray-400'
                    }`}
                  >
                    <div className="text-[10px] opacity-80 uppercase tracking-wider">Step {step.stepNum}</div>
                    <div className="truncate font-bold mt-0.5">{step.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quiet Hours Safeguard Notification Banner */}
          {settings.enforceQuietHours && isQuietHoursActive && (
            <div className="p-3.5 rounded-xl bg-indigo-950 text-white flex items-center justify-between text-xs border border-indigo-800">
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-indigo-300" />
                <div>
                  <strong className="text-white block font-semibold">
                    School Quiet Hours Enforced ({settings.quietHoursStart} – {settings.quietHoursEnd})
                  </strong>
                  <span className="text-[#C5C8E5]">
                    Configured school quiet hours prevent immediate dispatch during this period.
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-indigo-800 text-indigo-200 font-bold px-2 py-1 rounded-md">
                Scheduling Required
              </span>
            </div>
          )}

          {/* STEP 1: COMPOSE */}
          {workflowStep === 'compose' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <h3 className="text-base font-bold text-[#171936]">Step 1: Configure Broadcast</h3>
                  <p className="text-xs text-gray-500">Select audience, channel, and message template</p>
                </div>
                <span className="text-xs font-bold text-[#5145C5] bg-[#F0EEFF] px-2.5 py-1 rounded-lg">
                  Target: {targetName}
                </span>
              </div>

              {/* Recipient Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700 block">Recipient Audience</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setRecipientType('Class')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      recipientType === 'Class'
                        ? 'bg-[#F0EEFF] border-[#5145C5] text-[#171936] font-bold shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span>Whole Class Cohort</span>
                      {recipientType === 'Class' && <CheckCircle2 className="w-4 h-4 text-[#5145C5]" />}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">Broadcast to all parents in class</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipientType('Group')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      recipientType === 'Group'
                        ? 'bg-[#F0EEFF] border-[#5145C5] text-[#171936] font-bold shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span>Subject Group</span>
                      {recipientType === 'Group' && <CheckCircle2 className="w-4 h-4 text-[#5145C5]" />}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">Grade 9 Science Students</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRecipientType('Individual');
                      if (!selectedIndividualParentId && parents.length > 0) {
                        setSelectedIndividualParentId(parents[0].id);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      recipientType === 'Individual'
                        ? 'bg-[#F0EEFF] border-[#5145C5] text-[#171936] font-bold shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span>Individual Parent</span>
                      {recipientType === 'Individual' && <CheckCircle2 className="w-4 h-4 text-[#5145C5]" />}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">Private 1-on-1 parent notice</div>
                  </button>
                </div>
              </div>

              {/* Sub-selector depending on Recipient Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recipientType === 'Class' && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Select Class</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold"
                    >
                      <option value="9A">Grade 9A (34 Learners)</option>
                      <option value="9B">Grade 9B (32 Learners)</option>
                      <option value="10B">Grade 10B (28 Learners)</option>
                      <option value="11A">Grade 11A (26 Learners)</option>
                    </select>
                  </div>
                )}

                {recipientType === 'Individual' && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Select Guardian</label>
                    <select
                      value={selectedIndividualParentId}
                      onChange={(e) => setSelectedIndividualParentId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold"
                    >
                      {parents.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.guardianName} ({p.learnerName} - {p.learnerClass}) [{p.consentStatus}]
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Delivery Channel</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['WhatsApp', 'SMS', 'Email'] as ChannelType[]).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setSelectedChannel(ch)}
                        className={`py-2 px-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                          selectedChannel === ch
                            ? 'bg-[#171936] text-white shadow-xs'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Opt-Out Safeguard Indicator (Crucial POPIA check) */}
              {excluded.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-2.5 text-xs">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">
                      POPIA Safeguard: {excluded.length} Parent(s) Excluded from this Broadcast
                    </strong>
                    <span className="text-amber-900 leading-relaxed">
                      {excluded.map((p) => `${p.guardianName} (${p.learnerName})`).join(', ')} has opted out or has pending consent. The system will safely bypass them.
                    </span>
                  </div>
                </div>
              )}

              {/* Template Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">
                  Select South African School Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {templates.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedTemplateId === tmpl.id
                          ? 'bg-[#F0EEFF] border-[#5145C5] shadow-xs ring-1 ring-[#5145C5]/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5145C5] block">
                        {tmpl.category}
                      </span>
                      <div className="text-xs font-bold text-[#171936] mt-0.5 line-clamp-1">
                        {tmpl.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Step CTA */}
              <div className="flex justify-end pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setWorkflowStep('preview')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5145C5] hover:bg-[#4337b0] text-white font-bold text-xs shadow-sm transition-all"
                >
                  <span>Proceed to Language Preview</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LANGUAGE PREVIEW (English, isiZulu, isiXhosa, Afrikaans, Sesotho) */}
          {workflowStep === 'preview' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
                <div>
                  <h3 className="text-base font-bold text-[#171936]">Step 2: Multilingual Language Preview</h3>
                  <p className="text-xs text-gray-500">
                    Preview how your message reads in South Africa's 5 primary classroom languages
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  Target Channel: <strong>{selectedChannel}</strong>
                </span>
              </div>

              {/* Language Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {OFFICIAL_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      selectedLanguage === lang.code
                        ? 'bg-[#171936] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 opacity-70" />
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] opacity-60">({lang.name})</span>
                  </button>
                ))}
              </div>

              {/* Message Simulation Preview Card (Simulating Smartphone Message View) */}
              <div className="max-w-lg mx-auto bg-gray-100 rounded-3xl p-4 border-4 border-gray-200 shadow-inner">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2 text-[11px] text-gray-500">
                    <div className="flex items-center gap-1.5 font-bold text-[#171936]">
                      <Radio className="w-3.5 h-3.5 text-[#5145C5]" />
                      <span>Thandeka Secondary • {selectedChannel}</span>
                    </div>
                    <span>Language: {selectedLanguage.toUpperCase()}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#171936] mb-1">{messageSubject}</h4>
                    <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed font-sans bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                      {messageBody}
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-400 text-right">
                    Delivered via {selectedChannel} Sandbox
                  </div>
                </div>
              </div>

              {/* Navigation CTAs */}
              <div className="flex items-center justify-between pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setWorkflowStep('compose')}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors"
                >
                  Back to Compose
                </button>
                <button
                  type="button"
                  onClick={() => setWorkflowStep('edit')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5145C5] hover:bg-[#4337b0] text-white font-bold text-xs shadow-sm transition-all"
                >
                  <span>Proceed to Edit & Polish</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: EDIT & POLISH */}
          {workflowStep === 'edit' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <h3 className="text-base font-bold text-[#171936]">Step 3: Edit & Polish Message</h3>
                  <p className="text-xs text-gray-500">
                    Customize text, adjust placeholders, or add school-specific notices
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
                  Editing in: {selectedLanguage.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Subject Header</label>
                  <input
                    type="text"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Message Body</label>
                  <textarea
                    rows={8}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 leading-relaxed font-sans"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Supported tags: <code>{`{LearnerName}`}</code>, <code>{`{GuardianName}`}</code>
                  </span>
                </div>

                {/* Scheduling controls */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <label className="font-bold text-gray-800 block">Dispatch Schedule</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setScheduleOption('now')}
                      className={`p-2.5 rounded-lg border text-left text-xs font-semibold ${
                        scheduleOption === 'now'
                          ? 'bg-[#171936] text-white shadow-xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Send Immediately
                    </button>

                    <button
                      type="button"
                      onClick={() => setScheduleOption('morning')}
                      className={`p-2.5 rounded-lg border text-left text-xs font-semibold ${
                        scheduleOption === 'morning'
                          ? 'bg-[#171936] text-white shadow-xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Schedule for 07:30 (Quiet Hours Safe)
                    </button>

                    <button
                      type="button"
                      onClick={() => setScheduleOption('custom')}
                      className={`p-2.5 rounded-lg border text-left text-xs font-semibold ${
                        scheduleOption === 'custom'
                          ? 'bg-[#171936] text-white shadow-xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Custom Date / Time
                    </button>
                  </div>

                  {scheduleOption === 'custom' && (
                    <input
                      type="text"
                      value={customScheduleTime}
                      onChange={(e) => setCustomScheduleTime(e.target.value)}
                      placeholder="e.g. 2026-05-19 07:30"
                      className="px-3 py-1.5 rounded-lg border bg-white text-xs w-full sm:w-64"
                    />
                  )}
                </div>
              </div>

              {/* Navigation CTAs */}
              <div className="flex items-center justify-between pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setWorkflowStep('preview')}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors"
                >
                  Back to Preview
                </button>
                <button
                  type="button"
                  onClick={() => setWorkflowStep('approve')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5145C5] hover:bg-[#4337b0] text-white font-bold text-xs shadow-sm transition-all"
                >
                  <span>Proceed to Final Approval</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: TEACHER APPROVE */}
          {workflowStep === 'approve' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
              <div className="pb-3 border-b">
                <h3 className="text-base font-bold text-[#171936]">Step 4: Teacher Approval & Safety Verification</h3>
                <p className="text-xs text-gray-500">
                  Review final dispatch parameters before authorizing simulated transmission
                </p>
              </div>

              {/* Safety Checklist Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-gray-200 bg-[#F7F8FC] space-y-2.5">
                  <h4 className="font-bold text-[#171936] uppercase tracking-wider text-[11px]">
                    Transmission Details
                  </h4>
                  <div className="space-y-1.5 text-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Target Cohort:</span>
                      <strong className="text-[#171936]">{targetName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Channel:</span>
                      <strong className="text-[#5145C5]">{selectedChannel}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Active Language:</span>
                      <strong className="text-[#171936]">
                        {OFFICIAL_LANGUAGES.find((l) => l.code === selectedLanguage)?.name}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Eligible Recipients:</span>
                      <strong className="text-emerald-700 font-bold">{eligible.length} Guardians</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-[#F7F8FC] space-y-2.5">
                  <h4 className="font-bold text-[#171936] uppercase tracking-wider text-[11px]">
                    Regulatory Compliance (POPIA)
                  </h4>
                  <div className="space-y-1.5 text-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Opt-Out Protection:</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Enforced ({excluded.length} skipped)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Quiet Hours:</span>
                      <span className="text-indigo-700 font-bold">18:00 – 06:30 Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Authorizing Educator:</span>
                      <strong className="text-[#171936]">Ms. Nomvula Dlamini</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Summary Card */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-[#F0EEFF]/50 text-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#5145C5]">Approved Text Preview</span>
                <div className="font-bold text-[#171936]">{messageSubject}</div>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{messageBody}</p>
              </div>

              {/* Navigation CTAs */}
              <div className="flex items-center justify-between pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setWorkflowStep('edit')}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors"
                >
                  Back to Edit
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSend}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Authorize & Confirm Simulated Send</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMED */}
          {workflowStep === 'confirmed' && (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#171936]">Broadcast Simulated Successfully!</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  The message has been logged into your delivery history for <strong>{targetName}</strong>. 
                  {excluded.length > 0 && ` ${excluded.length} opted-out contacts were safely bypassed.`}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleResetWorkflow}
                  className="px-4 py-2 rounded-xl bg-[#5145C5] text-white text-xs font-bold hover:bg-[#4337b0] transition-colors"
                >
                  Compose Another Note
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors"
                >
                  View Dispatch Log
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 2: PARENT DIRECTORY (Contact preferences, Consent, Opt-out) */}
      {/* ================================================================ */}
      {activeTab === 'directory' && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-[#171936]">Fictional Parent Directory</h3>
              <p className="text-xs text-gray-500">Contact preferences, preferred language, and POPIA consent status</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search guardian or learner..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5145C5]/30"
                />
              </div>

              <select
                value={directoryClassFilter}
                onChange={(e) => setDirectoryClassFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs bg-white font-medium"
              >
                <option value="All">All Classes</option>
                <option value="9A">Grade 9A</option>
                <option value="9B">Grade 9B</option>
                <option value="10B">Grade 10B</option>
                <option value="11A">Grade 11A</option>
              </select>
            </div>
          </div>

          {/* Directory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8FC] text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th className="py-2.5 px-3">Guardian Name</th>
                  <th className="py-2.5 px-3">Learner & Class</th>
                  <th className="py-2.5 px-3">Contact Details</th>
                  <th className="py-2.5 px-3">Language</th>
                  <th className="py-2.5 px-3">POPIA Consent</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredParents.map((parent) => (
                  <tr key={parent.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#171936]">
                      {parent.guardianName}
                      <span className="block text-[10px] font-normal text-gray-500">
                        {parent.relationship}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-gray-800">{parent.learnerName}</span>
                      <span className="block text-[10px] text-gray-500">
                        Class {parent.learnerClass} • Gr {parent.learnerGrade}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Phone className="w-3 h-3 text-[#5145C5]" />
                        <span>{parent.phone}</span>
                      </div>
                      {parent.email && (
                        <div className="flex items-center gap-1.5 text-gray-500 text-[10px] mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{parent.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold text-[10px]">
                        {OFFICIAL_LANGUAGES.find((l) => l.code === parent.preferredLanguage)?.name || parent.preferredLanguage}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {parent.consentStatus === 'opted-in' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Opted In
                        </span>
                      ) : parent.consentStatus === 'opted-out' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold" title={parent.optOutReason}>
                          <ShieldAlert className="w-3 h-3" /> Opted Out
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {/* Consent toggle for demo testing */}
                      <button
                        onClick={() => {
                          const nextStatus =
                            parent.consentStatus === 'opted-in'
                              ? 'opted-out'
                              : 'opted-in';
                          onUpdateParentConsent(parent.id, nextStatus);
                          showToast('info', 'Consent Updated', `${parent.guardianName} marked as ${nextStatus}.`);
                        }}
                        className="text-[10px] font-semibold text-[#5145C5] hover:underline"
                      >
                        Toggle Consent
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 3: MESSAGE HISTORY LOG */}
      {/* ================================================================ */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className="text-base font-bold text-[#171936]">Simulated Message Dispatch Log</h3>
              <p className="text-xs text-gray-500">Audit trail of all sent and scheduled communications</p>
            </div>
            <span className="text-xs text-gray-500">Total Entries: {messageLogs.length}</span>
          </div>

          <div className="space-y-3">
            {messageLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl border border-gray-200 bg-[#F7F8FC] space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#171936]">{log.recipientTarget}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      {log.channel}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 font-bold uppercase">
                      {log.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500">{log.sentAt}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {log.status}
                    </span>
                  </div>
                </div>

                <div className="font-semibold text-gray-800">{log.subject}</div>
                <p className="text-gray-600 line-clamp-2 text-[11px]">{log.body}</p>

                {log.excludedOptOutCount > 0 && (
                  <div className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 pt-1">
                    <ShieldAlert className="w-3 h-3 text-amber-600" />
                    <span>Safeguard active: {log.excludedOptOutCount} opted-out contact(s) protected.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
