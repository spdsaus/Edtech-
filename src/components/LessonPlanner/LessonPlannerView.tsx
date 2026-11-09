import React, { useState } from 'react';
import {
  BookOpenCheck,
  Plus,
  Sparkles,
  Printer,
  Copy,
  Trash2,
  Edit3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Save,
  X,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { LessonPlan, LessonActivity } from '../../types';
import {
  simulateHighThinkingGeneration,
  GenerationStep,
  balanceActivityTimes,
  autoBalanceActivities,
} from '../../services/aiLessonGenerator';
import { useToast } from '../../context/ToastContext';

interface LessonPlannerViewProps {
  lessonPlans: LessonPlan[];
  onSavePlan: (plan: LessonPlan) => void;
  onDeletePlan: (planId: string) => void;
  initialSelectedPlan?: LessonPlan | null;
}

export const LessonPlannerView: React.FC<LessonPlannerViewProps> = ({
  lessonPlans,
  onSavePlan,
  onDeletePlan,
  initialSelectedPlan,
}) => {
  const { showToast } = useToast();

  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(
    initialSelectedPlan || (lessonPlans.length > 0 ? lessonPlans[0] : null)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiThinkingSteps, setAiThinkingSteps] = useState<GenerationStep[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');

  // Generator & Editor Form State
  const [formData, setFormData] = useState<Partial<LessonPlan>>({
    title: 'Photosynthesis & Rate Factors',
    grade: '9',
    subject: 'Natural Sciences',
    capsStrand: 'Life and Living (Strand 1)',
    term: 2,
    week: 4,
    date: new Date().toISOString().split('T')[0],
    periodDuration: 45,
    assignedClass: '9A',
    textbookReference: 'Spot On Natural Sciences Gr 9, pp. 84-89',
    isAiGenerated: true,
    reviewedByTeacher: false,
    status: 'Draft',
    objectives: [
      'Explain radiant energy capture by chlorophyll.',
      'Balance chemical word equation for photosynthesis.',
    ],
    capsOutcomes: [
      'CAPS Senior Phase Natural Sciences Section 3.2.',
      'Conduct starch leaf iodine test demonstration.',
    ],
    introductionHook: {
      durationMinutes: 7,
      description: 'Display an aquatic Elodea sprig under an incandescent lamp in sodium bicarbonate solution.',
    },
    activities: [
      {
        id: 'act-new-1',
        title: 'Direct Teaching: Chloroplast Anatomy',
        durationMinutes: 15,
        teacherRole: 'Explain thylakoids and chlorophyll light absorption.',
        learnerRole: 'Sketch and label chloroplast in exercise books.',
        activityType: 'Direct Instruction',
      },
      {
        id: 'act-new-2',
        title: 'Guided Pair Investigation: Light Distance Graphing',
        durationMinutes: 15,
        teacherRole: 'Supervise data graphing and rate analysis.',
        learnerRole: 'Plot distance vs bubble rate in pairs.',
        activityType: 'Group Work',
      },
    ],
    diagnosticQuestions: [
      {
        bloomLevel: 'Remembering / Understanding',
        question: 'What are the two raw materials required for photosynthesis?',
        expectedAnswer: 'Carbon dioxide and water.',
      },
      {
        bloomLevel: 'Applying / Analyzing',
        question: 'Why do leaves boiled in ethanol decolorize?',
        expectedAnswer: 'Ethanol dissolves green chlorophyll pigment so iodine test color change is visible.',
      },
    ],
    differentiation: {
      enrichment: 'Formulate an experiment using a potometer.',
      scaffolding: 'Provide pre-printed graphic equations for writing support.',
    },
    assessmentMethod: 'Formative observation during graphing activity + exit slip.',
    resourcesNeeded: [
      'Spot On Natural Sciences Gr 9 textbook',
      'Elodea sprig, beaker, lamp, sodium bicarbonate',
      'A4 Graph sheets',
    ],
    conclusionSummary: {
      durationMinutes: 8,
      description: 'Choral recap of the photosynthesis equation. Plants respire 24/7.',
      homeworkTask: 'Answer Exercise 4.2 questions 1-5 on page 89.',
    },
  });

  // Calculate timing balance
  const activePeriodDuration = formData.periodDuration || 45;
  const activeHookMinutes = formData.introductionHook?.durationMinutes || 7;
  const activeConclusionMinutes = formData.conclusionSummary?.durationMinutes || 8;
  const activeActivities = formData.activities || [];

  const timingBalance = balanceActivityTimes(
    activePeriodDuration,
    activeHookMinutes,
    activeConclusionMinutes,
    activeActivities
  );

  const filteredPlans = lessonPlans.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.capsStrand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = filterGrade === 'All' || p.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const handleStartCreate = () => {
    setFormData({
      title: 'Chemical Reactions & Energy',
      grade: '9',
      subject: 'Natural Sciences',
      capsStrand: 'Matter and Materials',
      term: 2,
      week: 5,
      date: new Date().toISOString().split('T')[0],
      periodDuration: 45,
      assignedClass: '9A',
      textbookReference: 'Spot On Natural Sciences Gr 9, pp. 92-96',
      isAiGenerated: true,
      reviewedByTeacher: false,
      status: 'Draft',
      objectives: ['Identify exothermic vs endothermic reactions in test tubes.'],
      capsOutcomes: ['CAPS Matter & Materials Section 2.1.'],
      introductionHook: {
        durationMinutes: 7,
        description: 'Drop zinc granule into dilute hydrochloric acid; measure temperature rise with lab thermometer.',
      },
      activities: [
        {
          id: 'act-init-1',
          title: 'Direct Explanation: Chemical Bonds & Energy Release',
          durationMinutes: 15,
          teacherRole: 'Define bond-breaking and bond-forming energies.',
          learnerRole: 'Record definitions and sketch energy level diagram.',
          activityType: 'Direct Instruction',
        },
        {
          id: 'act-init-2',
          title: 'Hands-on Temperature Measurement Experiment',
          durationMinutes: 15,
          teacherRole: 'Distribute thermometers and baking soda / citric acid solution.',
          learnerRole: 'Record initial vs final temp in groups of 3.',
          activityType: 'Practical / Experiment',
        },
      ],
      diagnosticQuestions: [
        {
          bloomLevel: 'Remembering / Understanding',
          question: 'Define an exothermic reaction.',
          expectedAnswer: 'A reaction that releases thermal energy to its surroundings.',
        },
      ],
      differentiation: {
        enrichment: 'Calculate temperature differential delta-T.',
        scaffolding: 'Provide step-by-step thermometer reading guide.',
      },
      assessmentMethod: 'Lab checklist and summary table review.',
      resourcesNeeded: ['Citric acid, baking soda, water, thermometers, beakers'],
      conclusionSummary: {
        durationMinutes: 8,
        description: 'Recap difference between hot and cold reactions.',
        homeworkTask: 'Summarize 2 domestic examples of exothermic reactions.',
      },
    });
    setIsCreatingNew(true);
    setIsEditing(true);
  };

  const handleEditCurrent = (plan: LessonPlan) => {
    setFormData({ ...plan });
    setSelectedPlan(plan);
    setIsEditing(true);
    setIsCreatingNew(false);
  };

  const handleTriggerAiGenerate = async () => {
    setIsGeneratingAi(true);
    setAiThinkingSteps([]);

    try {
      const generated = await simulateHighThinkingGeneration(
        {
          grade: formData.grade || '9',
          subject: formData.subject || 'Natural Sciences',
          strand: formData.capsStrand || 'Life and Living',
          term: formData.term || 2,
          topic: formData.title || 'Photosynthesis',
          periodDuration: formData.periodDuration || 45,
          assignedClass: formData.assignedClass || '9A',
          textbookReference: formData.textbookReference || '',
        },
        (steps) => {
          setAiThinkingSteps(steps);
        }
      );

      setFormData(generated);
      showToast('success', 'AI Lesson Draft Synthesized', 'Timing mathematically balanced. Please review and sign off.');
    } catch (err) {
      showToast('error', 'Generation Error', 'Failed to generate lesson draft.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleAutoBalance = () => {
    if (!formData.activities) return;
    const balancedActivities = autoBalanceActivities(
      activePeriodDuration,
      activeHookMinutes,
      activeConclusionMinutes,
      formData.activities
    );
    setFormData((prev) => ({ ...prev, activities: balancedActivities }));
    showToast('info', 'Timing Auto-Balanced', 'Activity durations adjusted to equal exactly ' + activePeriodDuration + ' min.');
  };

  const handleSaveForm = () => {
    if (!timingBalance.isValid) {
      showToast(
        'warning',
        'Timing Mismatch Detected',
        `Current total is ${timingBalance.currentTotal}m (needs exactly ${activePeriodDuration}m). Auto-balancing now.`
      );
      handleAutoBalance();
      return;
    }

    const planToSave: LessonPlan = {
      id: formData.id || `lp-${Date.now()}`,
      title: formData.title || 'Untitled Lesson',
      grade: formData.grade || '9',
      subject: formData.subject || 'Natural Sciences',
      capsStrand: formData.capsStrand || 'General',
      term: formData.term || 2,
      week: formData.week || 4,
      date: formData.date || new Date().toISOString().split('T')[0],
      periodDuration: formData.periodDuration || 45,
      assignedClass: formData.assignedClass || '9A',
      textbookReference: formData.textbookReference || '',
      isAiGenerated: formData.isAiGenerated ?? true,
      reviewedByTeacher: formData.reviewedByTeacher ?? true,
      status: (formData.status as any) || 'Approved',
      objectives: formData.objectives || [],
      capsOutcomes: formData.capsOutcomes || [],
      introductionHook: formData.introductionHook || { durationMinutes: 7, description: '' },
      activities: formData.activities || [],
      diagnosticQuestions: formData.diagnosticQuestions || [],
      differentiation: formData.differentiation || { enrichment: '', scaffolding: '' },
      assessmentMethod: formData.assessmentMethod || 'Formative observation',
      resourcesNeeded: formData.resourcesNeeded || [],
      conclusionSummary: formData.conclusionSummary || { durationMinutes: 8, description: '', homeworkTask: '' },
      teacherReflectionNotes: formData.teacherReflectionNotes,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSavePlan(planToSave);
    setSelectedPlan(planToSave);
    setIsEditing(false);
    setIsCreatingNew(false);
    showToast('success', 'Lesson Plan Saved', `"${planToSave.title}" has been saved to your CAPS lesson repository.`);
  };

  const handleDuplicate = (plan: LessonPlan) => {
    const duplicated: LessonPlan = {
      ...plan,
      id: `lp-${Date.now()}`,
      title: `${plan.title} (Copy)`,
      assignedClass: plan.assignedClass === '9A' ? '9B' : plan.assignedClass,
      reviewedByTeacher: false,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSavePlan(duplicated);
    setSelectedPlan(duplicated);
    showToast('info', 'Lesson Duplicated', `Created a copy for ${duplicated.assignedClass}.`);
  };

  const handleDelete = (planId: string) => {
    if (confirm('Are you sure you want to delete this CAPS lesson plan?')) {
      onDeletePlan(planId);
      if (selectedPlan?.id === planId) {
        const remaining = lessonPlans.filter((p) => p.id !== planId);
        setSelectedPlan(remaining.length > 0 ? remaining[0] : null);
      }
      showToast('info', 'Lesson Deleted', 'Lesson removed from repository.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Activity list mutators
  const handleAddActivity = () => {
    const newAct: LessonActivity = {
      id: `act-${Date.now()}`,
      title: 'Collaborative Group Task',
      durationMinutes: 10,
      teacherRole: 'Facilitate peer discussion.',
      learnerRole: 'Work on assigned question set.',
      activityType: 'Group Work',
    };
    setFormData((prev) => ({
      ...prev,
      activities: [...(prev.activities || []), newAct],
    }));
  };

  const handleRemoveActivity = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities?.filter((_, i) => i !== idx),
    }));
  };

  const handleActivityChange = (idx: number, field: keyof LessonActivity, val: any) => {
    setFormData((prev) => {
      const updated = [...(prev.activities || [])];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, activities: updated };
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-[#171936] tracking-tight">
            CAPS Lesson Planning & Verification
          </h2>
          <p className="text-xs text-gray-500">
            Curriculum and Assessment Policy Statement (CAPS) • Term 2 Pacing Standard
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5145C5] text-white text-xs font-bold hover:bg-[#4337b0] transition-colors shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>

          {selectedPlan && !isEditing && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#171936] hover:bg-gray-50 text-xs font-semibold transition-colors shadow-xs"
              title="Print official CAPS format for HOD file"
            >
              <Printer className="w-4 h-4 text-[#5145C5]" />
              <span>Print HOD Copy</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split Layout: Lesson Repository List (Left) + Detailed View / Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Repository & Filter */}
        <div className="lg:col-span-4 space-y-4 no-print">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Saved Repository ({lessonPlans.length})
              </span>
              <span className="text-[11px] text-[#5145C5] font-semibold">
                Thandeka Secondary
              </span>
            </div>

            {/* Search and Grade Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search topic, strand, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5145C5]/30 focus:border-[#5145C5]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {['All', '9', '10', '11'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setFilterGrade(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                      filterGrade === g
                        ? 'bg-[#171936] text-white font-bold'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {g === 'All' ? 'All Grades' : `Grade ${g}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Plans List */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredPlans.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400 border border-dashed rounded-xl">
                  No lesson plans matching criteria.
                </div>
              ) : (
                filteredPlans.map((plan) => {
                  const isSelected = selectedPlan?.id === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setIsEditing(false);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#F0EEFF] border-[#5145C5] shadow-xs ring-1 ring-[#5145C5]/20'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                          Gr {plan.grade} • {plan.assignedClass}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {plan.periodDuration} min
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#171936] line-clamp-1">{plan.title}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        {plan.capsStrand}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-500">
                        <span>Term {plan.term} • Wk {plan.week}</span>
                        {plan.reviewedByTeacher ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Approved
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            Needs Review
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Active Lesson View or Interactive Form */}
        <div className="lg:col-span-8">
          {isEditing ? (
            /* =================== LESSON EDITOR / GENERATOR FORM =================== */
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
              {/* Form Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#F0EEFF] text-[#5145C5]">
                      {isCreatingNew ? 'Create New Lesson' : 'Edit Lesson Plan'}
                    </span>
                    <span className="text-xs text-gray-400">• CAPS Format</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#171936] mt-1">
                    {formData.title || 'Untitled Lesson'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTriggerAiGenerate}
                    disabled={isGeneratingAi}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#5145C5] to-[#7162E8] text-white text-xs font-bold hover:opacity-95 transition-all shadow-sm disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isGeneratingAi ? 'Synthesizing...' : 'Simulate AI Draft'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveForm}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Plan</span>
                  </button>
                </div>
              </div>

              {/* AI Thinking Stream (Visible when generating) */}
              {isGeneratingAi && (
                <div className="p-4 rounded-xl bg-[#171936] text-white space-y-2 border border-[#2B3060]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                      <span>High-Thinking Engine: Analyzing CAPS Curriculum</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Step {aiThinkingSteps.length} of 5</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px] text-[#C5C8E5]">
                    {aiThinkingSteps.map((step) => (
                      <div key={step.id} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                        <div className="truncate">
                          <strong className="text-white">{step.label}:</strong> {step.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TIMING VALIDATION WIDGET (Mandatory Requirement) */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  timingBalance.isValid
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50/90 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                      {timingBalance.isValid ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-800">
                            Timing Validated: Exactly {activePeriodDuration} Minutes Balanced
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span className="text-amber-800">
                            Timing Discrepancy: {timingBalance.currentTotal}m recorded ({Math.abs(timingBalance.difference)}m{' '}
                            {timingBalance.difference > 0 ? 'short' : 'over'})
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-xs mt-1 text-gray-600">
                      Introduction ({activeHookMinutes}m) + Activities ({timingBalance.activitiesTotal}m) + Conclusion (
                      {activeConclusionMinutes}m) ={' '}
                      <strong>{timingBalance.currentTotal}m of {activePeriodDuration}m</strong>
                    </div>
                  </div>

                  {!timingBalance.isValid && (
                    <button
                      type="button"
                      onClick={handleAutoBalance}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0"
                    >
                      Auto-Balance Durations
                    </button>
                  )}
                </div>

                {/* Visual Segmented Progress Bar */}
                <div className="w-full h-3 rounded-full bg-gray-200 mt-3 overflow-hidden flex">
                  <div
                    style={{ width: `${(activeHookMinutes / activePeriodDuration) * 100}%` }}
                    className="bg-amber-400 h-full"
                    title={`Introduction: ${activeHookMinutes}m`}
                  />
                  {activeActivities.map((act, i) => (
                    <div
                      key={act.id}
                      style={{ width: `${(act.durationMinutes / activePeriodDuration) * 100}%` }}
                      className={`h-full ${
                        i % 2 === 0 ? 'bg-[#5145C5]' : 'bg-[#7162E8]'
                      }`}
                      title={`${act.title}: ${act.durationMinutes}m`}
                    />
                  ))}
                  <div
                    style={{ width: `${(activeConclusionMinutes / activePeriodDuration) * 100}%` }}
                    className="bg-teal-500 h-full"
                    title={`Conclusion: ${activeConclusionMinutes}m`}
                  />
                </div>
              </div>

              {/* Lesson Metadata Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Lesson Topic</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5145C5]/30 focus:border-[#5145C5]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Subject</label>
                  <select
                    value={formData.subject || 'Natural Sciences'}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5145C5]/30 focus:border-[#5145C5] bg-white"
                  >
                    <option value="Natural Sciences">Natural Sciences</option>
                    <option value="Life Sciences">Life Sciences</option>
                    <option value="Physical Sciences">Physical Sciences</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English First Additional Language">English FAL</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Grade & Class</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={formData.grade || '9'}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl border border-gray-200 bg-white"
                    >
                      <option value="8">Grade 8</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                      <option value="11">Grade 11</option>
                      <option value="12">Grade 12</option>
                    </select>

                    <select
                      value={formData.assignedClass || '9A'}
                      onChange={(e) => setFormData({ ...formData, assignedClass: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl border border-gray-200 bg-white"
                    >
                      <option value="9A">9A</option>
                      <option value="9B">9B</option>
                      <option value="10B">10B</option>
                      <option value="11A">11A</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">CAPS Strand / Focus</label>
                  <input
                    type="text"
                    value={formData.capsStrand || ''}
                    onChange={(e) => setFormData({ ...formData, capsStrand: e.target.value })}
                    placeholder="e.g. Life and Living (Strand 1)"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Period Duration (Minutes)</label>
                  <select
                    value={formData.periodDuration || 45}
                    onChange={(e) => setFormData({ ...formData, periodDuration: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-bold text-[#5145C5]"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes (Standard)</option>
                    <option value={60}>60 Minutes (Lab Session)</option>
                    <option value={90}>90 Minutes (Double Period)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Textbook Reference</label>
                  <input
                    type="text"
                    value={formData.textbookReference || ''}
                    onChange={(e) => setFormData({ ...formData, textbookReference: e.target.value })}
                    placeholder="e.g. Spot On Natural Sciences, pp. 84-89"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              {/* Introduction Hook */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800">1. Introduction Hook & Prior Knowledge</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">Duration:</span>
                    <input
                      type="number"
                      min={2}
                      max={20}
                      value={formData.introductionHook?.durationMinutes || 7}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          introductionHook: {
                            description: formData.introductionHook?.description || '',
                            durationMinutes: Number(e.target.value),
                          },
                        })
                      }
                      className="w-16 px-2 py-1 rounded-lg border text-center font-bold"
                    />
                    <span>min</span>
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={formData.introductionHook?.description || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      introductionHook: {
                        durationMinutes: formData.introductionHook?.durationMinutes || 7,
                        description: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              {/* Timed Activities List */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-1 border-b">
                  <label className="font-bold text-gray-800">2. Timed Activities ({activeActivities.length})</label>
                  <button
                    type="button"
                    onClick={handleAddActivity}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0EEFF] text-[#5145C5] text-xs font-bold hover:bg-[#E2E0FF]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Activity</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {activeActivities.map((act, index) => (
                    <div key={act.id} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-5 h-5 rounded-full bg-[#171936] text-white text-[10px] font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={act.title}
                            onChange={(e) => handleActivityChange(index, 'title', e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-lg border border-gray-200 bg-white font-semibold text-xs"
                            placeholder="Activity Title"
                          />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <input
                            type="number"
                            min={2}
                            max={60}
                            value={act.durationMinutes}
                            onChange={(e) => handleActivityChange(index, 'durationMinutes', Number(e.target.value))}
                            className="w-16 px-2 py-1 rounded-lg border text-center font-bold bg-white text-xs"
                          />
                          <span className="text-gray-500 text-xs">min</span>

                          <button
                            type="button"
                            onClick={() => handleRemoveActivity(index)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Remove activity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-gray-500 block mb-0.5">Teacher Role:</span>
                          <input
                            type="text"
                            value={act.teacherRole}
                            onChange={(e) => handleActivityChange(index, 'teacherRole', e.target.value)}
                            className="w-full px-2 py-1 rounded-lg border bg-white"
                          />
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-0.5">Learner Role:</span>
                          <input
                            type="text"
                            value={act.learnerRole}
                            onChange={(e) => handleActivityChange(index, 'learnerRole', e.target.value)}
                            className="w-full px-2 py-1 rounded-lg border bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conclusion & Wrap-up */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800">3. Conclusion, Homework & Synthesis</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">Duration:</span>
                    <input
                      type="number"
                      min={2}
                      max={20}
                      value={formData.conclusionSummary?.durationMinutes || 8}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          conclusionSummary: {
                            description: formData.conclusionSummary?.description || '',
                            durationMinutes: Number(e.target.value),
                            homeworkTask: formData.conclusionSummary?.homeworkTask || '',
                          },
                        })
                      }
                      className="w-16 px-2 py-1 rounded-lg border text-center font-bold"
                    />
                    <span>min</span>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Homework task..."
                  value={formData.conclusionSummary?.homeworkTask || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      conclusionSummary: {
                        description: formData.conclusionSummary?.description || '',
                        durationMinutes: formData.conclusionSummary?.durationMinutes || 8,
                        homeworkTask: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              {/* Teacher Sign-off checkbox */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.reviewedByTeacher}
                    onChange={(e) => setFormData({ ...formData, reviewedByTeacher: e.target.checked })}
                    className="w-4 h-4 rounded text-[#5145C5] focus:ring-[#5145C5]"
                  />
                  <span>Mark as "Teacher Reviewed & Approved for CAPS delivery"</span>
                </label>
                <span className="text-[11px] text-gray-500">Sign-off: Ms. N. Dlamini</span>
              </div>
            </div>
          ) : selectedPlan ? (
            /* =================== DETAILED LESSON DISPLAY / PRINT VIEW =================== */
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-6 printable-card">
              {/* Review Requirement Banner (Strict Requirement) */}
              {!selectedPlan.reviewedByTeacher ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 no-print">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <strong className="font-bold block">Draft: Requires Teacher Review & Professional Sign-off</strong>
                    <span>
                      This lesson plan contains AI-assisted draft scaffolding. As per South African CAPS pedagogical guidelines, the educator must review content, apparatus safety, and timing before delivery.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const updated = { ...selectedPlan, reviewedByTeacher: true, status: 'Approved' as const };
                      onSavePlan(updated);
                      setSelectedPlan(updated);
                      showToast('success', 'Sign-Off Recorded', 'Lesson marked as reviewed by Ms. Dlamini.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0"
                  >
                    Sign Off Now
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs no-print">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Teacher Reviewed & Approved by Ms. N. Dlamini for CAPS Compliance</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    Official Teaching Document
                  </span>
                </div>
              )}

              {/* Lesson Document Header */}
              <div className="border-b pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5145C5]">
                      {selectedPlan.subject} • CAPS Curriculum
                    </span>
                    <h2 className="text-2xl font-bold text-[#171936] mt-0.5">
                      {selectedPlan.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 no-print">
                    <button
                      onClick={() => handleEditCurrent(selectedPlan)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:text-[#5145C5] text-xs font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDuplicate(selectedPlan)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:text-indigo-600 text-xs font-medium hover:bg-gray-50 transition-colors"
                      title="Duplicate for another class"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplicate</span>
                    </button>

                    <button
                      onClick={() => handleDelete(selectedPlan.id)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete lesson plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Lesson Context Metadata Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 p-3 bg-gray-50 rounded-xl text-xs">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Grade & Class</span>
                    <span className="font-bold text-[#171936]">
                      Grade {selectedPlan.grade} ({selectedPlan.assignedClass})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Term & Week</span>
                    <span className="font-bold text-[#171936]">
                      Term {selectedPlan.term} • Week {selectedPlan.week}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Period Duration</span>
                    <span className="font-bold text-[#5145C5] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedPlan.periodDuration} Minutes
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Textbook Reference</span>
                    <span className="font-semibold text-gray-800 truncate block">
                      {selectedPlan.textbookReference || 'Standard DBE Workbook'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Objectives & CAPS Outcomes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-200/80 bg-[#F7F8FC]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#171936] mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5145C5]" />
                    Specific Lesson Objectives
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {selectedPlan.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#5145C5] font-bold">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-gray-200/80 bg-[#F7F8FC]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#171936] mb-2 flex items-center gap-1.5">
                    <BookOpenCheck className="w-4 h-4 text-violet-600" />
                    CAPS Curriculum Outcomes
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {selectedPlan.capsOutcomes.map((out, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-violet-600 font-bold">•</span>
                        <span>{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Timing Breakdown Bar */}
              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Lesson Period Timeline ({selectedPlan.periodDuration} min total)</span>
                  <span className="text-emerald-700 font-semibold">100% Timing Balanced</span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden flex">
                  <div
                    style={{ width: `${(selectedPlan.introductionHook.durationMinutes / selectedPlan.periodDuration) * 100}%` }}
                    className="bg-amber-400 h-full"
                    title={`Hook: ${selectedPlan.introductionHook.durationMinutes}m`}
                  />
                  {selectedPlan.activities.map((act, i) => (
                    <div
                      key={act.id}
                      style={{ width: `${(act.durationMinutes / selectedPlan.periodDuration) * 100}%` }}
                      className={`h-full ${i % 2 === 0 ? 'bg-[#5145C5]' : 'bg-[#7162E8]'}`}
                      title={`${act.title}: ${act.durationMinutes}m`}
                    />
                  ))}
                  <div
                    style={{ width: `${(selectedPlan.conclusionSummary.durationMinutes / selectedPlan.periodDuration) * 100}%` }}
                    className="bg-teal-500 h-full"
                    title={`Conclusion: ${selectedPlan.conclusionSummary.durationMinutes}m`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                  <span>Hook: {selectedPlan.introductionHook.durationMinutes}m</span>
                  <span>Activities: {selectedPlan.activities.reduce((s, a) => s + a.durationMinutes, 0)}m</span>
                  <span>Wrap-up: {selectedPlan.conclusionSummary.durationMinutes}m</span>
                </div>
              </div>

              {/* Phase 1: Introduction Hook */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#171936] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    Introduction & Prior Knowledge Hook
                  </h4>
                  <span className="text-xs font-bold text-gray-500">
                    {selectedPlan.introductionHook.durationMinutes} Minutes
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed p-3 bg-amber-50/40 rounded-xl border border-amber-200/50">
                  {selectedPlan.introductionHook.description}
                </p>
              </div>

              {/* Phase 2: Timed Activities */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[#171936] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#5145C5] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  Timed Instructional Activities ({selectedPlan.activities.length})
                </h4>

                <div className="space-y-3">
                  {selectedPlan.activities.map((act, index) => (
                    <div
                      key={act.id}
                      className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-400">Activity 2.{index + 1}</span>
                          <h5 className="text-xs font-bold text-[#171936]">{act.title}</h5>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                            {act.activityType}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#5145C5] bg-[#F0EEFF] px-2 py-0.5 rounded-md">
                          {act.durationMinutes} min
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="p-2.5 bg-gray-50 rounded-lg">
                          <strong className="text-gray-700 block text-[11px] mb-0.5">Educator Role:</strong>
                          <span className="text-gray-600">{act.teacherRole}</span>
                        </div>
                        <div className="p-2.5 bg-[#F0EEFF]/50 rounded-lg">
                          <strong className="text-[#5145C5] block text-[11px] mb-0.5">Learner Role:</strong>
                          <span className="text-gray-600">{act.learnerRole}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloom's Diagnostic Questions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Diagnostic Bloom's Taxonomy Questions
                </h4>
                <div className="space-y-2 text-xs">
                  {selectedPlan.diagnosticQuestions.map((q, i) => (
                    <div key={i} className="p-3 rounded-xl border border-gray-200 bg-gray-50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#5145C5] text-[11px]">{q.bloomLevel}</span>
                        <span className="text-[10px] text-gray-400">Question {i + 1}</span>
                      </div>
                      <p className="font-semibold text-gray-800">{q.question}</p>
                      <p className="text-gray-600 text-[11px]">
                        <strong>Target Key:</strong> {q.expectedAnswer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differentiation & Resources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-2">
                  <h5 className="font-bold text-[#171936]">Differentiation Matrix</h5>
                  <div className="space-y-1.5">
                    <div>
                      <strong className="text-emerald-700 text-[11px] block">Enrichment (Fast Finishers):</strong>
                      <span className="text-gray-600">{selectedPlan.differentiation.enrichment}</span>
                    </div>
                    <div>
                      <strong className="text-indigo-700 text-[11px] block">Scaffolding (Language / Remedial):</strong>
                      <span className="text-gray-600">{selectedPlan.differentiation.scaffolding}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-2">
                  <h5 className="font-bold text-[#171936]">Resources & Apparatus Required</h5>
                  <ul className="space-y-1 text-gray-600">
                    {selectedPlan.resourcesNeeded.map((res, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-gray-400">•</span>
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Phase 3: Conclusion & Homework */}
              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-teal-950">
                  <span>3. Plenary Synthesis & Homework</span>
                  <span>{selectedPlan.conclusionSummary.durationMinutes} Minutes</span>
                </div>
                <p className="text-gray-700">{selectedPlan.conclusionSummary.description}</p>
                <div className="pt-2 border-t border-teal-200 text-teal-900 font-semibold">
                  <strong>Assigned Homework:</strong> {selectedPlan.conclusionSummary.homeworkTask}
                </div>
              </div>

              {/* Teacher Reflection Notes */}
              {selectedPlan.teacherReflectionNotes && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
                  <strong className="text-gray-800">Educator Post-Lesson Reflection:</strong>{' '}
                  {selectedPlan.teacherReflectionNotes}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center space-y-3">
              <BookOpenCheck className="w-12 h-12 text-[#5145C5] mx-auto opacity-40" />
              <h3 className="text-base font-bold text-[#171936]">No Lesson Plan Selected</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Select an existing lesson from your repository on the left, or create a new CAPS-aligned draft now.
              </p>
              <button
                onClick={handleStartCreate}
                className="px-4 py-2 rounded-xl bg-[#5145C5] text-white text-xs font-bold hover:bg-[#4337b0] transition-colors"
              >
                Create New Lesson
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
