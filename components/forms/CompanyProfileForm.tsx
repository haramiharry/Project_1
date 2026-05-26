"use client";

import { useState } from "react";
import { CompanyProfile, IndustrySegment, RevenueBand, ERPStatus } from "@/types";

const INDUSTRY_OPTIONS: {
  value: IndustrySegment;
  label: string;
  description: string;
}[] = [
  {
    value: "apparel_garments",
    label: "Apparel & Garments",
    description:
      "Cut-and-sew operations, branded apparel, and private label garment manufacturing.",
  },
  {
    value: "textiles",
    label: "Textiles",
    description:
      "Fabric mills, yarn production, and woven or knitted material manufacturing.",
  },
  {
    value: "footwear",
    label: "Footwear",
    description: "Shoe and boot manufacturing, including OEM and branded production.",
  },
  {
    value: "accessories",
    label: "Accessories",
    description: "Bags, belts, hats, and fashion accessories manufacturing.",
  },
  {
    value: "home_furnishings",
    label: "Home Furnishings",
    description:
      "Soft furnishings, curtains, upholstery, and home textile production.",
  },
];

const REVENUE_BAND_OPTIONS: { value: RevenueBand; label: string }[] = [
  { value: "under_5m", label: "Under $5M" },
  { value: "5m_to_20m", label: "$5M – $20M" },
  { value: "20m_to_50m", label: "$20M – $50M" },
  { value: "50m_to_100m", label: "$50M – $100M" },
  { value: "above_100m", label: "Above $100M" },
];

const ERP_STATUS_OPTIONS: {
  value: ERPStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "no_erp",
    label: "No ERP",
    description:
      "Running on spreadsheets, email, and manual processes across all departments.",
  },
  {
    value: "legacy_erp",
    label: "Legacy ERP (5+ years old)",
    description:
      "Heavily customized system that is difficult to update or integrate with modern tools.",
  },
  {
    value: "basic_erp",
    label: "Basic ERP (limited modules)",
    description:
      "Covers core financials only; production, inventory, and planning remain manual.",
  },
  {
    value: "modern_erp_partial",
    label: "Modern ERP (partial rollout)",
    description:
      "Modern platform in place but key modules, planning, QC, or logistics, are not yet live.",
  },
];

type FormState = {
  industrySegment: IndustrySegment | "";
  annualRevenueBand: RevenueBand | "";
  currentInventoryValue: string;
  numberOfSites: string;
  currentERPStatus: ERPStatus | "";
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(state: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!state.industrySegment) {
    errors.industrySegment = "Select an industry segment to continue.";
  }
  if (!state.annualRevenueBand) {
    errors.annualRevenueBand = "Select a revenue band to continue.";
  }

  const inventoryValue = parseFloat(state.currentInventoryValue);
  if (
    state.currentInventoryValue === "" ||
    isNaN(inventoryValue) ||
    inventoryValue <= 0
  ) {
    errors.currentInventoryValue =
      "Enter a valid inventory value greater than $0.";
  }

  const sites = parseInt(state.numberOfSites, 10);
  if (state.numberOfSites === "" || isNaN(sites) || sites < 1) {
    errors.numberOfSites = "Enter at least 1 site.";
  }

  if (!state.currentERPStatus) {
    errors.currentERPStatus = "Select your current ERP status to continue.";
  }

  return errors;
}

export interface CompanyProfileFormProps {
  onComplete: (data: CompanyProfile) => void;
}

export default function CompanyProfileForm({ onComplete }: CompanyProfileFormProps) {
  const [form, setForm] = useState<FormState>({
    industrySegment: "",
    annualRevenueBand: "",
    currentInventoryValue: "",
    numberOfSites: "",
    currentERPStatus: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
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
      industrySegment: form.industrySegment as IndustrySegment,
      annualRevenueBand: form.annualRevenueBand as RevenueBand,
      currentInventoryValue: parseFloat(form.currentInventoryValue),
      numberOfSites: parseInt(form.numberOfSites, 10),
      currentERPStatus: form.currentERPStatus as ERPStatus,
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800">Company Profile</h2>
        <p className="mt-1 text-sm text-slate-500">
          Tell us about your business so we can calibrate the ROI model to your context.
        </p>
      </div>

      <div className="space-y-8">
        {/* Industry Segment */}
        <fieldset>
          <legend className="text-sm font-medium text-slate-700 mb-3">
            Industry Segment <span className="text-red-500">*</span>
          </legend>
          <div className="space-y-2">
            {INDUSTRY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex flex-col px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                  form.industrySegment === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="industrySegment"
                    value={option.value}
                    checked={form.industrySegment === option.value}
                    onChange={() => updateField("industrySegment", option.value)}
                    className="accent-blue-600 w-4 h-4 shrink-0"
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {option.label}
                  </span>
                </div>
                {form.industrySegment === option.value && (
                  <p className="mt-1.5 ml-7 text-xs text-slate-500 leading-relaxed">
                    {option.description}
                  </p>
                )}
              </label>
            ))}
          </div>
          {errors.industrySegment && (
            <p className="mt-2 text-xs text-red-600">{errors.industrySegment}</p>
          )}
        </fieldset>

        {/* Annual Revenue Band */}
        <div>
          <label
            htmlFor="revenueBand"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Annual Revenue Band <span className="text-red-500">*</span>
          </label>
          <select
            id="revenueBand"
            value={form.annualRevenueBand}
            onChange={(e) =>
              updateField("annualRevenueBand", e.target.value as RevenueBand)
            }
            className={`w-full px-3 py-2.5 rounded-lg border text-sm text-slate-800 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.annualRevenueBand
                ? "border-red-400"
                : "border-slate-300 hover:border-slate-400"
            }`}
          >
            <option value="" disabled>
              Select revenue band…
            </option>
            {REVENUE_BAND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.annualRevenueBand && (
            <p className="mt-1.5 text-xs text-red-600">{errors.annualRevenueBand}</p>
          )}
        </div>

        {/* Current Inventory Value */}
        <div>
          <label
            htmlFor="inventoryValue"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Current Inventory Value (USD) <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-2">
            Total value of stock on hand at cost. Used directly in write-off calculations — not derived from revenue. Enter numbers only, no commas or symbols.
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">
              $
            </span>
            <input
              id="inventoryValue"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 2500000"
              value={form.currentInventoryValue}
              onChange={(e) =>
                updateField("currentInventoryValue", e.target.value)
              }
              className={`w-full pl-7 pr-4 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.currentInventoryValue
                  ? "border-red-400"
                  : "border-slate-300 hover:border-slate-400"
              }`}
            />
          </div>
          {errors.currentInventoryValue && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.currentInventoryValue}
            </p>
          )}
        </div>

        {/* Number of Sites */}
        <div>
          <label
            htmlFor="numberOfSites"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Number of Sites <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-2">
            Count of distinct manufacturing or warehouse locations the ERP would cover.
          </p>
          <input
            id="numberOfSites"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 3"
            value={form.numberOfSites}
            onChange={(e) => updateField("numberOfSites", e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.numberOfSites
                ? "border-red-400"
                : "border-slate-300 hover:border-slate-400"
            }`}
          />
          {errors.numberOfSites && (
            <p className="mt-1.5 text-xs text-red-600">{errors.numberOfSites}</p>
          )}
        </div>

        {/* Current ERP Status */}
        <fieldset>
          <legend className="text-sm font-medium text-slate-700 mb-3">
            Current ERP Status <span className="text-red-500">*</span>
          </legend>
          <div className="space-y-2">
            {ERP_STATUS_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex flex-col px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                  form.currentERPStatus === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="currentERPStatus"
                    value={option.value}
                    checked={form.currentERPStatus === option.value}
                    onChange={() =>
                      updateField("currentERPStatus", option.value)
                    }
                    className="accent-blue-600 w-4 h-4 shrink-0"
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {option.label}
                  </span>
                </div>
                {form.currentERPStatus === option.value && (
                  <p className="mt-1.5 ml-7 text-xs text-slate-500 leading-relaxed">
                    {option.description}
                  </p>
                )}
              </label>
            ))}
          </div>
          {errors.currentERPStatus && (
            <p className="mt-2 text-xs text-red-600">{errors.currentERPStatus}</p>
          )}
        </fieldset>
      </div>

      {/* Continue */}
      <div className="mt-10">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
