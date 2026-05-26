"use client";

import { useCalculatorReducer } from "@/lib/useCalculatorReducer";
import { calculateROIOutput, calculateCostBreakdown } from "@/lib/roiCalculator";
import { CalculatorInputs } from "@/types";
import CompanyProfileForm from "@/components/forms/CompanyProfileForm";
import PainPointsForm from "@/components/forms/PainPointsForm";
import TeamSizeForm from "@/components/forms/TeamSizeForm";
import ImplementationAssumptionsForm from "@/components/forms/ImplementationAssumptionsForm";
import ROIResultsPanel from "@/components/ROIResultsPanel";
import ProgressIndicator from "@/components/ui/ProgressIndicator";

export default function Page() {
  const [state, dispatch] = useCalculatorReducer();
  const { currentStep, companyProfile, painPoints, teamSize, implementationAssumptions } = state;

  const allComplete =
    companyProfile !== null &&
    painPoints !== null &&
    teamSize !== null &&
    implementationAssumptions !== null;

  const roiData = (() => {
    if (currentStep !== 5 || !allComplete) return null;
    const inputs: CalculatorInputs = {
      companyProfile: companyProfile!,
      painPoints: painPoints!,
      teamSize: teamSize!,
      implementationAssumptions: implementationAssumptions!,
    };
    return {
      roi: calculateROIOutput(inputs),
      breakdown: calculateCostBreakdown(inputs),
    };
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

              {currentStep === 5 && allComplete && roiData && (
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
