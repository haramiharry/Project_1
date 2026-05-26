export type IndustrySegment =
  | "apparel_garments"
  | "textiles"
  | "footwear"
  | "accessories"
  | "home_furnishings";

export type RevenueBand =
  | "under_5m"
  | "5m_to_20m"
  | "20m_to_50m"
  | "50m_to_100m"
  | "above_100m";

export type ERPStatus =
  | "no_erp"
  | "legacy_erp"
  | "basic_erp"
  | "modern_erp_partial";

export type LicenseCostBand =
  | "50k_to_150k"
  | "150k_to_300k"
  | "300k_to_500k"
  | "above_500k";

export interface CompanyProfile {
  industrySegment: IndustrySegment;
  annualRevenueBand: RevenueBand;
  currentInventoryValue: number; // USD, entered directly by user
  numberOfSites: number;
  currentERPStatus: ERPStatus;
}

export interface PainPoints {
  orderProcessingHoursPerDay: number;
  monthlyProductionErrors: number;
  // Percentage of CompanyProfile.currentInventoryValue written off annually.
  // e.g. 3.5 means 3.5% of inventory value lost to shrinkage/obsolescence per year.
  // NOT a percentage of revenue.
  inventoryWriteOffPercent: number;
  manualReportingHoursPerWeek: number;
  avgDeliveryDelayDays: number;
  // Number of orders per month that incur a delivery delay.
  // Used with avgDeliveryDelayDays × COST_PER_DELIVERY_DELAY_DAY_USD to compute annual delay cost.
  monthlyDelayedOrders: number;
}

export interface TeamSize {
  planningHeadcount: number;
  productionHeadcount: number;
  financeHeadcount: number;
}

export interface ImplementationAssumptions {
  implementationTimelineMonths: number;
  licenseCostBand: LicenseCostBand;
  changeManagementOverheadPercent: number; // percentage of license cost midpoint
}

export interface CalculatorInputs {
  companyProfile: CompanyProfile;
  painPoints: PainPoints;
  teamSize: TeamSize;
  implementationAssumptions: ImplementationAssumptions;
}

export interface CostBreakdown {
  orderProcessingCost: number;
  productionErrorCost: number;
  inventoryWriteOffCost: number;
  manualReportingCost: number;
  deliveryDelayCost: number;
}

export interface ROIOutput {
  currentAnnualCostOfInefficiency: number; // USD
  totalInvestment: number;                  // license midpoint + change mgmt overhead
  savingsYear1: number;
  savingsYear2: number;
  savingsYear3: number;
  cumulativeSavingsYear1: number;
  cumulativeSavingsYear2: number;
  cumulativeSavingsYear3: number;
  paybackPeriodMonths: number;
  roiPercent: number;                       // over 36 months
}
