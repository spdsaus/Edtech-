import React, { useState } from 'react';
import {
  Sparkles,
  BookOpenCheck,
  Radio,
  Users,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToTab: (tab: any) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onJumpToTab,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to NexGen Teacher',
      tagline: 'Plan. Communicate. Manage.',
      icon: GraduationCap,
      description:
        'A purpose-built SaaS platform designed for South African educators working within the CAPS curriculum. Built for Ms. Nomvula Dlamini at Thandeka Secondary School.',
      features: [
        'Curriculum-aligned lesson planner with strict mathematical timing validation',
        'Teacher Command Centre supporting safe parent broadcasts across 5 official languages',
        'POPIA opt-out protection and quiet hours safeguards (18:00 to 06:30)',
        'Full offline / load-shedding resilience with local state persistence',
      ],
      actionTab: 'dashboard',
      actionLabel: 'Explore Dashboard',
    },
    {
      title: '1. CAPS Lesson Planner with Timing Validation',
      tagline: 'Every minute accounted for.',
      icon: BookOpenCheck,
      description:
        'Draft complete, professional lesson plans containing objectives, outcomes, prior-knowledge hooks, timed activities, Bloom\'s diagnostic checks, differentiation, and HOD print views.',
      features: [
        'Visual interactive timing breakdown (Hook + Activities + Wrap-up = 100% balanced)',
        'One-click Auto-Balance timing adjuster',
        'Transparent AI High-Thinking draft simulation with pedagogical reasoning steps',
        'Mandatory teacher review and professional sign-off badge',
      ],
      actionTab: 'planner',
      actionLabel: 'Try Lesson Planner',
    },
    {
      title: '2. Multilingual Teacher Command Centre',
      tagline: 'Safe parent communication across 5 official languages.',
      icon: Radio,
      description:
        'Bridge language barriers with real translations in English, isiZulu, isiXhosa, Afrikaans, and Sesotho. Strictly controlled 5-step safety workflow: Compose → Preview → Edit → Approve → Confirm simulated send.',
      features: [
        'Instant language previews tailored for South African schools',
        'POPIA Opt-Out Protection: Automatically excludes parents who declined communication',
        'Quiet hours enforcement banner preventing evening disturbances',
        'Zero external SMS/WhatsApp charges: 100% sandboxed local execution',
      ],
      actionTab: 'command',
      actionLabel: 'Open Command Centre',
    },
    {
      title: '3. My Classes & Smart Tasks Assistant',
      tagline: 'Streamlined cohort management & educator authority.',
      icon: Users,
      description:
        'Organize Grade 9A, 9B, 10B, and 11A cohorts. Import student rosters via the local CSV validator, and stay ahead of your day with morning briefs and period alerts.',
      features: [
        'CSV import with real-time parsing, syntax checks, and visual preview table',
        'Teacher-in-the-loop: The assistant suggests, the educator approves',
        'Between-lesson prompts (lab setup, slide preparation)',
        'Simulated offline load-shedding mode with pending sync tracking',
      ],
      actionTab: 'classes',
      actionLabel: 'View Classes & Learners',
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJump = () => {
    onJumpToTab(step.actionTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-gray-100 space-y-6 relative overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#5145C5] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Platform Guided Tour ({currentStep + 1} of {steps.length})</span>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Step */}
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5145C5] to-[#7162E8] text-white flex items-center justify-center shadow-md">
            <StepIcon className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[#171936] tracking-tight">
              {step.title}
            </h3>
            <p className="text-xs font-semibold text-[#5145C5] mt-0.5">{step.tagline}</p>
          </div>

          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
            {step.description}
          </p>

          {/* Highlights checklist */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {step.features.map((feat, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx ? 'w-6 bg-[#5145C5]' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleJump}
              className="px-3.5 py-2 rounded-xl border border-[#5145C5]/20 text-[#5145C5] font-bold text-xs hover:bg-[#F0EEFF] transition-colors"
            >
              {step.actionLabel}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-[#5145C5] text-white font-bold text-xs hover:bg-[#4337b0] transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
