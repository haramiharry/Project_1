const STEPS = [
  "Company Profile",
  "Pain Points",
  "Team Size",
  "Assumptions",
  "Results",
];

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 6l3 3 5-5"
        stroke="white"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface ProgressIndicatorProps {
  currentStep: number;
}

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const currentLabel = STEPS[currentStep - 1] ?? "";

  return (
    <nav aria-label="Form progress">
      {/* Step row */}
      <ol className="flex items-center">
        {STEPS.map((label, index) => {
          const step = index + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <li key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    isCompleted
                      ? "bg-blue-600 text-white"
                      : isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isCompleted ? <CheckIcon /> : step}
                </div>
                {/* Labels: desktop only */}
                <span
                  className={`mt-1.5 text-xs font-medium text-center hidden sm:block leading-tight max-w-[64px] ${
                    isCurrent
                      ? "text-blue-600"
                      : isCompleted
                      ? "text-slate-600"
                      : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-4 sm:mb-6 transition-colors ${
                    step < currentStep ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile-only: current step name below the bar */}
      <p className="mt-3 text-xs font-medium text-blue-600 sm:hidden">
        Step {currentStep} of {STEPS.length}: {currentLabel}
      </p>
    </nav>
  );
}
