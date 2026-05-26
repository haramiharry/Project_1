"use client";

import { useState } from "react";
import { useCalculatorReducer } from "@/lib/useCalculatorReducer";
import { calculateROIOutput, calculateCostBreakdown } from "@/lib/roiCalculator";
import { CalculatorInputs } from "@/types";
import CompanyProfileForm from "@/components/forms/CompanyProfileForm";
import PainPointsForm from "@/components/forms/PainPointsForm";
import TeamSizeForm from "@/components/forms/TeamSizeForm";
import ImplementationAssumptionsForm from "@/components/forms/ImplementationAssumptionsForm";
import ROIResultsPanel from "@/components/ROIResultsPanel";
import ProgressIndicator from "@/components/ui/ProgressIndicator";

type RoiData =
  | { ok: true; roi: ReturnType<typeof calculateROIOutput>; breakdown: ReturnType<typeof calculateCostBreakdown> }
  | { ok: false };

function computeRoiData(inputs: CalculatorInputs): RoiData {
  try {
    return {
      ok: true,
      roi: calculateROIOutput(inputs),
      breakdown: calculateCostBreakdown(inputs),
    };
  } catch {
    return { ok: false };
  }
}

export default function Page() {
  const [state, dispatch] = useCalculatorReducer();
  const [isManualOpen, setIsManualOpen] = useState(false);
  const { currentStep, companyProfile, painPoints, teamSize, implementationAssumptions } = state;

  const allComplete =
    companyProfile !== null &&
    painPoints !== null &&
    teamSize !== null &&
    implementationAssumptions !== null;

  const roiData: RoiData | null = (() => {
    if (currentStep !== 5 || !allComplete) return null;
    return computeRoiData({
      companyProfile: companyProfile!,
      painPoints: painPoints!,
      teamSize: teamSize!,
      implementationAssumptions: implementationAssumptions!,
    });
  })();

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">ERP ROI Calculator</h1>
          <p className="mt-1 text-sm text-slate-500">
            Fashion &amp; Apparel Manufacturing
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 pt-6 pb-5 border-b border-slate-100">
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => setIsManualOpen(true)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors focus:outline-none"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect x="2" y="1" width="9" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4.5 4.5h5M4.5 7h5M4.5 9.5h3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
                User Manual
              </button>
            </div>
            <ProgressIndicator currentStep={currentStep} />
          </div>

          <div className="p-6 md:p-10" style={{ minHeight: "480px" }}>
            <div key={currentStep} className="animate-fadein">
              {currentStep === 1 && (
                <CompanyProfileForm
                  initialValues={companyProfile ?? undefined}
                  onComplete={(data) => {
                    dispatch({ type: "SET_COMPANY_PROFILE", payload: data });
                    dispatch({ type: "NEXT_STEP" });
                  }}
                />
              )}

              {currentStep === 2 && (
                <PainPointsForm
                  initialValues={painPoints ?? undefined}
                  onComplete={(data) => {
                    dispatch({ type: "SET_PAIN_POINTS", payload: data });
                    dispatch({ type: "NEXT_STEP" });
                  }}
                  onBack={() => dispatch({ type: "PREVIOUS_STEP" })}
                />
              )}

              {currentStep === 3 && (
                <TeamSizeForm
                  initialValues={teamSize ?? undefined}
                  onComplete={(data) => {
                    dispatch({ type: "SET_TEAM_SIZE", payload: data });
                    dispatch({ type: "NEXT_STEP" });
                  }}
                  onBack={() => dispatch({ type: "PREVIOUS_STEP" })}
                />
              )}

              {currentStep === 4 && (
                <ImplementationAssumptionsForm
                  initialValues={implementationAssumptions ?? undefined}
                  onComplete={(data) => {
                    dispatch({ type: "SET_IMPLEMENTATION_ASSUMPTIONS", payload: data });
                    dispatch({ type: "NEXT_STEP" });
                  }}
                  onBack={() => dispatch({ type: "PREVIOUS_STEP" })}
                />
              )}

              {currentStep === 5 && roiData?.ok === false && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                  <p className="text-sm font-semibold text-red-700 mb-1">
                    Something went wrong calculating your results.
                  </p>
                  <p className="text-sm text-red-600 mb-4">
                    Please go back and check your inputs.
                  </p>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "PREVIOUS_STEP" })}
                    className="px-4 py-2 rounded-lg border border-red-300 bg-white text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                  >
                    Back
                  </button>
                </div>
              )}

              {currentStep === 5 && roiData?.ok === true && (
                <ROIResultsPanel
                  roi={roiData.roi}
                  breakdown={roiData.breakdown}
                  onStartOver={() => dispatch({ type: "RESET" })}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
