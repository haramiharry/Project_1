"use client";

import { useState } from "react";
import { PainPoints } from "@/types";

type FormState = {
  orderProcessingHoursPerDay: string;
  monthlyProductionErrors: string;
  inventoryWriteOffPercent: string;
  manualReportingHoursPerWeek: string;
  avgDeliveryDelayDays: string;
  monthlyDelayedOrders: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(state: FormState): FieldErrors {
  const errors: FieldErrors = {};

  const orderHrs = parseFloat(state.orderProcessingHoursPerDay);
  if (state.orderProcessingHoursPerDay === "" || isNaN(orderHrs) || orderHrs <= 0) {
    errors.orderProcessingHoursPerDay = "Enter a value greater than 0.";
  } else if (orderHrs > 200) {
    errors.orderProcessingHoursPerDay = "Value cannot exceed 200 hours per day.";
  }

  const errorCount = parseFloat(state.monthlyProductionErrors);
  if (state.monthlyProductionErrors === "" || isNaN(errorCount) || errorCount < 0) {
    errors.monthlyProductionErrors = "Enter 0 or a positive number.";
  } else if (errorCount > 10000) {
    errors.monthlyProductionErrors = "Value cannot exceed 10,000 errors per month.";
  }

  const writeOff = parseFloat(state.inventoryWriteOffPercent);
  if (state.inventoryWriteOffPercent === "" || isNaN(writeOff) || writeOff < 0) {
    errors.inventoryWriteOffPercent = "Enter 0 or a positive percentage.";
  } else if (writeOff > 100) {
    errors.inventoryWriteOffPercent = "Percentage cannot exceed 100.";
  }

  const reportingHrs = parseFloat(state.manualReportingHoursPerWeek);
  if (
    state.manualReportingHoursPerWeek === "" ||
    isNaN(reportingHrs) ||
    reportingHrs <= 0
  ) {
    errors.manualReportingHoursPerWeek = "Enter a value greater than 0.";
  } else if (reportingHrs > 168) {
    errors.manualReportingHoursPerWeek =
      "Cannot exceed 168 hours (total hours in a week).";
  }

  const delayDays = parseFloat(state.avgDeliveryDelayDays);
  if (state.avgDeliveryDelayDays === "" || isNaN(delayDays) || delayDays < 0) {
    errors.avgDeliveryDelayDays = "Enter 0 or a positive number of days.";
  } else if (delayDays > 180) {
    errors.avgDeliveryDelayDays = "Value cannot exceed 180 days.";
  }

  const delayedOrders = parseFloat(state.monthlyDelayedOrders);
  if (
    state.monthlyDelayedOrders === "" ||
    isNaN(delayedOrders) ||
    delayedOrders < 0
  ) {
    errors.monthlyDelayedOrders = "Enter 0 or a positive number of orders.";
  } else {
    // Cross-field validation: the two delay fields must be consistent.
    const delayDaysVal = parseFloat(state.avgDeliveryDelayDays);
    const bothPresent =
      !isNaN(delayDaysVal) && !isNaN(delayedOrders);

    if (bothPresent && delayDaysVal === 0 && delayedOrders > 0) {
      errors.monthlyDelayedOrders =
        "Delayed orders entered but average delay is zero. Set delay days or clear this field.";
    }
    if (bothPresent && delayedOrders === 0 && delayDaysVal > 0) {
      errors.monthlyDelayedOrders =
        "Delay days entered but monthly delayed orders is zero. Enter the number of orders affected or clear delay days.";
    }
  }

  return errors;
}

export interface PainPointsFormProps {
  onComplete: (data: PainPoints) => void;
  onBack: () => void;
  initialValues?: PainPoints;
}

function toFormState(v: PainPoints): FormState {
  return {
    orderProcessingHoursPerDay: String(v.orderProcessingHoursPerDay),
    monthlyProductionErrors: String(v.monthlyProductionErrors),
    inventoryWriteOffPercent: String(v.inventoryWriteOffPercent),
    manualReportingHoursPerWeek: String(v.manualReportingHoursPerWeek),
    avgDeliveryDelayDays: String(v.avgDeliveryDelayDays),
    monthlyDelayedOrders: String(v.monthlyDelayedOrders),
  };
}

export default function PainPointsForm({ onComplete, onBack, initialValues }: PainPointsFormProps) {
  const [form, setForm] = useState<FormState>(
    initialValues
      ? toFormState(initialValues)
      : {
          orderProcessingHoursPerDay: "",
          monthlyProductionErrors: "",
          inventoryWriteOffPercent: "",
          manualReportingHoursPerWeek: "",
          avgDeliveryDelayDays: "",
          monthlyDelayedOrders: "",
        }
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: string) {
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
      orderProcessingHoursPerDay: parseFloat(form.orderProcessingHoursPerDay),
      monthlyProductionErrors: parseFloat(form.monthlyProductionErrors),
      inventoryWriteOffPercent: parseFloat(form.inventoryWriteOffPercent),
      manualReportingHoursPerWeek: parseFloat(form.manualReportingHoursPerWeek),
      avgDeliveryDelayDays: parseFloat(form.avgDeliveryDelayDays),
      monthlyDelayedOrders: parseFloat(form.monthlyDelayedOrders),
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800">Operational Pain Points</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter your current operational figures. These drive the cost-of-inefficiency calculation.
          Use your best estimate — exact figures are not required.
        </p>
      </div>

      <div className="space-y-6">
        {/* Order Processing Hours */}
        <div>
          <label
            htmlFor="orderProcessingHours"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Order Processing Time <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-2">
            Average hours spent per day across your team manually processing, entering,
            or chasing order data.
          </p>
          <div className="flex items-center gap-3">
            <input
              id="orderProcessingHours"
              type="number"
              min="0.1"
              max="200"
              step="0.5"
              placeholder="e.g. 4"
              value={form.orderProcessingHoursPerDay}
              onChange={(e) =>
                updateField("orderProcessingHoursPerDay", e.target.value)
              }
              className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.orderProcessingHoursPerDay
                  ? "border-red-400"
                  : "border-slate-300 hover:border-slate-400"
              }`}
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">hours / day</span>
          </div>
          {errors.orderProcessingHoursPerDay && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.orderProcessingHoursPerDay}
            </p>
          )}
        </div>

        {/* Monthly Production Errors */}
        <div>
          <label
            htmlFor="productionErrors"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Monthly Production Errors <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-2">
            Count of defects, rework incidents, or quality failures per month that
            required corrective action.
          </p>
          <div className="flex items-center gap-3">
            <input
              id="productionErrors"
              type="number"
              min="0"
              max="10000"
              step="1"
              placeholder="e.g. 20"
              value={form.monthlyProductionErrors}
              onChange={(e) =>
                updateField("monthlyProductionErrors", e.target.value)
              }
              className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.monthlyProductionErrors
                  ? "border-red-400"
                  : "border-slate-300 hover:border-slate-400"
              }`}
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">errors / month</span>
          </div>
          {errors.monthlyProductionErrors && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.monthlyProductionErrors}
            </p>
          )}
        </div>

        {/* Inventory Write-Off % */}
        <div>
          <label
            htmlFor="writeOffPercent"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Inventory Write-Off Rate <span className="text-red-500">*</span>
          </label>
          {/* Tooltip-style helper — always visible, not hover-gated */}
          <p className="text-xs text-slate-400 mb-2">
            Percentage of your total inventory value written off per season due to overstock,
            dead stock, or quality issues. Example: enter 3.5 if you write off 3.5% of inventory annually.
          </p>
          <div className="flex items-center gap-3">
            <input
              id="writeOffPercent"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="e.g. 3.5"
              value={form.inventoryWriteOffPercent}
              onChange={(e) =>
                updateField("inventoryWriteOffPercent", e.target.value)
              }
              className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.inventoryWriteOffPercent
                  ? "border-red-400"
                  : "border-slate-300 hover:border-slate-400"
              }`}
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">% of inventory value</span>
          </div>
          {errors.inventoryWriteOffPercent && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.inventoryWriteOffPercent}
            </p>
          )}
        </div>

        {/* Manual Reporting Hours */}
        <div>
          <label
            htmlFor="reportingHours"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Manual Reporting Time <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-2">
            Total hours spent per week across your team building reports manually:
            production summaries, inventory snapshots, financial consolidations.
          </p>
          <div className="flex items-center gap-3">
            <input
              id="reportingHours"
              type="number"
              min="0.1"
              max="168"
              step="0.5"
              placeholder="e.g. 12"
              value={form.manualReportingHoursPerWeek}
              onChange={(e) =>
                updateField("manualReportingHoursPerWeek", e.target.value)
              }
              className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.manualReportingHoursPerWeek
                  ? "border-red-400"
                  : "border-slate-300 hover:border-slate-400"
              }`}
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">hours / week</span>
          </div>
          {errors.manualReportingHoursPerWeek && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.manualReportingHoursPerWeek}
            </p>
          )}
        </div>

        {/* Delivery Delay section — two fields grouped visually */}
        <div className="rounded-xl border border-slate-200 p-5 space-y-5 bg-slate-50">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              Delivery Delays{" "}
              <span className="text-xs font-normal text-slate-400">(enter both fields or leave both at 0)</span>
            </p>
            <p className="text-xs text-slate-400">
              These two fields work together. If delays are not a significant issue, enter 0 in both.
            </p>
          </div>

          {/* Average Delay Days */}
          <div>
            <label
              htmlFor="delayDays"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Average Delivery Delay <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Average number of days a late order arrives past its committed delivery date.
            </p>
            <div className="flex items-center gap-3">
              <input
                id="delayDays"
                type="number"
                min="0"
                max="180"
                step="1"
                placeholder="e.g. 5"
                value={form.avgDeliveryDelayDays}
                onChange={(e) =>
                  updateField("avgDeliveryDelayDays", e.target.value)
                }
                className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.avgDeliveryDelayDays
                    ? "border-red-400"
                    : "border-slate-300 hover:border-slate-400"
                }`}
              />
              <span className="text-sm text-slate-500 whitespace-nowrap">days / order</span>
            </div>
            {errors.avgDeliveryDelayDays && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.avgDeliveryDelayDays}
              </p>
            )}
          </div>

          {/* Monthly Delayed Orders */}
          <div>
            <label
              htmlFor="delayedOrders"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Monthly Orders Affected <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Number of customer orders per month that incur a delivery delay.
            </p>
            <div className="flex items-center gap-3">
              <input
                id="delayedOrders"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 15"
                value={form.monthlyDelayedOrders}
                onChange={(e) =>
                  updateField("monthlyDelayedOrders", e.target.value)
                }
                className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.monthlyDelayedOrders
                    ? "border-red-400"
                    : "border-slate-300 hover:border-slate-400"
                }`}
              />
              <span className="text-sm text-slate-500 whitespace-nowrap">orders / month</span>
            </div>
            {errors.monthlyDelayedOrders && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.monthlyDelayedOrders}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex gap-3">
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
