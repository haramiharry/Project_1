"use client";

import { useState } from "react";
import { ROIOutput, CostBreakdown } from "@/types";
import {
  BLENDED_HOURLY_RATE_USD,
  SAVINGS_RAMP,
  INVENTORY_WRITEOFF_RECOVERY_RATE,
  DELIVERY_DELAY_RECOVERY_RATE,
  REPORTING_AUTOMATION_RATE,
} from "@/constants/assumptions";

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number): string {
  return "$" + Math.round(value).toLocaleString("en-US");
}

function formatPercent(value: number, decimals = 1): string {
  return value.toFixed(decimals) + "%";
}

function formatPayback(months: number): string {
  return months === 999 ? "Beyond 36 months" : `${months} month${months === 1 ? "" : "s"}`;
}

// ---------------------------------------------------------------------------
// ROIResultsPanel
// ---------------------------------------------------------------------------

export interface ROIResultsPanelProps {
  roi: ROIOutput;
  breakdown: CostBreakdown;
  onStartOver: () => void;
}

export default function ROIResultsPanel({ roi, breakdown, onStartOver }: ROIResultsPanelProps) {
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const maxAnnualSavings = Math.max(roi.savingsYear1, roi.savingsYear2, roi.savingsYear3);

  const savingsYears = [
    {
      label: "Year 1",
      ramp: `${SAVINGS_RAMP.year1 * 100}% adoption`,
      savings: roi.savingsYear1,
      cumulative: roi.cumulativeSavingsYear1,
    },
    {
      label: "Year 2",
      ramp: `${SAVINGS_RAMP.year2 * 100}% adoption`,
      savings: roi.savingsYear2,
      cumulative: roi.cumulativeSavingsYear2,
    },
    {
      label: "Year 3",
      ramp: `${SAVINGS_RAMP.year3 * 100}% adoption`,
      savings: roi.savingsYear3,
      cumulative: roi.cumulativeSavingsYear3,
    },
  ];

  const costRows = [
    { label: "Order Processing Labor", value: breakdown.orderProcessingCost },
    { label: "Production Error Costs", value: breakdown.productionErrorCost },
    { label: "Inventory Write-offs", value: breakdown.inventoryWriteOffCost },
    { label: "Manual Reporting Labor", value: breakdown.manualReportingCost },
    { label: "Delivery Delay Costs", value: breakdown.deliveryDelayCost },
  ];

  async function handleExportPDF() {
    setIsPdfGenerating(true);
    try {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

    const pageW = 210;
    const margin = 20;
    const right = pageW - margin;
    const colMid = margin + 90;
    let y = 18;

    // ---- helpers scoped to this call ----
    const setStyle = (
      size: number,
      weight: "normal" | "bold",
      r: number,
      g: number,
      b: number
    ) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", weight);
      doc.setTextColor(r, g, b);
    };

    const rule = (yPos: number) => {
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos, right, yPos);
    };

    // ---- Title ----
    setStyle(15, "bold", 30, 41, 59);
    doc.text("ERP ROI Calculator", margin, y);
    y += 7;

    setStyle(9, "normal", 100, 116, 139);
    doc.text("Results Summary", margin, y);

    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(dateStr, right, y, { align: "right" });
    y += 7;

    rule(y);
    y += 10;

    // ---- Key Metrics (2 x 2 grid) ----
    setStyle(7.5, "bold", 71, 85, 105);
    doc.text("KEY METRICS", margin, y);
    y += 7;

    const metrics = [
      { label: "Annual Cost of Inefficiency", value: formatCurrency(roi.currentAnnualCostOfInefficiency), col: margin },
      { label: "Total ERP Investment", value: formatCurrency(roi.totalInvestment), col: colMid },
      { label: "Payback Period", value: formatPayback(roi.paybackPeriodMonths), col: margin },
      { label: "3-Year ROI", value: formatPercent(roi.roiPercent), col: colMid },
    ];

    for (let i = 0; i < metrics.length; i += 2) {
      const pair = metrics.slice(i, i + 2);
      pair.forEach(({ label, col }) => {
        setStyle(8, "normal", 100, 116, 139);
        doc.text(label, col, y);
      });
      y += 5;
      pair.forEach(({ value, col }) => {
        setStyle(13, "bold", 30, 41, 59);
        doc.text(value, col, y);
      });
      y += 11;
    }

    rule(y);
    y += 10;

    // ---- Projected Savings ----
    setStyle(7.5, "bold", 71, 85, 105);
    doc.text("PROJECTED SAVINGS", margin, y);
    y += 7;

    const yearCols = [margin, margin + 57, margin + 114];
    savingsYears.forEach(({ label }, i) => {
      setStyle(9, "bold", 30, 41, 59);
      doc.text(label, yearCols[i], y);
    });
    y += 4.5;
    savingsYears.forEach(({ ramp }, i) => {
      setStyle(7.5, "normal", 148, 163, 184);
      doc.text(ramp, yearCols[i], y);
    });
    y += 6;

    savingsYears.forEach((_, i) => {
      setStyle(7.5, "normal", 100, 116, 139);
      doc.text("Annual savings", yearCols[i], y);
    });
    y += 4;
    savingsYears.forEach(({ savings }, i) => {
      setStyle(10, "bold", 30, 41, 59);
      doc.text(formatCurrency(savings), yearCols[i], y);
    });
    y += 6;

    savingsYears.forEach((_, i) => {
      setStyle(7.5, "normal", 100, 116, 139);
      doc.text("Cumulative", yearCols[i], y);
    });
    y += 4;
    savingsYears.forEach(({ cumulative }, i) => {
      setStyle(10, "bold", 30, 41, 59);
      doc.text(formatCurrency(cumulative), yearCols[i], y);
    });
    y += 12;

    rule(y);
    y += 10;

    // ---- Cost Breakdown ----
    setStyle(7.5, "bold", 71, 85, 105);
    doc.text("CURRENT COST BREAKDOWN", margin, y);
    y += 7;

    costRows.forEach(({ label, value }) => {
      setStyle(9, "normal", 71, 85, 105);
      doc.text(label, margin, y);
      setStyle(9, "bold", 30, 41, 59);
      doc.text(formatCurrency(value), right, y, { align: "right" });
      y += 6;
    });

    y += 1;
    rule(y);
    y += 5;

    setStyle(9, "bold", 30, 41, 59);
    doc.text("Total Annual Cost of Inefficiency", margin, y);
    doc.text(formatCurrency(roi.currentAnnualCostOfInefficiency), right, y, { align: "right" });
    y += 13;

    rule(y);
    y += 8;

    // ---- Assumptions Footnote ----
    setStyle(7.5, "bold", 100, 116, 139);
    doc.text("ASSUMPTIONS", margin, y);
    y += 5;

    const footnotes = [
      `Blended staff hourly rate: $${BLENDED_HOURLY_RATE_USD}/hr`,
      `Savings ramp: Year 1 ${SAVINGS_RAMP.year1 * 100}%, Year 2 ${SAVINGS_RAMP.year2 * 100}%, Year 3 ${SAVINGS_RAMP.year3 * 100}%`,
      `Inventory write-off recovery rate: ${INVENTORY_WRITEOFF_RECOVERY_RATE * 100}%`,
      `Delivery delay cost recovery rate: ${DELIVERY_DELAY_RECOVERY_RATE * 100}%`,
      `Reporting and order processing automation rate: ${REPORTING_AUTOMATION_RATE * 100}%`,
      `License cost uses midpoint of selected band. All figures in USD.`,
    ];

    footnotes.forEach((line) => {
      setStyle(7.5, "normal", 148, 163, 184);
      doc.text(line, margin, y);
      y += 4.5;
    });

    doc.save("erp-roi-summary.pdf");
    } catch {
      // jsPDF failure — button resets via finally
    } finally {
      setIsPdfGenerating(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Your ERP ROI Summary</h2>
        <p className="mt-1 text-sm text-slate-500">
          Based on your inputs. All savings figures apply the industry-standard adoption ramp.
        </p>
      </div>

      {/* Four metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-medium text-red-600 mb-1">Annual Cost of Inefficiency</p>
          <p className="text-xl font-bold text-red-700 leading-tight tabular-nums">
            {formatCurrency(roi.currentAnnualCostOfInefficiency)}
          </p>
          <p className="mt-1 text-xs text-red-400">current state</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-600 mb-1">Total ERP Investment</p>
          <p className="text-xl font-bold text-slate-800 leading-tight tabular-nums">
            {formatCurrency(roi.totalInvestment)}
          </p>
          <p className="mt-1 text-xs text-slate-400">license + overhead</p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-medium text-blue-600 mb-1">Payback Period</p>
          <p className="text-xl font-bold text-blue-700 leading-tight tabular-nums">
            {formatPayback(roi.paybackPeriodMonths)}
          </p>
          <p className="mt-1 text-xs text-blue-400">to break even</p>
        </div>

        <div
          className={`rounded-xl border p-4 ${
            roi.roiPercent >= 0
              ? "border-green-200 bg-green-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <p
            className={`text-xs font-medium mb-1 ${
              roi.roiPercent >= 0 ? "text-green-600" : "text-amber-600"
            }`}
          >
            3-Year ROI
          </p>
          <p
            className={`text-xl font-bold leading-tight tabular-nums ${
              roi.roiPercent >= 0 ? "text-green-700" : "text-amber-700"
            }`}
          >
            {formatPercent(roi.roiPercent)}
          </p>
          <p
            className={`mt-1 text-xs ${
              roi.roiPercent >= 0 ? "text-green-400" : "text-amber-400"
            }`}
          >
            over 36 months
          </p>
        </div>
      </div>

      {/* Savings timeline with CSS bar chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-6">Projected Savings</h3>
        <div className="grid grid-cols-3 gap-6">
          {savingsYears.map(({ label, ramp, savings, cumulative }) => {
            const barHeight =
              maxAnnualSavings > 0
                ? Math.max(4, Math.round((savings / maxAnnualSavings) * 120))
                : 4;
            return (
              <div key={label} className="flex flex-col items-center gap-4">
                {/* Bar */}
                <div
                  className="flex w-full items-end justify-center"
                  style={{ height: "120px" }}
                >
                  <div
                    className="w-3/4 rounded-t-md bg-blue-500"
                    style={{ height: `${barHeight}px` }}
                  />
                </div>
                {/* Savings data */}
                <div className="w-full space-y-2">
                  <div>
                    <p className="text-xs text-slate-400">Annual savings</p>
                    <p className="text-sm font-semibold text-slate-800 tabular-nums">
                      {formatCurrency(savings)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Cumulative to date</p>
                    <p className="text-sm font-semibold text-slate-800 tabular-nums">
                      {formatCurrency(cumulative)}
                    </p>
                  </div>
                </div>
                {/* Label */}
                <div className="w-full pt-2 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-700">{label}</p>
                  <p className="text-xs text-slate-400">{ramp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Current Cost Breakdown
        </h3>
        {costRows.every(({ value }) => value === 0) && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs text-amber-700">
              One or more cost drivers returned zero. Review your inputs for accuracy.
            </p>
          </div>
        )}
        <div className="space-y-3">
          {costRows.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-600">{label}</span>
              <span className="text-sm font-semibold text-slate-800 tabular-nums">
                {formatCurrency(value)}
              </span>
            </div>
          ))}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-800">
              Total Annual Cost
            </span>
            <span className="text-sm font-bold text-red-600 tabular-nums">
              {formatCurrency(roi.currentAnnualCostOfInefficiency)}
            </span>
          </div>
        </div>
      </div>

      {/* Assumptions footnote */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 px-5 py-4">
        <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
          Assumptions
        </p>
        <ul className="space-y-1">
          <li className="text-xs text-slate-400">
            Blended staff hourly rate: ${BLENDED_HOURLY_RATE_USD}/hr
          </li>
          <li className="text-xs text-slate-400">
            Savings ramp: Year 1 {SAVINGS_RAMP.year1 * 100}%, Year 2{" "}
            {SAVINGS_RAMP.year2 * 100}%, Year 3 {SAVINGS_RAMP.year3 * 100}%
          </li>
          <li className="text-xs text-slate-400">
            Inventory write-off recovery: {INVENTORY_WRITEOFF_RECOVERY_RATE * 100}% of
            reported write-off loss
          </li>
          <li className="text-xs text-slate-400">
            Delivery delay cost recovery: {DELIVERY_DELAY_RECOVERY_RATE * 100}% via
            improved scheduling
          </li>
          <li className="text-xs text-slate-400">
            Reporting and order processing automation: {REPORTING_AUTOMATION_RATE * 100}%
            of manual hours eliminated
          </li>
          <li className="text-xs text-slate-400">
            License cost uses midpoint of selected band. All figures in USD.
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="button"
          onClick={onStartOver}
          className="order-2 sm:order-1 w-full sm:w-auto py-3 px-6 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-600 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Start Over
        </button>
        <button
          type="button"
          onClick={handleExportPDF}
          disabled={isPdfGenerating}
          className="order-1 sm:order-2 w-full sm:w-auto py-3.5 px-8 rounded-xl bg-slate-700 hover:bg-slate-800 active:bg-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          {isPdfGenerating ? "Generating…" : "Download PDF Summary"}
        </button>
      </div>
    </div>
  );
}
