/* =====================================================
   FINTRACK V12.0.0: STATE MANAGEMENT
   ===================================================== */

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
let nxId = 100;
let curPage = 'dashboard';
let txnPg = 1;
let editId = null;
let pendAct = null;
let authAtt = 0;
let lockUntil = 0;
let charts = [];
let transactionViewInitialized = false;
let goalPlannerYear = null;
let goalChartMode = 'progress';
let goalFilter = 'all';
let goalSort = 'priority';
let goalSearch = '';
let goalLockUntil = 0;
let goalAuthAtt = 0;
let goalBudgetPendAction = null;
let goalPendAct = null;

/* Deep Merge Helper */
function deepMerge(base, extra) {
  if (Array.isArray(base)) {
    return Array.isArray(extra) ? extra : base;
  }
  const output = { ...base };
  Object.keys(extra || {}).forEach((k) => {
    if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) {
      output[k] = deepMerge(base[k], extra[k]);
    } else {
      output[k] = extra[k];
    }
  });
  return output;
}

/* Clone Helper */
function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

/* Normalize State */
function normalizeState(raw) {
  const merged = deepMerge(clone(DEFAULT_STATE), raw || {});
  merged.transactions = (merged.transactions || []).map((t) => ({
    id: Number(t.id),
    d: String(t.d),
    t: String(t.t),
    c: String(t.c),
    s: String(t.s || ''),
    a: Number(t.a),
    dt: String(t.dt || '')
  }));
  return merged;
}

/* Monthly Plan Helpers */
function makeEmptyMonthlyPlan() {
  const next = {};
  MONTH_NAMES.forEach((_, idx) => {
    next[idx] = { income: 0, expense: 0, savings: 0 };
  });
  return next;
}

function normalizeMonthlyPlanShape(plan) {
  const base = makeEmptyMonthlyPlan();
  Object.keys(base).forEach((idx) => {
    base[idx] = {
      income: Number(plan?.[idx]?.income || 0),
      expense: Number(plan?.[idx]?.expense || 0),
      savings: Number(plan?.[idx]?.savings || 0)
    };
  });
  return base;
}

function normalizeMonthlyPlansByYear(byYear, legacy) {
  const next = {};
  YEARS.forEach((year) => {
    next[year] = normalizeMonthlyPlanShape(
      byYear?.[year] || (year === 2026 ? legacy : null) || {}
    );
  });
  return next;
}

/* State Mutation Helper */
function mutateState(mutator, { save = true, rerender = true } = {}) {
  mutator();
  if (save) scheduleSave();
  if (rerender) syncDerivedModules();
}
