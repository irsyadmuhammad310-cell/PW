/* =====================================================
   FINTRACK V12.0.0: CONFIGURATION
   ===================================================== */

const FINTRACK_RELEASE = {
  version: 'v12.0.0',
  baseline: 'v11.2.2',
  type: 'architecture cleanup',
  date: '2026-07-07',
  rule: 'No UI redesign, no formula changes, no storage migration'
};

const STORAGE_KEY = 'fintrack_v10_5_state';
const STORAGE_DB = 'fintrack_v10_5_db';
const STORAGE_STORE = 'app_state';

const DEFAULT_SCHEMA = {
  Income: {
    'Employment (Net)': ['Salary', 'Overtime'],
    'Cash': ['Refund', 'Others'],
    'Dividen': ['ASB', 'TH']
  },
  Expense: {
    'Housing': ['Phone', 'Wifi', 'Utilities'],
    'Entertainment': ['Shopping', 'Dining'],
    'Gift': ['Parents', 'Friends']
  },
  Savings: {
    'Emergency Fund': ['Monthly'],
    'Investments': ['ASBN', 'Future', 'Versa', 'Saham PPK', 'Rize', 'TH', 'KWSP']
  }
};

const DEFAULT_STATE = {
  transactions: [
    { id: 1, d: '2026-01-06', t: 'Income', c: 'Employment (Net)', s: '', a: 8942, dt: 'Rate 3.16' },
    { id: 2, d: '2026-01-06', t: 'Expense', c: 'Gift', s: 'Parents', a: 300, dt: 'Bagi Ayah' }
  ],
  goals: [],
  goalPlans: [],
  budgets: {
    annualExpenseBudget: 0,
    categoryBudgets: {}
  },
  monthlyPlans: {},
  monthlyPlansByYear: {},
  preferences: {
    currency: 'RM',
    theme: 'light'
  },
  settings: {
    theme: 'light'
  },
  schema: DEFAULT_SCHEMA,
  security: {
    passkey: '1234'
  }
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const EXPENSE_BUDGET_ALIASES = {
  'Transportation': 'Transport'
};

const YEARS = [];
for (let y = 2024; y <= 2040; y++) YEARS.push(y);
