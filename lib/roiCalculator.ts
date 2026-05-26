import {
  CalculatorInputs,
  ROIOutput,
} from "@/types";
import {
  BLENDED_HOURLY_RATE_USD,
  ORDER_PROCESSING_COST_PER_HOUR_USD,
  COST_PER_PRODUCTION_ERROR_USD,
  WORKING_WEEKS_PER_YEAR,
  WORKING_DAYS_PER_YEAR,
  SAVINGS_RAMP,
  LICENSE_COST_BAND_MIDPOINTS_USD,
  INVENTORY_WRITEOFF_RECOVERY_RATE,
  DELIVERY_DELAY_RECOVERY_RATE,
  COST_PER_DELIVERY_DELAY_DAY_USD,
  REPORTING_AUTOMATION_RATE,
} from "@/constants/assumptions";

// ---------------------------------------------------------------------------
// validateInputs
// ---------------------------------------------------------------------------
// Returns an array of human-readable error messages. Empty array = valid.
// All validation lives here — components call this and display the results.
// ---------------------------------------------------------------------------
export function validateInputs(inputs: CalculatorInputs): string[] {
  const errors: string[] = [];
  const { companyProfile, painPoints, teamSize, implementationAssumptions } = inputs;

  // CompanyProfile
  if (companyProfile.currentInventoryValue <= 0) {
    errors.push("Current inventory value must be greater than 0.");
  }
  if (companyProfile.numberOfSites < 1) {
    errors.push("Number of sites must be at least 1.");
  }

  // PainPoints
  if (painPoints.orderProcessingHoursPerDay < 0) {
    errors.push("Order processing hours per day cannot be negative.");
  }
  if (painPoints.monthlyProductionErrors < 0) {
    errors.push("Monthly production errors cannot be negative.");
  }
  if (painPoints.inventoryWriteOffPercent < 0 || painPoints.inventoryWriteOffPercent > 100) {
    errors.push("Inventory write-off percentage must be between 0 and 100.");
  }
  if (painPoints.manualReportingHoursPerWeek < 0) {
    errors.push("Manual reporting hours per week cannot be negative.");
  }
  if (painPoints.avgDeliveryDelayDays < 0) {
    errors.push("Average delivery delay days cannot be negative.");
  }
  if (painPoints.monthlyDelayedOrders < 0) {
    errors.push("Monthly delayed orders cannot be negative.");
  }
  // Delay cost requires both fields to be meaningful together
  if (painPoints.avgDeliveryDelayDays > 0 && painPoints.monthlyDelayedOrders === 0) {
    errors.push("You entered delivery delay days but 0 delayed orders per month. Please enter the number of orders affected.");
  }
  if (painPoints.monthlyDelayedOrders > 0 && painPoints.avgDeliveryDelayDays === 0) {
    errors.push("You entered delayed orders per month but 0 delay days. Please enter the average delay in days.");
  }

  // TeamSize
  if (teamSize.planningHeadcount < 0) {
    errors.push("Planning headcount cannot be negative.");
  }
  if (teamSize.productionHeadcount < 0) {
    errors.push("Production headcount cannot be negative.");
  }
  if (teamSize.financeHeadcount < 0) {
    errors.push("Finance headcount cannot be negative.");
  }
  if (
    teamSize.planningHeadcount + teamSize.productionHeadcount + teamSize.financeHeadcount === 0
  ) {
    errors.push("Total headcount across all teams must be greater than 0.");
  }

  // ImplementationAssumptions
  if (implementationAssumptions.implementationTimelineMonths < 1) {
    errors.push("Implementation timeline must be at least 1 month.");
  }
  if (
    implementationAssumptions.changeManagementOverheadPercent < 0 ||
    implementationAssumptions.changeManagementOverheadPercent > 100
  ) {
    errors.push("Change management overhead must be between 0 and 100 percent.");
  }

  return errors;
}

// ---------------------------------------------------------------------------
// calculateCurrentCost
// ---------------------------------------------------------------------------
// Annual cost of operational inefficiency across four cost drivers.
// Each driver maps directly to a user-entered PainPoints field.
// Returns the total annual cost in USD.
// ---------------------------------------------------------------------------
export function calculateCurrentCost(inputs: CalculatorInputs): number {
  const { painPoints, companyProfile } = inputs;

  // Driver 1: Order processing labor cost
  // Hours spent daily on manual order processing × cost per hour × working days/year.
  const orderProcessingCost =
    painPoints.orderProcessingHoursPerDay *
    ORDER_PROCESSING_COST_PER_HOUR_USD *
    WORKING_DAYS_PER_YEAR;

  // Driver 2: Production error cost
  // Monthly error count × fully-loaded cost per error × 12 months.
  const productionErrorCost =
    painPoints.monthlyProductionErrors *
    COST_PER_PRODUCTION_ERROR_USD *
    12;

  // Driver 3: Inventory write-off cost
  // User's inventory value × their reported write-off percentage.
  // inventoryWriteOffPercent is stored as a whole number (e.g. 3.5 = 3.5%).
  const inventoryWriteOffCost =
    (companyProfile.currentInventoryValue * painPoints.inventoryWriteOffPercent) / 100;

  // Driver 4: Manual reporting labor cost
  // Hours/week × blended staff rate × 52 weeks.
  const manualReportingCost =
    painPoints.manualReportingHoursPerWeek *
    BLENDED_HOURLY_RATE_USD *
    WORKING_WEEKS_PER_YEAR;

  // Driver 5: Delivery delay cost
  // Per order, per day cost × average delay days × delayed orders/month × 12 months.
  const deliveryDelayCost =
    painPoints.avgDeliveryDelayDays *
    COST_PER_DELIVERY_DELAY_DAY_USD *
    painPoints.monthlyDelayedOrders *
    12;

  return (
    orderProcessingCost +
    productionErrorCost +
    inventoryWriteOffCost +
    manualReportingCost +
    deliveryDelayCost
  );
}

// ---------------------------------------------------------------------------
// calculateFullYearSavings
// ---------------------------------------------------------------------------
// Maximum annual savings achievable at full ERP adoption (pre-ramp).
// Each saving maps to a recovery rate applied to its corresponding cost driver.
// This is the 100%-ramp baseline; calculateProjectedSavings applies the ramp.
// ---------------------------------------------------------------------------
function calculateFullYearSavings(inputs: CalculatorInputs): number {
  const { painPoints, companyProfile } = inputs;

  // Order processing: ERP automates intake, reducing manual hours by ~70%.
  // Using REPORTING_AUTOMATION_RATE as a conservative proxy for process automation.
  const orderProcessingSaving =
    painPoints.orderProcessingHoursPerDay *
    ORDER_PROCESSING_COST_PER_HOUR_USD *
    WORKING_DAYS_PER_YEAR *
    REPORTING_AUTOMATION_RATE;

  // Production errors: ERP quality controls and traceability reduce error rate.
  // Using DELIVERY_DELAY_RECOVERY_RATE (55%) as a conservative error-reduction proxy.
  const productionErrorSaving =
    painPoints.monthlyProductionErrors *
    COST_PER_PRODUCTION_ERROR_USD *
    12 *
    DELIVERY_DELAY_RECOVERY_RATE;

  // Inventory write-off: ERP visibility recovers 60% of current write-off losses.
  const inventoryWriteOffSaving =
    ((companyProfile.currentInventoryValue * painPoints.inventoryWriteOffPercent) / 100) *
    INVENTORY_WRITEOFF_RECOVERY_RATE;

  // Manual reporting: ERP eliminates 70% of manual reporting hours.
  const manualReportingSaving =
    painPoints.manualReportingHoursPerWeek *
    BLENDED_HOURLY_RATE_USD *
    WORKING_WEEKS_PER_YEAR *
    REPORTING_AUTOMATION_RATE;

  // Delivery delay: improved scheduling recovers 55% of delay-related costs.
  const deliveryDelaySaving =
    painPoints.avgDeliveryDelayDays *
    COST_PER_DELIVERY_DELAY_DAY_USD *
    painPoints.monthlyDelayedOrders *
    12 *
    DELIVERY_DELAY_RECOVERY_RATE;

  return (
    orderProcessingSaving +
    productionErrorSaving +
    inventoryWriteOffSaving +
    manualReportingSaving +
    deliveryDelaySaving
  );
}

// ---------------------------------------------------------------------------
// calculateProjectedSavings
// ---------------------------------------------------------------------------
// Applies the savings ramp to the full-year figure for the given year (1, 2, or 3).
// Year 1 = 40% of full savings (adoption ramp), Year 2 = 85%, Year 3 = 100%.
// ---------------------------------------------------------------------------
export function calculateProjectedSavings(
  inputs: CalculatorInputs,
  year: 1 | 2 | 3
): number {
  const fullYearSavings = calculateFullYearSavings(inputs);
  const rampKey = `year${year}` as keyof typeof SAVINGS_RAMP;
  return fullYearSavings * SAVINGS_RAMP[rampKey];
}

// ---------------------------------------------------------------------------
// calculateTotalInvestment
// ---------------------------------------------------------------------------
// License cost midpoint + change management overhead.
// Used as the denominator for payback and ROI calculations.
// ---------------------------------------------------------------------------
function calculateTotalInvestment(inputs: CalculatorInputs): number {
  const { implementationAssumptions } = inputs;
  const licenseMidpoint = LICENSE_COST_BAND_MIDPOINTS_USD[implementationAssumptions.licenseCostBand];
  const changeManagementCost =
    licenseMidpoint * (implementationAssumptions.changeManagementOverheadPercent / 100);
  return licenseMidpoint + changeManagementCost;
}

// ---------------------------------------------------------------------------
// calculatePaybackPeriod
// ---------------------------------------------------------------------------
// Months until cumulative savings exceed total investment.
// Walks month-by-month through the three-year ramp, returning the first month
// where cumulative savings >= total investment.
// Returns 999 if payback is not achieved within 36 months.
// ---------------------------------------------------------------------------
export function calculatePaybackPeriod(inputs: CalculatorInputs): number {
  const totalInvestment = calculateTotalInvestment(inputs);
  const savingsY1 = calculateProjectedSavings(inputs, 1);
  const savingsY2 = calculateProjectedSavings(inputs, 2);
  const savingsY3 = calculateProjectedSavings(inputs, 3);

  // Monthly savings for each year (annual figure ÷ 12).
  const monthlySavings: Record<number, number> = {
    1: savingsY1 / 12,
    2: savingsY2 / 12,
    3: savingsY3 / 12,
  };

  let cumulative = 0;
  for (let month = 1; month <= 36; month++) {
    const year = Math.ceil(month / 12) as 1 | 2 | 3;
    cumulative += monthlySavings[year];
    if (cumulative >= totalInvestment) {
      return month;
    }
  }

  return 999; // Payback not achieved within 36 months.
}

// ---------------------------------------------------------------------------
// calculateROI
// ---------------------------------------------------------------------------
// ROI over 36 months: (total savings - total investment) / total investment × 100.
// Standard ROI formula; investment is the denominator.
// ---------------------------------------------------------------------------
export function calculateROI(inputs: CalculatorInputs): number {
  const totalInvestment = calculateTotalInvestment(inputs);
  const totalSavings =
    calculateProjectedSavings(inputs, 1) +
    calculateProjectedSavings(inputs, 2) +
    calculateProjectedSavings(inputs, 3);

  if (totalInvestment === 0) return 0;
  return ((totalSavings - totalInvestment) / totalInvestment) * 100;
}

// ---------------------------------------------------------------------------
// calculateROIOutput
// ---------------------------------------------------------------------------
// Aggregates all calculations into a single ROIOutput object.
// This is the primary entry point for the results panel.
// ---------------------------------------------------------------------------
export function calculateROIOutput(inputs: CalculatorInputs): ROIOutput {
  const savingsYear1 = calculateProjectedSavings(inputs, 1);
  const savingsYear2 = calculateProjectedSavings(inputs, 2);
  const savingsYear3 = calculateProjectedSavings(inputs, 3);

  return {
    currentAnnualCostOfInefficiency: calculateCurrentCost(inputs),
    totalInvestment: calculateTotalInvestment(inputs),
    savingsYear1,
    savingsYear2,
    savingsYear3,
    cumulativeSavingsYear1: savingsYear1,
    cumulativeSavingsYear2: savingsYear1 + savingsYear2,
    cumulativeSavingsYear3: savingsYear1 + savingsYear2 + savingsYear3,
    paybackPeriodMonths: calculatePaybackPeriod(inputs),
    roiPercent: calculateROI(inputs),
  };
}
