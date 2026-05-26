export default function ManualContent() {
  return (
    <div>

      {/* ── Purpose ─────────────────────────────────────────────────────── */}
      <h2 className="text-blue-600 font-semibold text-base border-b border-slate-200 pb-2 mb-3 mt-6">
        Purpose
      </h2>
      <p className="text-slate-600 text-sm leading-relaxed">
        This manual is for pre-sales consultants and solution consultants using the ERP ROI
        Calculator during prospect engagements. It covers how to run a calculation, what each input
        means, how to interpret the output, and how to use the PDF in a presentation context.
      </p>

      {/* ── Before You Start ────────────────────────────────────────────── */}
      <h2 className="text-blue-600 font-semibold text-base border-b border-slate-200 pb-2 mb-3 mt-6">
        Before You Start
      </h2>
      <p className="text-slate-600 text-sm leading-relaxed">
        You do not need exact figures. Estimates are sufficient and expected. The tool is designed
        for a discovery conversation, not an audit. If a prospect says ‘I don’t know
        exactly,’ use the guidance in each field description below to help them estimate.
      </p>
      <p className="font-medium text-slate-800 text-sm leading-relaxed mt-3">
        Have these ready before opening the tool:
      </p>
      <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r px-4 py-3 my-3">
        <ul className="space-y-1.5">
          {[
            "Approximate annual revenue",
            "Rough inventory value (total stock on hand at cost)",
            "Number of production or distribution sites",
            "Current ERP or system status",
            "How long it takes to process a typical production order end to end",
            "Rough monthly count of production errors or rework incidents",
            "What percentage of seasonal inventory gets written off",
            "How many hours per week are spent on manual reporting across planning and finance teams",
            "Average days a delivery runs late and how many orders per month experience delays",
            "Team headcount in planning, production, and finance",
          ].map((item) => (
            <li key={item} className="flex items-start">
              <span className="text-blue-600 mr-2 shrink-0" aria-hidden="true">•</span>
              <span className="text-slate-600 text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r px-4 py-3 my-3">
        <p className="text-slate-600 text-sm leading-relaxed">
          The entire input process takes five to eight minutes with a prepared prospect.
        </p>
      </div>

      {/* ── Step by Step Walkthrough ─────────────────────────────────────── */}
      <h2 className="text-blue-600 font-semibold text-base border-b border-slate-200 pb-2 mb-3 mt-6">
        Step by Step Walkthrough
      </h2>

      {/* Step 1 */}
      <h3 className="text-slate-800 font-semibold text-sm mt-5 mb-1">Step 1: Company Profile</h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        Four inputs. Sets the segment context for the calculation.
      </p>
      <div className="mt-3 space-y-2">
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Industry Segment: </span>
          Select the closest match: Apparel and Garments, Textiles, Footwear, Accessories, or Home
          Furnishings. Does not affect the calculation in v1.0 but appears on the PDF.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Annual Revenue Band: </span>
          Select the band covering the prospect&rsquo;s annual revenue. Used as a proxy for scaling
          certain cost assumptions.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Current Inventory Value: </span>
          Total inventory value at cost in USD. Base for write-off percentage calculations. Estimate:
          15 to 25% of annual revenue for a typical apparel manufacturer. Numbers only, no commas.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Current ERP Status: </span>
          Select the closest option. A one-line description appears for each choice. If between
          categories, select the lower maturity option.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Number of Production Sites: </span>
          Number of manufacturing or distribution sites in scope.
        </p>
      </div>

      <div className="border-t border-slate-100 mt-6 pt-2" />

      {/* Step 2 */}
      <h3 className="text-slate-800 font-semibold text-sm mt-5 mb-1">Step 2: Pain Points</h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        Six inputs. The most important step. These numbers drive the entire output.
      </p>
      <div className="mt-3 space-y-2">
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Order Processing Time (hrs/day): </span>
          Total hours per day spent processing production orders manually: data pulling, chasing
          confirmations, spreadsheet updates, error corrections. Typical range without ERP: 3 to 8
          hours per day.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Monthly Production Errors: </span>
          Orders per month resulting in rework, returns, or quality failures. If unknown, estimate 2
          to 5% of monthly order volume.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Inventory Write-Off (%): </span>
          Percentage of total inventory value written off each season. Industry average for fashion
          and apparel: 5 to 15%.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Manual Reporting Hours (hrs/week): </span>
          Total hours per week across planning and finance for manual reporting. Aggregate across all
          staff, not per person. Typical range: 10 to 30 hrs/week.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Average Delivery Delay (days/order): </span>
          Average days a delayed order runs past committed delivery date. Enter 0 if delivery delays
          are not a significant pain point.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Monthly Delayed Orders: </span>
          Orders per month experiencing a delay. Must be 0 if average delay days is 0. The tool
          flags a mismatch if these two fields are inconsistent.
        </p>
      </div>

      <div className="border-t border-slate-100 mt-6 pt-2" />

      {/* Step 3 */}
      <h3 className="text-slate-800 font-semibold text-sm mt-5 mb-1">Step 3: Team Size</h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        Three inputs. Quick step.
      </p>
      <div className="mt-3 space-y-2">
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Planning Team Headcount: </span>
          Staff in demand planning, production planning, and inventory management directly affected
          by ERP processes. Exclude senior management and IT.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Production Team Headcount: </span>
          Staff on the production floor or in operations interacting with order management,
          scheduling, or quality tracking.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Finance Team Headcount: </span>
          Staff in finance and accounting involved in reporting, cost tracking, or procurement
          affected by ERP implementation.
        </p>
      </div>

      <div className="border-t border-slate-100 mt-6 pt-2" />

      {/* Step 4 */}
      <h3 className="text-slate-800 font-semibold text-sm mt-5 mb-1">
        Step 4: Implementation Assumptions
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        Pre-filled with mid-market apparel ERP industry norms. Leave defaults for standard
        discovery. Edit when you have a specific vendor quote or complex scope.
      </p>
      <div className="mt-3 space-y-2">
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Implementation Timeline: </span>
          Default 9 months. Typical range: 6 to 18 months depending on scope.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">License Cost Band: </span>
          Select the band matching your vendor&rsquo;s pricing or best estimate. The midpoint of the
          selected band is used in the investment calculation.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          <span className="font-medium text-slate-800">Change Management Overhead: </span>
          Default 15% of license cost. Range in practice: 10 to 25%.
        </p>
      </div>

      <div className="border-t border-slate-100 mt-6 pt-2" />

      {/* Step 5 */}
      <h3 className="text-slate-800 font-semibold text-sm mt-5 mb-1">Step 5: Results</h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        The results panel has four sections.
      </p>
      <h3 className="text-slate-800 font-semibold text-sm mt-5 mb-1">Metric Cards (top row)</h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        Four summary numbers: Annual Cost of Inefficiency (your anchor number), Total ERP
        Investment (license midpoint plus change management), Payback Period (months to break even,
        or &lsquo;Beyond 36 months&rsquo;), and 3-Year ROI percentage. Negative ROI displays in
        amber, not green.
      </p>
      <h3 className="text-slate-800 font-semibold text-sm mt-5 mb-1">Savings Timeline</h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        Three columns showing projected savings at Year 1, Year 2, and Year 3. Each shows annual
        savings and cumulative savings to that point. The adoption ramp percentage is visible below
        each column so the prospect understands why Year 1 is lower than Year 3.
      </p>
      <h3 className="text-slate-800 font-semibold text-sm mt-5 mb-1">Current Cost Breakdown</h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        Itemized view of annual inefficiency cost across the five drivers. Use this section to
        identify the dominant pain point and anchor your deal narrative.
      </p>
      <h3 className="text-slate-800 font-semibold text-sm mt-5 mb-1">Assumptions Footnote</h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        All financial constants used in the calculation. This section exists to handle the
        &lsquo;where do these numbers come from&rsquo; question from a CFO or finance director.
      </p>

      {/* ── Downloading the PDF ──────────────────────────────────────────── */}
      <h2 className="text-blue-600 font-semibold text-base border-b border-slate-200 pb-2 mb-3 mt-6">
        Downloading the PDF
      </h2>
      <p className="text-slate-600 text-sm leading-relaxed">
        Click Download PDF Summary at the bottom of the results panel. The PDF generates
        client-side and downloads automatically. Generation takes two to four seconds. Do not click
        the button multiple times. The PDF is formatted for A4 portrait and is suitable for
        inclusion in a proposal document or leave-behind after a meeting.
      </p>

      {/* ── Tips for Pre-Sales Use ───────────────────────────────────────── */}
      <h2 className="text-blue-600 font-semibold text-base border-b border-slate-200 pb-2 mb-3 mt-6">
        Tips for Pre-Sales Use
      </h2>

      <div className="bg-slate-50 border-l-4 border-slate-300 rounded-r px-4 py-3 my-2">
        <p className="font-semibold text-slate-800 text-sm">
          Run it live with the prospect, not before the meeting.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          The tool is most powerful when the prospect watches their own numbers appear in real time.
          Filling it in yourself before the meeting and showing them the output removes the
          &lsquo;their data, their result&rsquo; effect that drives urgency.
        </p>
      </div>

      <div className="bg-slate-50 border-l-4 border-slate-300 rounded-r px-4 py-3 my-2">
        <p className="font-semibold text-slate-800 text-sm">
          Let the Annual Cost of Inefficiency land before speaking.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          After the results panel loads, pause. Let the prospect read the number. Do not immediately
          explain it. The silence does more work than your next sentence.
        </p>
      </div>

      <div className="bg-slate-50 border-l-4 border-slate-300 rounded-r px-4 py-3 my-2">
        <p className="font-semibold text-slate-800 text-sm">
          Use the cost breakdown to find the dominant pain point.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          If inventory write-offs are 70% of the total inefficiency cost, that is your deal
          narrative. Lead with that in your proposal.
        </p>
      </div>

      <div className="bg-slate-50 border-l-4 border-slate-300 rounded-r px-4 py-3 my-2">
        <p className="font-semibold text-slate-800 text-sm">
          The assumptions footnote is your credibility shield.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          When a CFO pushes back on a number, open the footnote. Every assumption is listed with its
          value. &lsquo;Here is exactly what we assumed and why&rsquo; closes more objections than
          defending the output directly.
        </p>
      </div>

      <div className="bg-slate-50 border-l-4 border-slate-300 rounded-r px-4 py-3 my-2">
        <p className="font-semibold text-slate-800 text-sm">
          If the ROI looks too good, check the inputs.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          The tool is conservative by design. If you are seeing a 400% three-year ROI, the pain
          point inputs are probably overstated. A credible output is more valuable than an
          impressive one.
        </p>
      </div>

    </div>
  );
}
