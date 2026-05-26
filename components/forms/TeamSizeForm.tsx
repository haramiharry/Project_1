"use client";

import { useState } from "react";
import { TeamSize } from "@/types";

type FormState = {
  planningHeadcount: string;
  productionHeadcount: string;
  financeHeadcount: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(state: FormState): FieldErrors {
  const errors: FieldErrors = {};

  const planning = parseInt(state.planningHeadcount, 10);
  if (state.planningHeadcount === "" || isNaN(planning) || planning < 1) {
    errors.planningHeadcount = "Enter at least 1.";
  } else if (planning > 10000) {
    errors.planningHeadcount = "Value cannot exceed 10,000.";
  }

  const production = parseInt(state.productionHeadcount, 10);
  if (state.productionHeadcount === "" || isNaN(production) || production < 1) {
    errors.productionHeadcount = "Enter at least 1.";
  } else if (production > 10000) {
    errors.productionHeadcount = "Value cannot exceed 10,000.";
  }

  const finance = parseInt(state.financeHeadcount, 10);
  if (state.financeHeadcount === "" || isNaN(finance) || finance < 1) {
    errors.financeHeadcount = "Enter at least 1.";
  } else if (finance > 10000) {
    errors.financeHeadcount = "Value cannot exceed 10,000.";
  }

  return errors;
}

function sumHeadcount(state: FormState): number {
  const planning = parseInt(state.planningHeadcount, 10);
  const production = parseInt(state.productionHeadcount, 10);
  const finance = parseInt(state.financeHeadcount, 10);
  return (isNaN(planning) ? 0 : planning) +
    (isNaN(production) ? 0 : production) +
    (isNaN(finance) ? 0 : finance);
}

export interface TeamSizeFormProps {
  onComplete: (data: TeamSize) => void;
  onBack: () => void;
  initialValues?: TeamSize;
}

function toFormState(v: TeamSize): FormState {
  return {
    planningHeadcount: String(v.planningHeadcount),
    productionHeadcount: String(v.productionHeadcount),
    financeHeadcount: String(v.financeHeadcount),
  };
}

export default function TeamSizeForm({ onComplete, onBack, initialValues }: TeamSizeFormProps) {
  const [form, setForm] = useState<FormState>(
    initialValues
      ? toFormState(initialValues)
      : {
          planningHeadcount: "",
          productionHeadcount: "",
          financeHeadcount: "",
        }
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);

  function updateField(key: keyof FormState, value: string) {
    const next = { ...form, [key]: value };
    setForm(next);
    if (attempted) {
      setErrors(validate(next));
    }
  }

  function handleContinue() {
    setAttempted(true);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onComplete({
      planningHeadcount: parseInt(form.planningHeadcount, 10),
      productionHeadcount: parseInt(form.productionHeadcount, 10),
      financeHeadcount: parseInt(form.financeHeadcount, 10),
    });
  }

  const totalHeadcount = sumHeadcount(form);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800">Team Size</h2>
        <p className="mt-1 text-sm text-slate-500">
          Headcount by function — used to calculate the labor cost of manual processes.
        </p>
      </div>

      <div className="space-y-5">
        {/* Planning */}
        <div>
          <label
            htmlFor="planningHeadcount"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Planning Headcount <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="planningHeadcount"
              type="number"
              min="1"
              max="10000"
              step="1"
              placeholder="e.g. 8"
              value={form.planningHeadcount}
              onChange={(e) => updateField("planningHeadcount", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.planningHeadcount
                  ? "border-red-400"
                  : "border-slate-300 hover:border-slate-400"
              }`}
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">people</span>
          </div>
          {errors.planningHeadcount && (
            <p className="mt-1.5 text-xs text-red-600">{errors.planningHeadcount}</p>
          )}
        </div>

        {/* Production */}
        <div>
          <label
            htmlFor="productionHeadcount"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Production Headcount <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="productionHeadcount"
              type="number"
              min="1"
              max="10000"
              step="1"
              placeholder="e.g. 45"
              value={form.productionHeadcount}
              onChange={(e) =>
                updateField("productionHeadcount", e.target.value)
              }
              className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.productionHeadcount
                  ? "border-red-400"
                  : "border-slate-300 hover:border-slate-400"
              }`}
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">people</span>
          </div>
          {errors.productionHeadcount && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.productionHeadcount}
            </p>
          )}
        </div>

        {/* Finance */}
        <div>
          <label
            htmlFor="financeHeadcount"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Finance Headcount <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="financeHeadcount"
              type="number"
              min="1"
              max="10000"
              step="1"
              placeholder="e.g. 5"
              value={form.financeHeadcount}
              onChange={(e) => updateField("financeHeadcount", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.financeHeadcount
                  ? "border-red-400"
                  : "border-slate-300 hover:border-slate-400"
              }`}
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">people</span>
          </div>
          {errors.financeHeadcount && (
            <p className="mt-1.5 text-xs text-red-600">{errors.financeHeadcount}</p>
          )}
        </div>

        {/* Live total */}
        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-100 border border-slate-200">
          <span className="text-sm text-slate-600">
            Total headcount included in calculation
          </span>
          <span className="text-sm font-semibold text-slate-800 tabular-nums">
            {totalHeadcount > 0 ? totalHeadcount.toLocaleString() : "—"}
          </span>
        </div>
      </div>

      {/* Helper line */}
      <p className="mt-5 text-xs text-slate-400">
        Include only staff whose work is directly affected by ERP processes. Exclude senior management and IT.
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
