import { useReducer } from "react";
import {
  CompanyProfile,
  PainPoints,
  TeamSize,
  ImplementationAssumptions,
} from "@/types";

export type CalculatorState = {
  currentStep: number;
  companyProfile: CompanyProfile | null;
  painPoints: PainPoints | null;
  teamSize: TeamSize | null;
  implementationAssumptions: ImplementationAssumptions | null;
};

export type CalculatorAction =
  | { type: "SET_COMPANY_PROFILE"; payload: CompanyProfile }
  | { type: "SET_PAIN_POINTS"; payload: PainPoints }
  | { type: "SET_TEAM_SIZE"; payload: TeamSize }
  | { type: "SET_IMPLEMENTATION_ASSUMPTIONS"; payload: ImplementationAssumptions }
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "RESET" };

const initialState: CalculatorState = {
  currentStep: 1,
  companyProfile: null,
  painPoints: null,
  teamSize: null,
  implementationAssumptions: null,
};

function reducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case "SET_COMPANY_PROFILE":
      return { ...state, companyProfile: action.payload };
    case "SET_PAIN_POINTS":
      return { ...state, painPoints: action.payload };
    case "SET_TEAM_SIZE":
      return { ...state, teamSize: action.payload };
    case "SET_IMPLEMENTATION_ASSUMPTIONS":
      return { ...state, implementationAssumptions: action.payload };
    case "NEXT_STEP":
      return { ...state, currentStep: Math.min(state.currentStep + 1, 5) };
    case "PREVIOUS_STEP":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useCalculatorReducer() {
  return useReducer(reducer, initialState);
}
