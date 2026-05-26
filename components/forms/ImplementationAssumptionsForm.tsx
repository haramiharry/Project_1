"use client";

import { useState } from "react";
import { ImplementationAssumptions, LicenseCostBand } from "@/types";
import {
  DEFAULT_IMPLEMENTATION_TIMELINE_MONTHS,
  DEFAULT_CHANGE_MANAGEMENT_OVERHEAD_PERCENT,
  DEFAULT_LICENSE_COST_BAND,
} from "@/constants/assumptions";

const LICENSE_BAND_OPTIONS: { value: LicenseCostBand; label: string }[] = [
  { value: "50k_to_150k", label: "$50K to $150K" },
  { value: "150k_to_300k", label: "$150K to $300K" },
  { value: "300k_to_500k", label: "$300K to $500K" },
  { value: "above_500k", label: "$500K and above" },
];

const DEFAULTS: ImplementationAssumptions = {
  implementationTimelineMonths: DEFAULT_IMPLEMENTATION_TIMELINE_MONTHS,
  licenseCostBand: DEFAULT_LICENSE_COST_BAND,
  changeManagementOverheadPercent: DEFAULT_CHANGE_MANAGEMENT_OVERHEAD_PERCENT,
};

type FormState = {
  implementationTimelineMonths: string;
  licenseCostBand: LicenseCostBand;
  changeManagementOverheadPercent: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function toFormState(a: ImplementationAssumptions): FormState {
  return {
    implementationTimelineMonths: String(a.implementationTimelineMonths),
    licenseCostBand: a.licenseCostBand,
    changeManagementOverheadPercent: String(a.changeManagementOverheadPercent),
  };
}

function validate(state: FormState): FieldErrors {
  const errors: FieldErrors = {};

  const timeline = parseInt(state.implementationTimelineMonths, 10);
  if (state.implementationTimelineMonths === "" || isNaN(timeline) || timeline < 1) {
    errors.implementationTimelineMonths = "Enter a value between 1 and 36 months.";
  } else if (timeline > 36) {
    errors.implementationTimelineMonths = "Timeline cannot exceed 36 months.";
  }

  const overhead = parseFloat(state.changeManagementOverheadPercent);
  if (
    state.changeManagementOverheadPercent === "" ||
    isNaN(overhead) ||
    overhead < 0
  ) {
    errors.changeManagementOverheadPercent = "Enter 0 or a positive percentage.";
  } else if (overhead > 50) {
    errors.changeManagementOverheadPercent = "Overhead cannot exceed 50%.";
  }

  return errors;
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="#94a3b8" strokeWidth="1.5" />
      <path
        d="M5 7V5a3 3 0 016 0v2"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface ImplementationAssumptionsFormProps {
  onComplete: (data: ImplementationAssumptions) => void;
  onBack: () => void;
}

export default function ImplementationAssumptionsForm({
  onComplete,
  onBack,
}: ImplementationAssumptionsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormState>(toFormState(DEFAULTS));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    const next = { ...form, [key]: value };
    setForm(next);
    if (attempted) {
      setErrors(validate(next));
    }
  }

  function handleReset() {
    setForm(toFormState(DEFAULTS));
    setErrors({});
    setAttempted(false);
    // Stays in edit mode — does not auto-lock.
  }

  function handleContinue() {
    if (!isEditing) {
      onComplete(DEFAULTS);
      return;
    }

    setAttempted(true);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onComplete({
      implementationTimelineMonths: parseInt(form.implementationTimelineMonths, 10),
      licenseCostBand: form.licenseCostBand,
      changeManagementOverheadPercent: parseFloat(form.changeManagementOverheadPercent),
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Section header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-800">
              Implementation Assumptions
            </h2>
            {!isEditing && <LockIcon />}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Pre-filled with mid-market apparel ERP norms.
          </p>
        </div>

        {isEditing ? (
          <button
            type="button"
            onClick={handleReset}
            className="mt-1 shrink-0 text-xs text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors"
          >
            Reset to defaults
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="mt-1 shrink-0 text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2 transition-colors"
          >
            Edit assumptions
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Implementation Timeline */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-1">
            Implementation Timeline
          </p>
          {isEditing ? (
            <>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="36"
                  step="1"
                  value={form.implementationTimelineMonths}
                  onChange={(e) =>
                    updateField("implementationTimelineMonths", e.target.value)
                  }
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.implementationTimelineMonths
                      ? "border-red-400"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                />
                <span className="text-sm text-slate-500 whitespace-nowrap">months</span>
              </div>
              {errors.implementationTimelineMonths && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.implementationTimelineMonths}
                </p>
              )}
            </>
          ) : (
            <div className="px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-sm text-slate-700">
                {form.implementationTimelineMonths} months
              </span>
            </div>
          )}
        </div>

        {/* License Cost Band */}
        <div>
          <label
            htmlFor="licenseBand"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            License Cost Band
          </label>
          <select
            id="licenseBand"
            value={form.licenseCostBand}
            disabled={!isEditing}
            onChange={(e) =>
              updateField("licenseCostBand", e.target.value as LicenseCostBand)
            }
            className={`w-full px-3 py-2.5 rounded-lg border text-sm appearance-none focus:outline-none transition-colors ${
              isEditing
                ? "text-slate-800 bg-white border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                : "text-slate-700 bg-slate-50 border-slate-200 cursor-default disabled:opacity-100"
            }`}
          >
            {LICENSE_BAND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Change Management Overhead */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-1">
            Change Management Overhead
          </p>
          <p className="text-xs text-slate-400 mb-2">
            Additional cost as a percentage of the license cost midpoint: training,
            change management consulting, and internal project time.
          </p>
          {isEditing ? (
            <>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={form.changeManagementOverheadPercent}
                  onChange={(e) =>
                    updateField("changeManagementOverheadPercent", e.target.value)
                  }
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.changeManagementOverheadPercent
                      ? "border-red-400"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                />
                <span className="text-sm text-slate-500 whitespace-nowrap">
                  % of license cost
                </span>
              </div>
              {errors.changeManagementOverheadPercent && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.changeManagementOverheadPercent}
                </p>
              )}
            </>
          ) : (
            <div className="px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-sm text-slate-700">
                {form.changeManagementOverheadPercent}% of license cost
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Explainer — visible in both states */}
      <p className="mt-5 text-xs text-slate-400">
        These defaults reflect mid-market apparel ERP norms. Edit only if you have vendor-specific figures.
      </p>

      {/* Navigation */}
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 px-6 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="flex-1 py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
