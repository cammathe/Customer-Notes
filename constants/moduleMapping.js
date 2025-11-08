// Module name mapping between Notes App and License Analyzer
export const MODULE_NAME_MAP = {
  'Electronic Bank Payments - Advanced': 'Advanced Electronic Bank Payments',
  'Account Reconciliation (EPM)': 'Account Reconciliation',
  'Close Management + Consolidations (EPM)': 'Close Management',
  'Revenue Management - Essentials': 'Revenue Management',
  'Revenue Management - Allocations': 'Revenue Allocations',
  'Contract Renewals (Deprecated)': 'Contract Renewals',
  'Corporate Tax Reporting (EPM)': 'Corporate Tax Reporting',
  'Narrative Reporting (EPM)': 'Narrative Reporting',
  'NetSuite Planning + Budgeting (EPM)': 'Planning + Budgeting',
  'SuitePeople Incentive Compensation': 'Incentive Compensation',
  'SuitePeople Payroll': 'Payroll',
  'SuitePeople Performance Management': 'Performance Management',
  'SuitePeople Workforce Management': 'Workforce Management',
  'Advanced Inventory Management': 'Inventory Management',
  'Advanced Order Management': 'Order Management',
  'Warehouse Management System': 'Warehouse Management',
  'Work in Progress + Routings': 'WIP + Routings',
  'SuiteCommerce InStore (POS)': 'SuiteCommerce InStore',
  'ACS Monitor': 'ACS',
  'ACS Optimize': 'ACS',
  'ACS Architect': 'ACS',
  'AI Consulting Services': 'AI Consulting',
  'Disaster Recovery Premium': 'Disaster Recovery',
  'LCS Standard': 'LCS',
  'LCS Premium': 'LCS',
  'Employee Users': 'Expense Reporting',
};

// Helper function to map module names
export const mapModuleName = (moduleName) => MODULE_NAME_MAP[moduleName] || moduleName;

// Helper function to get Notes App names for a given Analyzer name
export const getNotesAppNames = (analyzerName) => {
  return [
    analyzerName,
    ...Object.entries(MODULE_NAME_MAP)
      .filter(([_, mapped]) => mapped === analyzerName)
      .map(([original]) => original)
  ];
};

// Module status constants
export const MODULE_STATUS = {
  LICENSED: 'Licensed',
  OPPORTUNITY: 'Opportunity',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
};

// Valid analyzer modules list
export const VALID_ANALYZER_MODULES = [
  'CRM', 'Advanced Electronic Bank Payments', 'Intelligent Payment Automation',
  'Bill Capture', 'Procurement', 'Fixed Assets Management', 'Advanced Financials',
  'Revenue Management', 'Revenue Allocations', 'Contract Renewals', 'Rebate Management',
  'Account Reconciliation', 'Close Management', 'Multi-Book', 'Inventory Management',
  'Advanced Manufacturing', 'Demand Planning', 'WIP + Routings', 'Work Orders',
  'Quality Management', 'Grid Order Management', 'Order Management',
  'Warehouse Management', 'Smart Count', 'Logistics Connector',
  'SuiteCommerce', 'SuiteCommerce Advanced', 'SuiteCommerce InStore',
  'eCommerce Connector', 'POS Connector', 'Connector', 'Field Service',
  'SuiteProjects', 'SuiteProjects Pro', 'SuiteBilling', 'Dunning',
  'Incentive Compensation', 'Payroll', 'Performance Management',
  'Workforce Management', 'SuitePeople HR', 'OneWorld', 'e-invoicing',
  'SuiteTax', 'Corporate Tax', 'Narrative Reporting', 'NetSuite Pay',
  'SuitePayments', 'Planning + Budgeting', 'Analytics Warehouse',
  'SuiteAnalytics Connect', 'SuiteAnalytics Workbooks', 'CPQ',
  'ACS', 'AI Consulting', 'Disaster Recovery', 'LCS', 'Support - Premium',
  'NSIP', 'Sandbox', 'SuiteCloud+', 'Compliance360', 'Project Management',
  'Expense Reporting'
];
