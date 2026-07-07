/* =====================================================
   FINTRACK V12.0.0: HELPER FUNCTIONS
   ===================================================== */

/* Format Currency */
const fmt = (n) =>
  'RM ' +
  Math.abs(n).toLocaleString('en-MY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

const fmtSigned = (n) => (n < 0 ? '-' : '') + fmt(n);

/* Toast Notification */
function toast(m) {
  const t = document.getElementById('toast');
  t.textContent = m;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

/* Save and Chart Lifecycle */
async function saveState() {
  await storageService.set(state);
}

function scheduleSave() {
  saveState();
}

function destroyCharts() {
  charts.forEach((ch) => {
    try {
      ch.destroy();
    } catch (e) {}
  });
  charts = [];
}

function syncDerivedModules() {
  render();
}

/* Theme Helpers */
function getThemeTextColor() {
  return document.documentElement.dataset.theme === 'dark'
    ? 'rgba(255,255,255,0.5)'
    : 'rgba(0,0,0,0.5)';
}

function getThemeGridColor() {
  return document.documentElement.dataset.theme === 'dark'
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(0,0,0,0.1)';
}

/* Financial Summary Helpers */
function getTransactionsForYear(year) {
  return state.transactions.filter((t) => new Date(t.d).getFullYear() === year);
}

function getMonthlyData(year) {
  const yearTx = getTransactionsForYear(year);
  return MONTH_NAMES.map((_, monthIdx) => {
    const monthTx = yearTx.filter((t) => new Date(t.d).getMonth() === monthIdx);
    const i = monthTx.filter((t) => t.t === 'Income').reduce((s, t) => s + t.a, 0);
    const e = monthTx.filter((t) => t.t === 'Expense').reduce((s, t) => s + t.a, 0);
    const s = monthTx.filter((t) => t.t === 'Savings').reduce((s, t) => s + t.a, 0);
    return { i, e, s };
  });
}

function getCategoryBudget(category) {
  const alias = EXPENSE_BUDGET_ALIASES[category] || category;
  return Number(
    state.budgets?.categoryBudgets?.[alias] ||
      state.budgets?.categoryBudgets?.[category] ||
      0
  );
}

function getFilteredSummary(year, monthFilter = 'total') {
  const md = getMonthlyData(year);
  if (monthFilter === 'total') {
    return {
      income: md.reduce((s, m) => s + m.i, 0),
      expense: md.reduce((s, m) => s + m.e, 0),
      savings: md.reduce((s, m) => s + m.s, 0),
      monthly: md
    };
  }
  const monthIdx = Number(monthFilter);
  return {
    income: md[monthIdx]?.i || 0,
    expense: md[monthIdx]?.e || 0,
    savings: md[monthIdx]?.s || 0,
    monthly: md
  };
}

function getExpenseCategories(year, monthFilter) {
  const yearTx = getTransactionsForYear(year);
  let filteredTx = yearTx.filter((t) => t.t === 'Expense');

  if (monthFilter !== 'total') {
    const monthIdx = Number(monthFilter);
    filteredTx = filteredTx.filter((t) => new Date(t.d).getMonth() === monthIdx);
  }

  const grouped = {};
  filteredTx.forEach((t) => {
    if (!grouped[t.c]) grouped[t.c] = 0;
    grouped[t.c] += t.a;
  });

  return Object.entries(grouped)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
}

/* UI Functions */
function toggleTheme() {
  const h = document.documentElement;
  const d = h.dataset.theme === 'dark';
  h.dataset.theme = d ? 'light' : 'dark';
  mutateState(() => {
    state.preferences.theme = d ? 'light' : 'dark';
  });
}

function toggleSB() {
  if (window.innerWidth <= 900) {
    document.getElementById('sb').classList.toggle('open');
  }
}

function getYear() {
  return parseInt(document.getElementById('yf')?.value || new Date().getFullYear());
}
