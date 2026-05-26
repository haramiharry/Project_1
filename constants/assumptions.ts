// All hardcoded financial and operational assumptions live here.
// Update this file when any baseline figure changes — no other file needs editing.

// Hourly cost basis for operations staff (blended rate across planning/production/finance).
// Source: mid-market apparel manufacturing benchmark, USD.
export const BLENDED_HOURLY_RATE_USD = 35;

// Cost per hour consumed by manual order processing activities.
// Covers labor + error-correction overhead typical in apparel order ops.
export const ORDER_PROCESSING_COST_PER_HOUR_USD = 25;

// Fully-loaded cost per production error: rework labor, material waste, delay penalties.
export const COST_PER_PRODUCTION_ERROR_USD = 200;

// Weeks per year used for annualizing weekly figures.
export const WORKING_WEEKS_PER_YEAR = 52;

// Working days per year (5-day week, no holiday adjustment — conservative).
export const WORKING_DAYS_PER_YEAR = 260;

// Savings realization ramp: ERP value does not arrive in full on day one.
// Year 1 reflects ramp-up, change fatigue, and partial adoption.
export const SAVINGS_RAMP = {
  year1: 0.40,
  year2: 0.85,
  year3: 1.00,
} as const;

// Default implementation timeline in months for mid-market apparel ERP.
export const DEFAULT_IMPLEMENTATION_TIMELINE_MONTHS = 9;

// Default change management overhead as a percentage of the license cost midpoint.
export const DEFAULT_CHANGE_MANAGEMENT_OVERHEAD_PERCENT = 15;

// Midpoint USD values for each license cost band.
// Used to calculate total investment when exact pricing is not known.
export const LICENSE_COST_BAND_MIDPOINTS_USD: Record<string, number> = {
  "50k_to_150k": 100_000,
  "150k_to_300k": 225_000,
  "300k_to_500k": 400_000,
  "above_500k": 650_000,
};

// Proportion of inventory value that ERP is expected to recover from write-offs.
// Conservative: ERP visibility and cycle-count automation typically recovers 60-70%
// of the write-off gap. Using 60% to stay conservative.
export const INVENTORY_WRITEOFF_RECOVERY_RATE = 0.60;

// Proportion of delivery delay cost recoverable through improved scheduling.
// Based on OTD improvement benchmarks for apparel ERP implementations.
export const DELIVERY_DELAY_RECOVERY_RATE = 0.55;

// Average cost per day of late delivery: expedite freight, penalties, lost margin.
// Conservative estimate for mid-market apparel.
export const COST_PER_DELIVERY_DELAY_DAY_USD = 150;

// Proportion of manual reporting hours that ERP automation eliminates.
export const REPORTING_AUTOMATION_RATE = 0.70;
