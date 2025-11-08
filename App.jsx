import React, { useState, useEffect } from 'react';

import { Plus, Trash2, Users, FileText, ChevronDown, ChevronRight, X, Globe, Folder, Package, Info, Brain, Upload, Download, Table, UserPlus, BookOpen } from 'lucide-react';

// Constants
import { MODULE_NAME_MAP, mapModuleName, getNotesAppNames, MODULE_STATUS, VALID_ANALYZER_MODULES } from './constants/moduleMapping';

// Field configurations

const GENERAL_FIELDS = [

  // Row 1

  { id: 'industry', label: 'Industry', type: 'text', row: 1 },

  { id: 'annualBudget', label: 'Annual Budget', type: 'currency', row: 1 },

  { id: 'employees', label: '# of Employees', type: 'number', row: 1, maxLength: 5 },

  // Row 2

  { id: 'customerNumber', label: 'Customer #', type: 'text', row: 2 },

  { id: 'acquisition', label: 'Acquisition', type: 'date', row: 2 },

  { id: 'arr', label: 'ARR', type: 'currency', row: 2 },

  // Row 3

  { id: 'baseSKU', label: 'Base SKU', type: 'text', row: 3 },

  { id: 'tier', label: 'Tier', type: 'text', row: 3 },

  { id: 'subs', label: 'Subs', type: 'text', maxLength: 3, row: 3 },

  { id: 'cc', label: 'C/C', type: 'text', maxLength: 3, row: 3 }

];

const NONPROFIT_FIELDS = [

  { id: 'mission', label: 'Mission', type: 'textarea' },

  { id: 'volunteers', label: '# of Volunteers', type: 'text' },

  { id: 'proBonoEligibility', label: 'Pro Bono Eligibility', type: 'select', options: ['Yes', 'No', 'Determination Pending'] },

  { id: 'federallyFunded', label: 'Federally Funded', type: 'select', options: ['Yes', 'No', 'Unknown'] }

];



const HEALTH_CHECK_FIELDS = [

  { 

    id: 'serviceTier', 

    label: 'Service Tier',

    tooltip: 'Right-Sized Capacity: Health checks help ensure your NetSuite account is on the appropriate service tier, so you have enough resources to support your business operations without overpaying for unused capacity or risking performance issues during peak times.'

  },

  { 

    id: 'concurrency', 

    label: 'Concurrency',

    tooltip: 'Sufficient Concurrency for Integrations: By reviewing your concurrency limits, you can confirm that your integrations and automated processes run smoothly without hitting system bottlenecks, which helps prevent delays, errors, or failed data transfers.'

  },

  { 

    id: 'platform', 

    label: 'Platform',

    tooltip: 'Optimal Customization Level: Health checks assess your customizations to make sure they are efficient and not causing unnecessary complexity or performance slowdowns. This helps maintain system stability, makes future upgrades easier, and ensures your NetSuite environment remains scalable as your business grows.'

  }

];



const LINK_FIELDS = [

  { id: 'nsRecord', label: 'NetSuite Record' },

  { id: 'website', label: 'Website' },

  { id: 'linkedIn', label: 'LinkedIn Profile' }

];



const TASK_FIELDS = [

  { id: 'taskUpdateSC', label: 'Update SC Request' },

  { id: 'taskConfirmOpps', label: 'Confirm Opps/PQLs' },

  { id: 'taskUploadDiscovery', label: 'Discovery Navigator' },

  { id: 'taskLastTellEmail', label: 'Last Tell Email' },

  { id: 'taskFollowUps', label: 'Follow-Ups' }

];



const MODULE_TYPES = ['AI', 'Module', 'Connector', 'Subscription', 'User', 'SuiteApp'];

const TASK_STATUSES = ['', 'Not Started', 'In Progress', 'Complete', 'N/A'];

const STATUS_COLORS = { green: 'bg-[#86B596] border-[#86B596]', yellow: 'bg-[#E2C06B] border-[#E2C06B]', red: 'bg-[#C74364] border-[#C74364]', black: 'bg-zinc-900 border-zinc-500' };

const RATING_COLORS = { green: 'text-[#86B596]', yellow: 'text-[#E2C06B]', red: 'text-[#C74364]', black: 'text-zinc-400' };



const INITIAL_MODULE_LIBRARY = {
  'CRM + Marketing': [
    { name: 'Compliance360', type: 'Module', overview: 'Keeping up with ever-changing regulations like HIPAA, along with maintaining audit-ready records, can be overwhelming and risky for any organization handling sensitive data. NetSuite Compliance360 automates compliance tracking, documentation, and reporting - including HIPAA requirements, reducing manual effort and human error. AI is used for automated compliance monitoring and flagging potential risks or anomalies in regulatory processes.', link: 'https://oracle.seismic.com/Link/Content/DCh34DdGP6bG38FD7gTWPPV3bXD8', prerequisites: 'NetSuite OneWorld Cloud Service or NetSuite Subsidiary Management required. Customerâ€™s use of NetSuite Compliance 360 Cloud Service is limited to a single instance of Cloud Services. If Customer wants to retain the NetSuite Compliance 360 Cloud Service User Activity logs for longer than twelve (12) months, Customer must export such User Activity logs from NetSuite Compliance 360 Cloud Service and store them separately. You cannot access the NetSuite AI Connector when you have Compliance360.' },
    { name: 'CRM', type: 'Module', overview: 'Many businesses struggle with fragmented customer data, missed sales opportunities, and inconsistent customer experiences. NetSuite CRM solves this by centralizing all customer interactions, automating sales processes, and providing real-time insights into your pipeline and relationships. AI-driven lead scoring, sales forecasting, and recommended next actions help prioritize opportunities and automate follow-ups.', link: 'https://oracle.seismic.com/Link/Content/DCVT3Bmc2RcHH87CBDcRXbcgdJQB' },
    { name: 'Outlook Connector', type: 'Connector', overview: 'Switching between your email and NetSuite to log communications or update records can slow your team down and lead to missed details. The Outlook Connector seamlessly links your Outlook inbox with NetSuite, letting you save emails, create or update records, and sync calendars and contacts, all without leaving your email.', link: '' },
    { name: 'Salesforce Connector', type: 'Connector', overview: 'Managing customer data in both Salesforce and NetSuite can lead to duplicate entry, data silos, and missed opportunities. The Salesforce Connector automatically syncs leads, contacts, opportunities, and transactions between Salesforce and NetSuite, ensuring both systems are always up to date.', link: 'https://oracle.sharepoint.com/sites/solutionconsultingcentral/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2Fsolutionconsultingcentral%2FShared%20Documents%2FProduct%2FNetSuite%20Connectors%2FAll%20NS%20Connectors%2FSpecific%20Connector%20Assets%2FNetSuite%20Connector%20for%20Salesforce&viewid=c0097a08%2D522e%2D453b%2D9670%2Dc10499aeb2be&ga=1', prerequisites: 'Maximum of one (1) NetSuite Connector Standard Cloud Service for Salesforce per Core Suite. One (1) NetSuite Connector Standard Cloud Service for Salesforce per one (1) Salesforce Org. Can only be connected to Salesforce and Core Suite production accounts. Only available for the pre-defined integration syncs. Requires NetSuite OneWorld Cloud Service and Salesforce Enterprise or Salesforce Developer Edition.' }
  ],
  'Procurement': [
    { name: 'Bill Capture', type: 'Module', overview: 'Manual invoice entry is slow, error-prone, and ties up your AP team. Bill Capture uses AI to automatically extract and enter invoice data, streamlining your accounts payable process so you save time, reduce errors, and accelerate your payables workflow.', link: 'https://oracle.seismic.com/Link/Content/DCH8DXDhhdbJPGFQBcVJ2GWWpVMd' },
    { name: 'Electronic Bank Payments', type: 'SuiteApp', overview: 'Processing payments manually is slow, error-prone, and can delay your relationships with vendors and partners. NetSuite Electronic Bank Payments automates the entire payment process by allowing you to generate, approve, and transmit electronic payments, such as ACH, EFT, SEPA, and wire transfers, directly from NetSuite to your bank.', link: 'https://oracle.seismic.com/Link/Content/DCWcDc4HqGcGTG4Wfjq878Wf3Pcj' },
    { name: 'Electronic Bank Payments - Advanced', type: 'SuiteApp', overview: 'When your payment needs get more complex, Advanced Electronic Bank Payments takes automation to the next level. In addition to all the core features, it supports advanced payment file formats, multi-bank and multi-currency processing, custom payment batching, and country-specific banking requirements.', link: 'https://oracle.seismic.com/Link/Content/DCWcDc4HqGcGTG4Wfjq878Wf3Pcj' },
    { name: 'Fixed Assets Management', type: 'Module', overview: 'Managing fixed assets manually or across disconnected systems often leads to errors, compliance risks, and wasted time. NetSuite Fixed Assets Management automates the entire asset lifecycle, from acquisition to depreciation and retirement, directly within your ERP.', link: 'https://oracle.seismic.com/Link/Content/DCf9V8Wdg8FT9GFQcFVbXJVpDqpV' },
    { name: 'Intelligent Payment Automation', type: 'SuiteApp', overview: 'Manual payment processing is time-consuming, risky, and buries your AP team in busywork. Intelligent Payment Automation uses AI to automatically schedule, approve, and execute payments based on your business rules, transforming how you manage cash flow.', link: 'https://www.netsuite.com/portal/products/erp/financial-management/finance-accounting/accounts-payable-software/payment-automation.shtml', prerequisites: 'Can only be deployed in one (1) production environment. Only available to Customers located in the U.S. Payments can only be made to vendors located in the U.S. and only In U.S. dollars. Bank account connectivity is subject to change based upon BILL and participating financial institutions. Activation of NetSuite Intelligent Payment Automation Cloud Service is subject to successful approval and onboarding from BILL.' },
    { name: 'Payment Automation', type: 'Module', overview: 'Manual payment processes are slow, error-prone, and can lead to missed or duplicate payments. Payment Automation streamlines and automates your entire payment cycle, from approval to execution, reducing errors, improving cash flow, and freeing up your finance team for higher-value work.', link: 'https://oracle.seismic.com/Link/Content/DCmmBQ6FXdbqbGTMcm4jRqhVpPJj', prerequisites: 'Limited to one (1) production environment. Activation of Payment Automation service is subject to successful onboarding and credit approval from HSBC.' },
    { name: 'Procurement', type: 'Module', overview: 'Many businesses struggle with manual, disconnected purchasing processes that lead to overspending, lack of visibility, and slow approvals. NetSuite Procurement streamlines and automates the core purchasing workflowâ€”think requisitions, purchase orders, and vendor management, right within your ERP.', link: 'https://oracle.seismic.com/Link/Content/DCXFDbJQb9HBR8qBbJR8V3hJb4dd' },
    { name: 'SuiteProcurement', type: 'Module', overview: 'Managing indirect procurement for things like office supplies, IT services, and facility expenses across multiple departments or locations can quickly become chaotic, leading to maverick spending, lack of visibility, and missed savings. NetSuite SuiteProcurement centralizes and automates the entire indirect procure-to-pay process.', link: 'https://oracle.seismic.com/Link/Content/DCdVq6G24DBVQ82FjCT27hC8hC7j', prerequisites: 'Only Employee Self-Serve users may access NetSuite SuiteProcurement Cloud Service. NetSuite Suite Procurement Cloud Service is only available for use with specified Trading Partners and only in the United States and Canada. Customer, including Customer subsidiaries, must be located in the United States and/or Canada to use NetSuite SuiteProcurement Cloud Service. Requires NetSuite Procurement Mid-Market Cloud Service if Customers plan to use purchase requisitions within SuiteProcurement and/or connect to non-integrated trading partners.' },
    { name: 'Transaction Email Capture', type: 'SuiteApp', overview: 'Capturing transaction details from emails and entering them into NetSuite is slow and error-prone. NetSuite Transaction Email Capture works with Bill Capture to enable employees and vendors to send vendor bills directly through email.', link: 'https://oracle.seismic.com/Link/Content/DCBHg2BggBBBjGVVTXGj8QGcTc7d' },
    { name: 'Transaction Line Distribution', type: 'SuiteApp', overview: 'Splitting transaction amounts across multiple accounts or departments can be a manual nightmare. NetSuite Transaction Line Distribution automates the allocation of transaction lines based on your rules, with AI-powered suggestions to optimize distributions and flag inconsistencies.', link: 'https://oracle.seismic.com/Link/Content/DCqq4VRHMDdCqG8TRRhCX9JGbG2q' }
  ],
  'Accounting + Reconciliations': [
    { name: 'Account Reconciliation (EPM)', type: 'Module', overview: 'Manual reconciliations are tedious, slow, and prone to mistakes, delaying your close and increasing risk. NetSuite Account Reconciliation automates matching, exception management, and certification, so you reconcile accounts faster and with greater accuracy.', link: 'https://oracle.seismic.com/Link/Content/DCjJmTDj8BdT387WHdfR7f3q3b6j' },
    { name: 'Advanced Financials', type: 'Module', overview: 'As your business grows, managing finances with disconnected tools leads to inefficiencies, errors, and limited visibility. NetSuite Financial Management Cloud Service unifies core accounting, financial reporting, compliance, and analytics in one secure cloud platform.', link: 'https://oracle.seismic.com/Link/Content/DCB9XBdHR76dpGMHJfFfWgBDCBFG' },
    { name: 'Auto Bank Statement Import', type: 'SuiteApp', overview: 'If your bank doesn\'t support direct feeds or you need to work with specific statement files, Auto Bank Statement Import is your solution. This tool automates the upload and processing of bank statement files, like CSV, OFX, or BAI2, directly into NetSuite.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_159296303155.html' },
    { name: 'Bank Feeds', type: 'SuiteApp', overview: 'Manually entering or uploading bank transactions is tedious and can lead to delays or errors. NetSuite Bank Feeds automates this process by connecting directly to your bank accounts and pulling in transactions daily with no files, no manual steps.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_158079179132.html' },
    { name: 'Close Management + Consolidations (EPM)', type: 'Module', overview: 'Month-end close and consolidations across entities can drag on for weeks, with manual reconciliations and inconsistent data. NetSuite Close Management and Consolidations automates and standardizes the close process, delivering real-time consolidated financials and audit-ready records.', link: 'https://oracle.seismic.com/Link/Content/DC6DMPMC922bTGmRq3Hc4QRTTM8B' },
    { name: 'Financial Exception Management', type: 'AI', overview: 'Identifying errors and anomalies in your financial data can be overwhelming, often buried under thousands of transactions and reports. Financial Exception Management uses AI to automatically surface unusual activity and potential issues in real time.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdde69e6ba7-b385-a79c-143c-c5822402e215%252Flfab7abf7c-18d0-48ab-a6ba-0a9bdfad6186//' },
    { name: 'Multi-Book', type: 'Module', overview: 'Juggling multiple accounting standards or reporting requirements in spreadsheets is complex and error-prone. NetSuite Multi-Book lets you manage parallel books for different standards like GAAP, IFRS, or tax, within a single system.', link: 'https://oracle.seismic.com/Link/Content/DCJQ7CgggcRQ78mVDGR8cg3V3p43', prerequisites: 'Comes with OneWorld.' },
    { name: 'OneWorld', type: 'Module', overview: 'Expanding globally or managing multiple subsidiaries can create chaos with disconnected systems and inconsistent data. NetSuite OneWorld unifies your global operations, across currencies, languages, and tax rules, on a single platform.', link: 'https://oracle.seismic.com/Link/Content/DCGGFMFW2hf4bG7Hd2qcj7Hfhjgj', prerequisites: 'Includes one (1) country/currency combination. If Customer requires additional new country/currency combinations, Customer must separately purchase NetSuite OneWorld Additional Country/Currency Cloud Service. Up to 250 subsidiaries in your OneWorld account, regardless of the number of country/currency combinations Customer purchases (inactive and elimination subsidiaries do not count toward the limit). Subsidiaries in excess of 250 are subject to review and approval by Oracle based on system configuration and may be subject to additional fees. ' },
    { name: 'SuiteTax', type: 'Module', overview: 'Managing sales tax, VAT, and other indirect taxes across multiple states or countries can be a real headache. SuiteTax automates tax calculation, determination, and reporting directly within NetSuite, no matter how complex your tax landscape is.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdd229cbac6-82e9-3b9b-13a4-5547ff3ffa15%252Flf9c2a19c8-0fcc-4398-9568-17c57d6d9130//?anchorId=eafa47a1-101d-4dd4-a9dd-1ec3b7603e4a', prerequisites: 'Once enabled cannot be disabled. ' }
  ],
  'Revenue Recognition': [
    { name: 'Contract Renewals (Deprecated)', type: 'Module', overview: 'Manual contract processes often lead to lost documents, missed renewals, and compliance headaches. NetSuite Contract Renewals centralizes contracts, automates renewals, and ensures compliance, giving you control, visibility, and efficiency.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5098ca17-f349-48e6-b528-8b6fa8f2b8f8%252Fddeeb98017-5c91-4f17-a82f-9101d5104d8a%252Flf654abcc6-8f2f-49b1-9b83-fdf3a1c642b2//' },
    { name: 'Rebate Management', type: 'Module', overview: 'Tracking and managing rebates manually is tedious and often leads to missed opportunities or overpayments. NetSuite Rebate Management automates rebate calculations, accruals, and payments, giving you real-time visibility into rebate programs and profitability.', link: 'https://oracle.seismic.com/Link/Content/DCTqHXc9Rf729G22pmT62cjJWWcj' },
    { name: 'Revenue Management - Essentials', type: 'Module', overview: 'Manual revenue recognition and compliance with evolving standards can be overwhelming and risky. NetSuite Revenue Management Essentials automates the entire revenue lifecycle so you can manage even complex revenue streams with confidence.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdda9a0c306-8b72-c4d8-65f4-507086c51d77%252Flf705e2c80-9b17-4ddd-b31b-a3e2e8750179//' },
    { name: 'Revenue Management - Allocations', type: 'Module', overview: 'When your business deals with complex contracts involving multiple performance obligations, allocating revenue correctly is a major challenge. NetSuite Revenue Management Allocations builds on Revenue Management Essentials by automating the allocation of transaction prices across bundled products and services.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5098ca17-f349-48e6-b528-8b6fa8f2b8f8%252Fddeeb98017-5c91-4f17-a82f-9101d5104d8a%252Flf1d9bb5da-04d0-4a74-83d6-b62b7f2ed14a//' }
  ],
  'Invoicing + Payment Processing': [
    { name: 'Dunning', type: 'Module', overview: 'Chasing overdue payments manually is time-consuming and often ineffective, leading to cash flow issues and strained customer relationships. NetSuite Dunning automates the entire collections process with customizable reminder schedules, escalating communications, and real-time tracking.', link: 'https://oracle.seismic.com/Link/Content/DC28mPp37274CGqJDcCjFjqfJ7VG' },
    { name: 'e-invoicing', type: 'Module', overview: 'Staying compliant with ever-evolving e-invoicing mandates across different countries can be a major headache. NetSuite E-Invoicing automates the entire invoicing process while ensuring your invoices meet local regulatory requirements.', link: 'https://oracle.seismic.com/Link/Content/DCW82gMpCFTbCGHBDTfXBGMbQ79P' },
    { name: 'Online Donations', type: 'SuiteApp', overview: 'Managing online donations across multiple channels can be chaotic and hard to reconcile. NetSuite Online Donations provides a seamless, branded giving experience for your donors, letting you accept and process online donations directly from your website.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_164794383122.html' },
    { name: 'NetSuite Pay', type: 'Module', overview: 'Managing payments across multiple platforms is inefficient and can lead to errors or missed opportunities for savings. NetSuite Pay brings payment processing directly into your NetSuite environment, allowing you to accept and reconcile payments from customers seamlessly.', link: 'https://oracle.seismic.com/Link/Content/DCPFVqB9PP4378HR94pTq3GhGp4V', prerequisites: 'Activation of NetSuite Pay Cloud Service is subject to entry into a merchant agreement with Versapay and successful onboarding and credit approval from Versapay. In order to utilize the NetSuite Pay Cloud Service, the NetSuite and Versapay accounts must be linked.' },
    { name: 'SuiteBilling', type: 'Module', overview: 'Subscription and usage-based billing models are complex to manage with spreadsheets or basic systems. NetSuite SuiteBilling automates the entire billing lifecycle, from one-time invoices to recurring and usage-based charges.', link: 'https://oracle.seismic.com/Link/Content/DC6QV4QR6jJD9GfTPBf88D3VGmTd' },
    { name: 'SuitePayments', type: 'Module', overview: 'Accepting customer payments quickly and securely is critical for healthy cash flow. SuitePayments is NetSuite\'s native solution for accepting and processing payments, supporting credit cards, ACH, digital wallets, and more - all fully PCI-compliant.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%25252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%25252Fdd6d7309c1-5295-1556-8494-582a7f36060b%25252Flf9e7a9b45-af76-4ff4-8201-f5ff3cb7de61//?mode=view&searchId=ca5701af-0752-4eb1-87f7-c3a64f9b6591' }
  ],
  'Grant + Project Management': [
    { name: 'Field Service Management', type: 'Module', overview: 'Coordinating field teams, work orders, and customer service in spreadsheets or disconnected apps leads to missed appointments and unhappy customers. NetSuite Field Service Management centralizes scheduling, dispatch, work order management, and mobile access for technicians.', link: 'https://oracle.seismic.com/Link/Content/DC4bfVdX3BD42GhMgHT8F86mgmgP' },
    { name: 'Indirect Cost Allocations for Grants', type: 'SuiteApp', overview: 'Calculating and applying indirect costs to grants is complex and often leads to compliance headaches. NetSuite Indirect Cost Allocations for Grants automates the calculation and allocation of indirect costs based on your organization\'s approved rates and rules.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_3172350008.html' },
    { name: 'Grants Management', type: 'SuiteApp', overview: 'Juggling grant applications, compliance, and reporting in spreadsheets can lead to missed deadlines and lost funding. NetSuite Grant Management centralizes the entire grant lifecycle, from application to award tracking and compliance.', link: 'https://oracle.seismic.com/Link/Content/DCmH9Pc4b38dF8qRPDmh8gph7BbG', prerequisites: 'Requires either NetSuite OneWorld Cloud Service or NetSuite Subsidiary Management.' },
    { name: 'Project Management', type: 'Module', overview: 'Juggling project tasks and deadlines in spreadsheets or email can lead to confusion, missed milestones, and lack of accountability. NetSuite Basic Project Management gives you essential tools to create projects, assign tasks, set deadlines, and track progress.', link: 'https://oracle.seismic.com/Link/Content/DC9QjMPfT2jC9GmTq3DBR7ccJVj8' },
    { name: 'SuiteProjects', type: 'Module', overview: 'Managing projects, resources, and billing in separate systems creates silos and delays. NetSuite SuiteProjects brings project management, resource allocation, time tracking, and billing together in one unified solution.', link: 'https://oracle.seismic.com/Link/Content/DC6c9c3MRHHhdGhVHmbRWppbdfVB' },
    { name: 'SuiteProjects Pro', type: 'Module', overview: 'For organizations with complex project needs, basic project management tools aren\'t enough. SuiteProjects Pro builds on SuiteProjects with advanced features like project budgeting, forecasting, multi-currency support, and deep analytics.', link: 'https://oracle.seismic.com/Link/Content/DCmqVJXJFX39287HGVV7mqCP7QB8' }
  ],
  'Planning Analysis + Reporting': [
    { name: 'Cash360', type: 'SuiteApp', overview: 'Managing cash flow with spreadsheets or disconnected tools can leave you guessing about your true financial position. NetSuite Cash 360 gives you a real-time, interactive dashboard that brings together all your cash inflows, outflows, bank balances, and forecasts in one place.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_164863634930.html' },
    { name: 'Corporate Tax Reporting (EPM)', type: 'Module', overview: 'Staying on top of ever-changing tax regulations and manual reporting is time-consuming and risky. NetSuite Corporate Tax Reporting automates tax calculations, compliance, and filing, ensuring accuracy and reducing audit risk.', link: 'https://oracle.seismic.com/Link/Content/DCDQWDdmJcRfH8MFDcTmMQJF7Fj8' },
    { name: 'Intelligent Performance Management', type: 'AI', overview: 'Traditional performance management often relies on static reports and backward-looking data. Intelligent Performance Management leverages AI to continuously monitor your business metrics, predict outcomes, and recommend actions.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdde69e6ba7-b385-a79c-143c-c5822402e215%252Flfab7abf7c-18d0-48ab-a6ba-0a9bdfad6186//' },
    { name: 'Narrative Reporting (EPM)', type: 'Module', overview: 'Traditional financial reports can be hard to interpret and even harder to collaborate on. NetSuite Narrative Reporting lets you combine financial data with narrative commentary, visuals, and collaborative workflows.', link: 'https://oracle.seismic.com/Link/Content/DCc9WghFqbjT68hRcXDWJDgcX3p8' },
    { name: 'NetSuite Planning + Budgeting (EPM)', type: 'Module', overview: 'Planning and budgeting in spreadsheets is slow, error-prone, and tough to scale. NetSuite Planning and Budgeting automates forecasting, budgeting, and scenario modeling, with real-time collaboration, version control, and AI-driven predictive analytics.', link: 'https://oracle.seismic.com/Link/Content/DChQQTDpj8bm38QPWpmCCdQTdhjB' },
    { name: 'NSPB Smart View', type: 'SuiteApp', overview: 'Finance teams often face the challenge of working with disconnected spreadsheets and manual processes. NSPB Smart View integrates NetSuite Planning and Budgeting with Excel, allowing teams to analyze real-time financial data directly within Excel.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_5032640042.html' },
    { name: 'Profitability + Cost Management (EPM)', type: 'Module', overview: 'Understanding true profitability and controlling costs is tough when data is scattered and reporting is manual. NetSuite Profitability and Cost Management Reporting gives you detailed, real-time insights into margins, cost drivers, and performance.', link: 'https://oracle.seismic.com/Link/Content/DCgcB43p4RPWhG92M4Cm7WqmCc8P' },
    { name: 'PCM Agent', type: 'AI', overview: 'Building and maintaining complex business models in enterprise systems can be time-consuming and error-prone. PCM Agent leverages Generative AI to serve as a guided natural language assistant, enabling users to create models, rule sets and rules.', link: 'https://docs.oracle.com/en/cloud/saas/enterprise-profitability-cost-management-cloud/pcmpl/about_pcm_agent.html' }
  ],
  'Analytics': [
    { name: 'Analytics Warehouse', type: 'Module', overview: 'Siloed data makes it tough to get a true picture of your business. NetSuite Analytics Warehouse is a cloud-based data warehouse that automatically consolidates NetSuite and third-party data, then uses AI-powered analytics and visualizations. New feature: Infographic Visualizations - AI-assisted transformation of data into visual summaries and interactive slides using infographics powered by Oracle Analytics Cloud.', link: 'https://oracle.seismic.com/Link/Content/DCcCgM8g8HD83GHDh3hX8f98CVBB' },
    { name: 'SuiteAnalytics Assistant', type: 'AI', overview: 'Building reports and dashboards can be daunting, especially if you\'re not a data expert. SuiteAnalytics Assistant uses AI to help you create, customize, and interpret analytics with simple, conversational prompts.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdde69e6ba7-b385-a79c-143c-c5822402e215%252Flfab7abf7c-18d0-48ab-a6ba-0a9bdfad6186//' },
    { name: 'SuiteAnalytics Connect', type: 'Connector', overview: 'Getting data out of NetSuite for custom reporting or integration can be a challenge. SuiteAnalytics Connect gives you secure, real-time ODBC, JDBC, and ADO.NET connections to your NetSuite data.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdda9a0c306-8b72-c4d8-65f4-507086c51d77%252Flffa16a02d-35a6-496b-bad3-c7af50dcccca//?anchorId=ef95fb70-763d-42c0-a255-4b7b64a01843' },
    { name: 'Subscription Metrics', type: 'SuiteApp', overview: 'Managing subscription performance starts with tracking KPIs and metrics to see what’s driving revenue today and predicting where customers are headed tomorrow. NetSuite Subscription Metrics gives you instant visibility into the KPIs that matter. A clear dashboard with out-of-the-box SaaS metrics helps you move quickly from understanding performance to taking action. By assessing growth quality, unit economics, and retention across segments, you get a shared, reliable view for planning and forecasting. With constant-currency and full historical context, you can replace manual reporting with real-time, trusted metrics and focus on strategies to drive growth. And automation is key—manual tracking and reporting don’t scale, and they can slow decision-making, obscure revenue drivers, and erode forecast confidence.', link: 'https://oracle.seismic.com/app?ContentId=aa145992-305c-4caa-ad00-cd2828309d5e#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdda9a0c306-8b72-c4d8-65f4-507086c51d77%252Flfa668abf1-69d1-4f47-a5ee-5e4698ff2d69/grid/', prerequisites: 'NetSuite 2025.2 or higher, OneWorld account, and SaaS Metrics, Advanced Billing features enabled, & Multi-Currency and Currency Exchange Rate features (if multi-currency is needed).' },
    { name: 'NSAW Multi-Instance Connector', type: 'Connector', overview: 'NetSuite Analytics Warehouse Multi-Instance Connector expands the capabilities of NetSuite Suite Analytics Connect Cloud Service to allow Customers to share Customer Data included in their NetSuite ERP Cloud Service to a separately licensed NetSuite Analytics Warehouse Cloud Service', link: 'https://www.oracle.com/a/ocom/docs/netsuite-cloud-services-sd.pdf' }
  ],
  'HR + Payroll': [
    { name: 'Labor Expense Allocations', type: 'SuiteApp', overview: 'Manually allocating labor costs across projects, departments, or grants is tedious and error-prone. NetSuite Labor Expense Allocations automates the process, using rules and AI-driven suggestions to distribute payroll and labor expenses accurately.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_159118277665.html' },
    { name: 'SuitePeople HR', type: 'Module', overview: 'Managing HR data in disconnected systems leads to inefficiencies and compliance risks. SuitePeople HR centralizes employee records, onboarding, time-off management, and HR workflows right within NetSuite.', link: 'https://oracle.seismic.com/Link/Content/DCMb8pCjJBXWC8CBcGfTb7jbQj4G', prerequisites: 'Available in the United States, Canada, United Kingdom, Ireland, Belgium, Denmark, Spain, Finland, France, Germany, Netherlands, Norway, Sweden and Israel. Use of NetSuite SuitePeople HR Cloud Service requires that all Active employees have access to the Employee Center.' },
    { name: 'SuitePeople Incentive Compensation', type: 'Module', overview: 'Manually calculating commissions and bonuses is time-consuming and often leads to disputes. SuitePeople Incentive Compensation automates the entire process, from plan design to calculation and payout.', link: 'https://oracle.seismic.com/Link/Content/DCDDQMqW94BW9G7G2XqT39bmMG9P' },
    { name: 'SuitePeople Payroll', type: 'Module', overview: 'Payroll errors and compliance headaches can drain resources and hurt employee trust. SuitePeople Payroll automates payroll processing, tax calculations, and filings for both employees and contractors.', link: 'https://oracle.seismic.com/Link/Content/DCMb8pCjJBXWC8CBcGfTb7jbQj4G', prerequisites: 'Available to U.S. based employees only (tax calculations are only available for jurisdictions within the U.S. and Puerto Rico.) Use of NetSuite SuitePeople US Payroll Cloud Service requires that all Unique Employees have access to the Employee Center. Customerâ€™s Core Suite must reside in a U.S. data center; and Customer must use NetSuite SuitePeople US Payroll Cloud Service for tax processing services and payment solutions.' },
    { name: 'SuitePeople Performance Management', type: 'Module', overview: 'Tracking goals, feedback, and reviews in spreadsheets makes it hard to drive employee growth and engagement. SuitePeople Performance Management streamlines goal setting, continuous feedback, and performance reviews.', link: 'https://oracle.seismic.com/Link/Content/DCMb8pCjJBXWC8CBcGfTb7jbQj4G', prerequisites: 'Customer must have NetSuite SuitePeople HR Cloud Service to use NetSuite SuitePeople Performance Management Cloud Service.' },
    { name: 'SuitePeople Workforce Management', type: 'Module', overview: 'Coordinating schedules, tracking time, and managing labor costs can be a logistical nightmare. SuitePeople Workforce Management automates scheduling, time tracking, attendance, and labor compliance.', link: 'https://oracle.seismic.com/Link/Content/DCMb8pCjJBXWC8CBcGfTb7jbQj4G', prerequisites: 'Available to Customers located in the United States, Canada, Australia, and New Zealand. Biometric / Fingerprint functionality is only available for use with Microsoft Windows. Use of NetSuite SuitePeople Workforce Management Cloud Service requires that all Employed Users have access to the Employee Center.' }
  ],
  'Sales + eCommerce': [
    { name: 'eCommerce Connector', type: 'Connector', overview: 'Managing ecommerce across multiple platforms can lead to inventory errors and fulfillment headaches. NetSuite Ecommerce Connector seamlessly integrates your NetSuite ERP with leading ecommerce platforms like Shopify, Magento, and BigCommerce.', link: '' },
    { name: 'Intelligent Item Recommendations', type: 'AI', overview: 'Manually curating product recommendations is time-consuming and often misses the mark for customers. Intelligent Item Recommendations uses AI to analyze buying patterns and suggest the right products to the right customers at the right time.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdde69e6ba7-b385-a79c-143c-c5822402e215%252Flfab7abf7c-18d0-48ab-a6ba-0a9bdfad6186//' },
    { name: 'POS Connector', type: 'Connector', overview: 'Disconnected point-of-sale systems create inventory blind spots and slow down reconciliation. NetSuite POS Connector links your in-store POS systems directly to NetSuite, syncing sales, inventory, and customer data instantly.', link: '' },
    { name: 'SuiteCommerce', type: 'Module', overview: 'Launching an online store shouldn\'t require a patchwork of systems. SuiteCommerce is NetSuite\'s unified ecommerce platform, letting you quickly build and manage a mobile-friendly web store that\'s fully integrated with your ERP.', link: 'https://oracle.seismic.com/Link/Content/DCfmFWm8qf2T78CHcgDF6BqBhMMP' },
    { name: 'SuiteCommerce Advanced', type: 'Module', overview: 'For businesses with sophisticated ecommerce requirements, SuiteCommerce Advanced goes beyond the basics by offering deep customization, advanced site design, and robust APIs.', link: 'https://oracle.seismic.com/Link/Content/DCfmFWm8qf2T78CHcgDF6BqBhMMP' },
    { name: 'SuiteCommerce InStore (POS)', type: 'Module', overview: 'Bridging the gap between online and in-person shopping is key for modern retailers. SuiteCommerce InStore is a cloud-based POS solution that brings your ecommerce, inventory, and customer data to the sales floor.', link: 'https://oracle.seismic.com/Link/Content/DCfmFWm8qf2T78CHcgDF6BqBhMMP' },
    { name: 'SuiteCommerce MyAccount', type: 'Module', overview: 'Customer self-service is a win-win for both you and your clients. SuiteCommerce MyAccount gives your customers a secure portal to view orders, pay invoices, manage returns, and update account details.', link: 'https://oracle.seismic.com/Link/Content/DCfmFWm8qf2T78CHcgDF6BqBhMMP', prerequisites: 'Comes with SuiteCommerce.' }
  ],
  'Inventory + Warehouse': [
    { name: 'Advanced Inventory Management', type: 'Module', overview: 'Managing inventory manually or with basic tools often leads to stockouts, excess inventory, and missed sales. NetSuite Advanced Inventory Management automates replenishment, demand forecasting, and inventory tracking across all your locations.', link: 'https://oracle.seismic.com/Link/Content/DC3MRg9Fgd3RTGcV2gPhphMC336B' },
    { name: 'Advanced Order Management', type: 'Module', overview: 'Manual order processing can lead to delays, errors, and unhappy customers. NetSuite Advanced Order Management automates the entire order lifecycle, from order capture and allocation to fulfillment and returns.', link: 'https://oracle.seismic.com/Link/Content/DCMTbfTFJbPH38c2q28PFDTcH4MB' },
    { name: 'Grid Order Management', type: 'Module', overview: 'For businesses selling products with multiple attributes like size, color, or style, order entry can be slow and error-prone. Grid Order Management streamlines bulk and matrix ordering by letting users select multiple product variants in a single grid view.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_N3975465.html' },
    { name: 'Logistics Connector', type: 'Connector', overview: 'Coordinating shipping and logistics across multiple carriers or 3PLs can be a headache. NetSuite Logistics Connector seamlessly integrates your ERP with leading shipping providers and third-party logistics partners.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_163162017304.html' },
    { name: 'Ship Central', type: 'Module', overview: 'Shipping errors and delays can frustrate customers and eat into profits. NetSuite Ship Central streamlines your entire shipping operation with mobile picking, packing, and shipping tools, all fully integrated with your inventory.', link: 'https://oracle.seismic.com/Link/Content/DCHqbM9MgTB3V8TQGgb8CWMBbRhd', prerequisites: 'Customer must register a ShipEngine account through NetSuite Ship Central Cloud Service which includes entering into separate ShipEngine Agreement; this ShipEngine account is for exclusive use with NetSuite Ship Central Cloud Service; Customer must provide billing details directly to ShipEngine; and Customer must procure, from PrintNode, separate license(s) for PrintNode Print Driver for label printing.' },
    { name: 'Smart Count', type: 'Module', overview: 'Manual inventory counts are time-consuming, disruptive, and prone to errors. NetSuite Smart Count automates and streamlines cycle counting with mobile tools and real-time inventory updates.', link: 'https://oracle.seismic.com/Link/Content/DCQjbRBdmdbm9GQPdfhqW37XchRG' },
    { name: 'Supply Chain Control Tower', type: 'AI', overview: 'Staying ahead in today\'s supply chain means more than just tracking shipments. The Supply Chain Control Tower leverages AI to analyze data from across your entire network, automatically flagging risks, forecasting demand shifts, and recommending actions.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_1519947103.html' },
    { name: 'Warehouse Management System', type: 'Module', overview: 'Manual warehouse operations lead to lost inventory, slow fulfillment, and rising costs. NetSuite WMS automates receiving, putaway, picking, cycle counting, and more, all with mobile barcode scanning and real-time inventory visibility.', link: 'https://oracle.seismic.com/Link/Content/DCBqcFBj3TbQ88TPGVRjDGmQbR9G' }
  ],
  'Manufacturing': [
    { name: 'Advanced Manufacturing', type: 'Module', overview: 'Coordinating production, inventory, and shop floor operations with spreadsheets or disconnected systems leads to inefficiency and waste. NetSuite Advanced Manufacturing brings together production planning, scheduling, shop floor control, and quality management.', link: 'https://oracle.seismic.com/Link/Content/DCPCC7jDgdBX9G4Gg7pHDbJjbCdB' },
    { name: 'CPQ', type: 'Module', overview: 'Selling configurable or complex products can bog down your sales team with manual quoting and pricing errors. NetSuite CPQ automates product configuration, pricing, and quote generation, guiding reps through every option.', link: 'https://oracle.seismic.com/Link/Content/DC44hDhdC3839GmXF4bG4TQVHX28' },
    { name: 'Demand Planning', type: 'Module', overview: 'Guesswork in demand forecasting can result in stockouts or excess inventory. NetSuite Demand Planning uses historical sales, seasonality, and AI-driven analytics to generate accurate demand forecasts and automate replenishment plans.', link: 'https://oracle.seismic.com/Link/Content/DCdQFJdd28CJ28CQVBXGMGh2m4m8', prerequisites: 'Requires NetSuite Inventory Management Cloud Service and NetSuite Work Orders and Assemblies Cloud Service if customer plans to automatically create purchase orders and/or work orders-based supply plan.' },
    { name: 'Quality Management', type: 'Module', overview: 'Ensuring product quality can be tough when inspections and compliance checks are manual or disconnected. NetSuite Quality Management automates inspections, tracks nonconformance, and enforces quality standards right on the shop floor.', link: 'https://oracle.seismic.com/Link/Content/DCQJRQH3Xcd22GTQ6WmHmgpGGfhj' },
    { name: 'Work in Progress + Routings', type: 'Module', overview: 'Tracking production status and managing complex manufacturing steps can be overwhelming without the right tools. NetSuite Work in Progress and Routings gives you real-time visibility into every stage of production.', link: 'https://oracle.seismic.com/Link/Content/DCpfp9QjRX39pG2V8GWmVhWhJ2m8', prerequisites: 'Requires NetSuite Work Orders and Assemblies Cloud Service and NetSuite Inventory Management Cloud Service.' },
    { name: 'Work Orders + Assemblies', type: 'Module', overview: 'Coordinating work orders and assemblies manually can lead to production delays, inventory headaches, and costly mistakes. NetSuite Work Orders and Assemblies automates the entire process.', link: 'https://oracle.seismic.com/Link/Content/DCqpXCTCMQg6j87QVdgX9fTRGBpV', prerequisites: 'Requires Manufacturing Mobile SuiteApp if Customer plans to manage and execute work orders via mobile scanning devices to provide real-time visibility to their production status on the shop floor (requires separate purchase of a mobile scanning device).' }
  ],
  'Support': [
    { name: 'ACS Monitor', type: 'Subscription', overview: 'Managing your NetSuite environment requires reliable support, but not every business needs a premium package. ACS Monitor offers essential lifecycle services, including regular system health checks, release guidance, and access to NetSuite experts.', link: 'https://oracle.seismic.com/Link/Content/DCXFcPGdRJcfT8fCPdmFCVMFVR9V' },
    { name: 'ACS Optimize', type: 'Subscription', overview: 'Getting the most out of NetSuite isn\'t always straightforward, especially as your business evolves. ACS Optimize provides expert-led, proactive system reviews and tailored recommendations to fine-tune your NetSuite setup.', link: 'https://oracle.seismic.com/Link/Content/DCXFcPGdRJcfT8fCPdmFCVMFVR9V' },
    { name: 'ACS Architect', type: 'Subscription', overview: 'Complex business processes and integrations can make NetSuite customization daunting. ACS Architect gives you direct access to NetSuite solution architects who design and implement scalable, future-proof solutions.', link: 'https://oracle.seismic.com/Link/Content/DCXFcPGdRJcfT8fCPdmFCVMFVR9V' },
    { name: 'Advisor', type: 'AI', overview: 'Navigating NetSuite\'s powerful features can be overwhelming. NetSuite Advisor makes it easyâ€”just ask questions in plain language, and get instant, tailored guidance, insights, and best practices right when you need them.', link: '' },
    { name: 'AI Consulting Services', type: 'Subscription', overview: 'Unlocking the full potential of AI in NetSuite can be complex. NetSuite AI Consulting Services offers multiple levels of supportâ€”from foundational workshops and readiness assessments, to hands-on solution design.', link: '' },
    { name: 'Application Performance Management', type: 'SuiteApp', overview: 'When your business relies on critical applications, slowdowns or outages can cost you time, money, and customer trust. Application Performance Management (APM) gives you real-time visibility into how your apps are performing.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4283522055.html' },
    { name: 'Customer Success + Professional Services', type: 'Subscription', overview: 'Implementing or optimizing NetSuite can be complex. NetSuite Professional Services brings deep product expertise and proven best practices to your project, ensuring your system is set up right the first time.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5098ca17-f349-48e6-b528-8b6fa8f2b8f8%252Fddeeb98017-5c91-4f17-a82f-9101d5104d8a%252Flfd41a7f4a-f1f0-4dd7-856c-da7e97021119//?anchorId=99c02641-d884-4043-9358-3bc122ebc1c9' },
    { name: 'Disaster Recovery Premium', type: 'Subscription', overview: 'Unexpected outages or data loss can bring your business to a standstill. Premium Disaster Recovery provides advanced backup and rapid restoration capabilities, ensuring your NetSuite data and operations are protected.', link: 'https://oracle.seismic.com/Link/Content/DCWcDc4HqGcGTG4Wfjq878Wf3Pcj' },
    { name: 'Guided Learning Premium + Enterprise', type: 'Subscription', overview: 'Getting the most out of NetSuite can be challenging when users aren\'t fully trained. Guided Learning is free for licensed customers and delivers interactive, in-app training and step-by-step walkthroughs tailored to your team\'s roles.', link: 'https://oracle.seismic.com/Link/Content/DCqGqXJV4VqQb84GT8pDVmXj6gW3', prerequisites: 'Customer must procure and maintain Customer Learning Cloud Support Company Pass â€“ Premium or Enterprise subscription for the duration of the NetSuite Guided Learning Term specified on Customerâ€™s Estimate/Order Form.' },
    { name: 'Guided Learning Service Pack', type: 'Subscription', overview: 'Oracle will create and maintain up to a total of fifty (50) Personalized Guides, or up to ten (10) New Guides, as determined between Customer and Oracle during the Term for NetSuite Guided Learning â€“ Service Pack specified in Customerâ€™s Estimate/Order Form. If the Term for NetSuite Guided Learning â€“ Service Pack specified in Customerâ€™s Estimate/Order Form is less than one (1) year, the number of guides will be prorated. ', link: 'https://www.oracle.com/a/ocom/docs/corporate/netsuite-learning-cloud-provider-service-descr-v061920.pdf', prerequisites: 'Customer must procure and maintain the applicable Customer Learning Cloud Support Company Pass Premium or Enterprise subscription for the duration of NetSuite Guided Learning â€“ Service Pack Term specified on Customerâ€™s Estimate/Order Form. Customer must procure and maintain Oracle NetSuite\nGuided Learning Services subscription for the applicable Cloud Service(s) that will utilize the Service Pack Guides.' },
    { name: 'Insights', type: 'AI', overview: 'Digging through records to spot trends or catch issues can eat up valuable time. The Insights tab in NetSuite brings AI-powered recommendations and real-time analytics right to the record you\'re viewing.', link: '' },
    { name: 'LCS Standard', type: 'Subscription', overview: 'Getting your team up to speed on NetSuite shouldn\'t be a struggle. Learning Cloud Pass Standard gives your users unlimited access to a comprehensive library of self-paced, on-demand NetSuite training courses.', link: 'https://oracle.seismic.com/Link/Content/DCjhpPpq4qJ3GGqGCM9M2G7MPF98' },
    { name: 'LCS Premium', type: 'Subscription', overview: 'Learning Cloud Pass Premium delivers advanced training including live, instructor-led training sessions, exclusive workshops, and advanced learning paths tailored to your business needs.', link: 'https://oracle.seismic.com/Link/Content/DCjhpPpq4qJ3GGqGCM9M2G7MPF98' },
    { name: 'LCS Tailored Training Packs', type: 'Subscription', overview: 'LCS Tailored Training Event Packs deliver customized, hands-on training sessions designed specifically for your business, your processes, and your people.', link: 'https://oracle.seismic.com/Link/Content/DCjhpPpq4qJ3GGqGCM9M2G7MPF98' },
    { name: 'LCS Training On-Demand', type: 'Subscription', overview: 'Learning Cloud Pass Training On-Demand is the perfect solution for individuals who need targeted NetSuite training without the commitment of a full team subscription.', link: 'https://oracle.seismic.com/Link/Content/DCjhpPpq4qJ3GGqGCM9M2G7MPF98' },
    { name: 'NetSuite360', type: 'Module', overview: 'New All-In-One Account Hub for Customers with a streamlined, intuitive dashboard that makes managing every aspect of their NetSuite account easier than ever. Customers can access and pay invoices, view support cases and issues, edit authorized contacts, request compliance reports, and view NetSuite contacts and resources from a single, convenient location in-app designed to save time and simplify the experience. ', link: 'https://oracle.sharepoint.com/sites/nsgco/SitePages/Policy-and-Process.aspx?CT=1762540126341&OR=OWA-NT-Mail&CID=1b8c6c8c-4ead-4842-3c58-9dcb5d730d8f#order-to-cash', prerequisites: 'Customer admin assigns the "NetSuite 360" or "NetSuite 360 – Plus Financials" roles to account administrators and those managing payments. Users access via the Support tab.' },
    { name: 'OCI Anomaly Detection', type: 'AI', overview: 'Spotting unusual activity or risks in massive datasets is nearly impossible with manual reviews. OCI Anomaly Detection uses advanced machine learning to automatically identify outliers and suspicious patterns.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdde69e6ba7-b385-a79c-143c-c5822402e215%252Flfab7abf7c-18d0-48ab-a6ba-0a9bdfad6186//' },
    { name: 'Oracle Code Assist', type: 'AI', overview: 'Developing customizations and integrations can be slow and error-prone. Oracle Code Assist uses AI to suggest code, catch errors, and accelerate development in real time.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdde69e6ba7-b385-a79c-143c-c5822402e215%252Flfab7abf7c-18d0-48ab-a6ba-0a9bdfad6186//' },
    { name: 'SuiteAnswers Virtual Support Assistant/NS Expert', type: 'AI', overview: 'Getting help with NetSuite can mean searching through documentation or waiting for support. The SuiteAnswers Virtual Support Assistant uses AI to instantly answer your questions, guide you through troubleshooting.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdde69e6ba7-b385-a79c-143c-c5822402e215%252Flfab7abf7c-18d0-48ab-a6ba-0a9bdfad6186//' },
    { name: 'SuiteScript GenAI API', type: 'AI', overview: 'Writing SuiteScript code from scratch can be complex and time-consuming. The SuiteScript GenAI API leverages generative AI to help you draft, optimize, and troubleshoot SuiteScript code with simple prompts.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdde69e6ba7-b385-a79c-143c-c5822402e215%252Flfab7abf7c-18d0-48ab-a6ba-0a9bdfad6186//' },
    { name: 'Support - Standard', type: 'Subscription', overview: 'When issues arise, you need answers fast. NetSuite Standard Support provides reliable business-hours assistance, access to the support portal, and regular product updates.', link: 'https://oracle.seismic.com/Link/Content/DC424cF7mcgbW87GVQm7cMWmWjPG' },
    { name: 'Support - Premium', type: 'Connector', overview: 'For businesses that can\'t afford downtime, NetSuite Premium Support offers 24/7 access to expert assistance, faster response times, priority case handling, and live chat support.', link: 'https://oracle.seismic.com/Link/Content/DC7d7X8G3RP43GQDmDVPB62CD32V' }
  ],
  'Infrastructure': [
    { name: 'Development Account', type: 'Subscription', overview: 'While a NetSuite Sandbox is a copy of your production environment, a Development Account is a completely separate, blank-slate NetSuite instance dedicated just to your development work.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdda9a0c306-8b72-c4d8-65f4-507086c51d77%252Flf41c34e1b-f6c4-4474-b309-cbdc36c24efe//?anchorId=b8783944-8e4d-4968-8d26-9b69f7b8adaf' },
    { name: 'NetSuite AI Connector', type: 'AI', overview: 'NetSuite AI Connector Service solves the challenge of integrating advanced AI capabilities into your core business processes without disruption by seamlessly connecting your NetSuite environment to best-in-class AI tools.', link: 'https://www.netsuite.com/portal/company/newsroom/netsuite-ai-connector-service-have-ai-your-way.shtml', prerequisites: 'You cannot access the NetSuite AI Connector when you have Compliance360.' },
    { name: 'NetSuite Next', type: 'Subscription', overview: 'NetSuite Next is centered around Ask Oracle, a natural language assistant that enables users to search, navigate, analyze, and act across the entire NetSuite dataset using their own words. NetSuite Next builds in powerful and practical AI capabilities, including embedded conversational intelligence, agentic workflows, and natural language search capabilities, to handle repetitive and complex tasks so that businesses can achieve outcomes faster, more intuitively, and with greater confidence.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd618a5e6b-87e0-472b-b2d9-81779b7dcf61%252Fdd9fbc3f32-0071-46fd-bbcc-3673ae353098%252Flf07f8813f-9f62-49a2-b388-9ada05875d91//', prerequisites: 'Switching to NetSuite Next is done with the press of a button. No need to migrate data or disrupt customizations.' },
    { name: 'New Instance', type: 'Subscription', overview: 'As your business evolves, your current NetSuite instance can become weighed down by years of customizations and legacy data. Getting a New Instance gives you a clean slate to streamline or rebuild your setup.', link: 'https://oracle.seismic.com/Link/Content/DCXMcJFXG6FDF8qGVTPQ893g2MbP' },
    { name: 'NSIP', type: 'Connector', overview: 'Disconnected systems and manual data transfers slow down operations. NetSuite Integration Platform connects all your business applications, cloud or on-premises, so data flows seamlessly and processes stay in sync.', link: 'https://oracle.seismic.com/Link/Content/DCfXHFD3M2TfH82JTTp2JWj642hV' },
    { name: 'Oracle Content Management (Starter + Premium)', type: 'Module', overview: 'Managing documents, digital assets, and content across your business can get messy fast. Oracle Content Management is a cloud-based platform that centralizes all your content with AI-powered search and automated tagging.', link: 'https://docs.oracle.com/en/cloud/paas/content-cloud/managing-content/overview-oracle-content-management.html#GUID-65FF7607-4A7B-4328-94EA-D058DA7A07FF' },
    { name: 'Prompt Studio', type: 'AI', overview: 'Designing effective AI prompts isn\'t just about getting the right answer - it\'s also about making sure the response matches your brand\'s voice and tone. Prompt Studio gives your team a collaborative workspace to create and test AI prompts.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdde69e6ba7-b385-a79c-143c-c5822402e215%252Flfab7abf7c-18d0-48ab-a6ba-0a9bdfad6186//' },
    { name: 'Sandbox', type: 'Subscription', overview: 'Testing new features or customizations in your live NetSuite environment is risky. A Sandbox gives you a safe, isolated copy of your NetSuite system where you can experiment, train, and validate changes.', link: 'https://oracle.seismic.com/Link/Content/DCmR4R6TFRjWVGq2h9DT77bdTjP8' },
    { name: 'Sandbox POS', type: 'Subscription', overview: 'Testing new point-of-sale (POS) features or customizations directly in your live environment can be risky. Sandbox POS gives you a safe, isolated replica of your NetSuite POS system.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdda9a0c306-8b72-c4d8-65f4-507086c51d77%252Flf41c34e1b-f6c4-4474-b309-cbdc36c24efe//?anchorId=b8783944-8e4d-4968-8d26-9b69f7b8adaf' },
    { name: 'Salesforce Connector Sandbox', type: 'Module', overview: 'Provides a sandbox environment that copies NetSuite Connector Cloud Service for Salesforce production environment including Customer Data and customizations for the NetSuite Connector Cloud Service for Salesforce from your production SKU order.', link: 'https://www.oracle.com/a/ocom/docs/netsuite-cloud-services-sd.pdf', prerequisites: 'Provides one (1) NetSuite Connector Cloud Service for Salesforce replication for each month of the term (if Customer requires additional production environment replication, Customer must purchase separately). Requires NetSuite OneWorld Cloud Service and Salesforce Enterprise or Salesforce Developer Edition.' },
    { name: 'SuiteProjects Pro Sandbox', type: 'Module', overview: 'NetSuite SuiteProjects Pro Sandbox provides a sandbox environment for NetSuite SuiteProjects Pro Cloud Service.', link: 'https://www.oracle.com/a/ocom/docs/netsuite-cloud-services-sd.pdf', prerequisites: 'Customer must purchase and maintain an active subscription to NetSuite SuiteProjects Pro Cloud Service. Provides one (1) NetSuite SuiteProjects Pro Cloud Service production environment replication for each month of the Term is included (if Customer requires additional production environment replication, Customer must purchase separately). Allows Customer the ability to provide access to the NetSuite SuiteProjects Pro Sandbox to all NetSuite SuiteProjects Pro Cloud Service production Users as needed. NetSuite SuiteProjects Pro Sandbox is an isolated environment. Customer is unable to push changes and/or updates made in the NetSuite SuiteProjects Pro Sandbox into any production environment or account.' },
    { name: 'Analytics Warehouse Sandbox', type: 'Module', overview: 'The NetSuite Analytics Warehouse â€“ Sandbox provides pre-packaged metrics that are sourced from NetSuite ERP Cloud Service.', link: 'https://www.oracle.com/a/ocom/docs/nsgbu-oracle-ns-service-descriptions.pdf' },
    { name: 'SuiteCloud+', type: 'Connector', overview: 'As your business grows, so do your integration and customization needs. The SuiteCloud+ License unlocks higher API limits, advanced integration capabilities, and enhanced performance for large-scale environments.', link: 'https://oracle.seismic.com/Link/Content/DCW2hJPMDHBbhGhDTCQPVCVhfMcd' },
    { name: 'SuiteProjects Pro BI Connector', type: 'Connector', overview: 'NetSuite SuiteProjects Pro BI Connector enables Customer to publish saved reports and list views to a data feed\nin an OData/JSON format which can be consumed by third party business intelligence (â€œBIâ€) tools', link: 'https://www.oracle.com/a/ocom/docs/netsuite-cloud-services-sd.pdf', prerequisites: 'Customer must purchase and maintain an active subscription to NetSuite SuiteProjects Cloud Service. Requires separately licensed access to a BI tool that accepts OData v4/JSON format.' },
    { name: 'Suite Upgrade', type: 'Subscription', overview: 'As your business grows, you may find your current NetSuite edition is holding you back. A suite upgrade expands your system\'s capabilities by unlocking advanced modules and increasing your caps on users and features.', link: 'https://oracle.sharepoint.com/:x:/s/netsuite-suitesuccess-published-assets/EVJM89t5a2ZHnQ0sdSSA2t4B8KefO0k31MdF5LIhhxcwLQ?e=6ZSWFB' },
    { name: 'Text Enhance', type: 'AI', overview: 'Crafting clear, compelling business communications takes time and skill. Text Enhance uses generative AI to help you draft, edit, and polish everything from emails to job descriptionsâ€”right inside NetSuite.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdde69e6ba7-b385-a79c-143c-c5822402e215%252Flfab7abf7c-18d0-48ab-a6ba-0a9bdfad6186//' },
    { name: 'Tier Upgrade', type: 'Subscription', overview: 'As your business grows, hitting the limits of your current NetSuite tier can slow you down. A Tier Upgrade gives you the extra capacity, performance, and scalability you need to keep operations running smoothly.', link: 'https://oracle.seismic.com/app#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5264c1e5-c35c-7ca2-e5bd-27693b8fdc63%252Fdda9a0c306-8b72-c4d8-65f4-507086c51d77%252Flfb0462a42-36de-4fe8-982b-bc100e55cf83//' }
  ],
  'Users': [
    { name: 'CRM Specialized Users', type: 'User', overview: 'If your team is focused on building customer relationships and driving sales, the CRM User license gives them the tools they needâ€”without the clutter of full ERP access. CRM users can manage leads, track opportunities, and nurture customer interactions.', link: 'https://oracle.seismic.com/Link/Content/DC94QG9QgVbm7GhC9TCqM9Q9dJpd' },
    { name: 'Customer Users', type: 'User', overview: 'Give your customers the power to help themselves with the Customer Center License. This license lets customers log in to a secure portal to view order status, pay invoices, submit support cases, and manage their account details.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N322570.html' },
    { name: 'EPM Users', type: 'User', overview: 'EPM user licenses are designed to give your team secure, role-based access to powerful planning, budgeting, forecasting, and reporting tools, all within NetSuite\'s Enterprise Performance Management suite.', link: '' },
    { name: 'Employee Users', type: 'User', overview: 'Not everyone needs full access to NetSuite, but every employee needs to manage their own HR and purchasing tasks. The Employee Self-Service License gives your staff a simple, secure way to submit time sheets, request time off, and create purchase requisitions.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N898173.html' },
    { name: 'Full Licence Users', type: 'User', overview: 'If you need comprehensive access to NetSuite across financials, CRM, inventory, reporting, and more, the Full User License is your all-access pass. It\'s designed for power users like finance, operations, and management.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N322041.html' },
    { name: 'Partner Users', type: 'User', overview: 'Collaborating with external partners, vendors, or contractors shouldn\'t mean giving them full access to your system. The Partner Center License provides a secure, limited portal where partners can manage orders and view relevant reports.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N322424.html' },
    { name: 'Project Management Specialized Users', type: 'User', overview: 'For teams dedicated to delivering projects on time and on budget, the Project Management User license provides targeted access to project planning, task management, time tracking, and resource allocation.', link: 'https://oracle.seismic.com/app?ContentId=627f1964-5a9e-4156-ae20-77972e071123#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5098ca17-f349-48e6-b528-8b6fa8f2b8f8%252Fdd9fccec33-e15e-4bf5-9262-fda74c2d2963%252Flfd9af60a1-653d-4692-bb94-3fdcca3bdc3c/grid/' },
    { name: 'Site Operator Specialized Users', type: 'User', overview: 'If you have staff managing warehouse, retail, or manufacturing sites, the Site Operator User license gives them secure, role-based access to the operational features they need.', link: 'https://oracle.seismic.com/app?ContentId=627f1964-5a9e-4156-ae20-77972e071123#/doccenter/225362e4-fff7-466b-b7e5-4a01875c7e08/doc/%252Fdd5098ca17-f349-48e6-b528-8b6fa8f2b8f8%252Fdd9fccec33-e15e-4bf5-9262-fda74c2d2963%252Flfd9af60a1-653d-4692-bb94-3fdcca3bdc3c/grid/' },
    { name: 'View/Approve Users', type: 'User', overview: 'Some team members just need to keep an eye on information and give approvals without editing data. The View and Approve License is designed for managers, supervisors, or executives who need to review transactions and approve requests.', link: 'https://oracle.seismic.com/Link/Content/DC94QG9QgVbm7GhC9TCqM9Q9dJpd' },
    { name: 'Vendor Center Users', type: 'User', overview: 'Managing vendor relationships is easier when your suppliers can access the information they need. The Vendor Center License gives vendors a secure portal to view purchase orders, submit invoices, and check payment status.', link: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N322273.html' },
    { name: 'WMS Specialized Users', type: 'User', overview: 'The NetSuite WMS User License gives your warehouse team real-time, mobile access to advanced picking, packing, and inventory workflows right on the floorâ€”without the cost or complexity of a full access license.', link: 'https://oracle.seismic.com/Link/Content/DC94QG9QgVbm7GhC9TCqM9Q9dJpd' }
  ]
};


// Reusable collapsible section component

function CollapsibleSection({ title, isExpanded, onToggle, children, rightElement = null, className = "" }) {
  return (
    <div className={className}>
      <button 
        onClick={onToggle} 
        className={`w-full flex items-center justify-between ${isExpanded ? 'mb-3' : ''}`}
      >
        <h3 className="text-lg font-bold text-gray-100">{title}</h3>
        <div className="flex items-center gap-2">
          {rightElement}
          {isExpanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </div>
      </button>
      {isExpanded && children}
    </div>
  );
}


// Reusable link input with icon

function LinkInput({ label, value, onChange, showIcon = true }) {

  return (

    <div>

      <label className="block font-medium text-gray-300 mb-1 text-sm">{label}</label>

      <div className="flex items-center gap-2">

        {showIcon && (

          value ? 

            <a href={value} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200">

              <Globe size={18} />

            </a> : 

            <Globe size={18} className="text-gray-600" />

        )}

        <input 

          type="url" 

          value={value || ''} 

          onChange={(e) => onChange(e.target.value)} 

          className="flex-1 px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100" 

        />

      </div>

    </div>

  );

}



// Reusable customer grid component

function CustomerGrid({ customers, onSelectCustomer, customerHasTasks, customerHasModules, isMeetingOverdue, hasOutstanding }) {

  return (

    <div className="space-y-2">

      {customers.map(c => (

        <div 

          key={c.id} 

          onClick={() => onSelectCustomer(c)} 

          className="bg-zinc-900 rounded border border-zinc-800 p-2.5 cursor-pointer hover:bg-zinc-800 transition"

        >

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4 flex-1">

              <div className="flex items-center gap-2 min-w-0">

                {!customerHasModules(c.id) && <span className="text-[#C74364] hover:text-[#D96682] text-sm flex-shrink-0">●</span>}

                <span className="text-gray-500 flex-shrink-0">•</span>
                <h3 className="font-semibold text-gray-200 text-sm truncate">{c.name}</h3>

              </div>

              

              <div className="flex items-center gap-2 text-xs text-gray-400">

                {c.data.general?.industry && (

                  <>

                    <span className="text-gray-500">Industry:</span>

                    <span>{c.data.general.industry}</span>

                    <span className="text-gray-600">|</span>

                  </>

                )}

                {c.data.general?.arr && (

                  <>

                    <span className="text-gray-500">ARR:</span>

                    <span>${Number(c.data.general.arr).toLocaleString()}</span>

                    <span className="text-gray-600">|</span>

                  </>

                )}

                <span className="text-gray-500">Last Edited:</span>

                <span>{c.lastEdited}</span>

              </div>

            </div>

            

            <div className="flex items-center gap-2 flex-shrink-0 ml-4">

              {customerHasTasks(c.id) && (() => {

                const hasOverdue = c.data.meetings?.some(m => hasOutstanding(m) && isMeetingOverdue(m));

                return <span className={`${hasOverdue ? 'text-[#C74364] hover:text-[#D96682]' : 'text-amber-400'} text-base`}>⚠</span>;

              })()}

            </div>

          </div>

        </div>

      ))}

    </div>

  );

}


// Reusable confirmation modal

function ConfirmationModal({ isOpen, message, onConfirm, onCancel }) {

  if (!isOpen) return null;

  

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-zinc-900 rounded-lg max-w-md w-full mx-4 p-6 border border-zinc-800">

        <h3 className="text-xl font-bold text-gray-100 mb-4">Confirm Delete</h3>

        <p className="text-gray-300 mb-6">{message}</p>

        <div className="flex gap-3 justify-end">

          <button 

            onClick={onCancel} 

            className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition"

          >

            Cancel

          </button>

          <button 

            onClick={onConfirm} 

            className="px-4 py-2 bg-[#C74364] hover:bg-[#B23956] text-white rounded transition"

          >

            Delete

          </button>

        </div>

      </div>

    </div>

  );

}



// Reusable status select with color coding

function StatusSelect({ value, onChange, type = 'meeting', autoFill }) {

  const statusClass = value ? STATUS_COLORS[value] : 'bg-zinc-800 border-zinc-700';

  

  const options = type === 'meeting' 

    ? [

        { value: 'green', label: '●', color: '#86B596' },

        { value: 'yellow', label: '●', color: '#E2C06B' },

        { value: 'red', label: '●', color: '#C74364' },

        { value: 'black', label: '●', color: '#18181b', textColor: 'text-gray-100' }

      ]

    : [ // health check options (no black)

        { value: 'green', label: '●', color: '#86B596' },

        { value: 'yellow', label: '●', color: '#E2C06B' },

        { value: 'red', label: '●', color: '#C74364' }

      ];



  return (

    <select 

      value={value || ''} 

      onChange={(e) => { 

        onChange(e.target.value); 

        if (e.target.value === 'black' && autoFill) autoFill('Did not meet with customer/meeting cancelled.'); 

      }} 

      className={`w-full px-2 py-1.5 text-sm ${statusClass} rounded focus:ring-1 focus:ring-zinc-500 text-transparent`}

    >

      <option value="" className="bg-zinc-800 text-gray-100">Select...</option>

      {options.map(opt => (

        <option 

          key={opt.value} 

          value={opt.value} 

          className={opt.textColor || "text-transparent"} 

          style={{backgroundColor: opt.color}}

        >

          {opt.label}

        </option>

      ))}

    </select>

  );

}



// Custom hook for localStorage with auto-save

function useLocalStorage(key, initialValue) {

  // Initialize state from localStorage

  const [storedValue, setStoredValue] = useState(() => {

    try {

      const item = window.localStorage.getItem(key);

      if (item) {

        const parsed = JSON.parse(item);


        return parsed;

      }

      return initialValue;

    } catch (error) {

      console.error('Error loading from localStorage:', error);

      return initialValue;

    }

  });



  // Auto-save to localStorage whenever value changes

  useEffect(() => {

    try {

      const valueToStore = {

        ...storedValue,

        lastSaved: new Date().toISOString()

      };

      window.localStorage.setItem(key, JSON.stringify(valueToStore));

    } catch (error) {

      console.error('Error saving to localStorage:', error);

    }

  }, [key, storedValue]);



  return [storedValue, setStoredValue];

}



export default function CustomerNotesApp() {

// Module library always comes from code, not saved data

const [moduleLibrary, setModuleLibrary] = useState(INITIAL_MODULE_LIBRARY);



// Use custom hook for localStorage persistence

const [savedData, setSavedData] = useLocalStorage('customerNotesData', { customers: [] });

const [customers, setCustomers] = useState(savedData.customers || []);

  const [activeTab, setActiveTab] = useState('customers');

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [expandedSections, setExpandedSections] = useState({ overview: true });

  const [notesExpanded, setNotesExpanded] = useState(false);

  const [expandedContactNotes, setExpandedContactNotes] = useState({});

  const [expandedMeetings, setExpandedMeetings] = useState({});

  const [meetingSummaryExpanded, setMeetingSummaryExpanded] = useState(true);

  const [showModuleSelector, setShowModuleSelector] = useState(false);

  const [expandedProcessAreas, setExpandedProcessAreas] = useState({});

  const [expandedModalProcessAreas, setExpandedModalProcessAreas] = useState({});

  const [showAddModuleForm, setShowAddModuleForm] = useState(false);

  const [newModule, setNewModule] = useState({ name: '', type: 'Module', overview: '', link: '', processArea: '', prerequisites: '' });

  const [editingModule, setEditingModule] = useState(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const [draggedModule, setDraggedModule] = useState(null);

  const [modulesExpanded, setModulesExpanded] = useState(false);

  const [customersExpanded, setCustomersExpanded] = useState(false);

  const [tasksExpanded, setTasksExpanded] = useState(false);

  const [meetingPromptsExpanded, setMeetingPromptsExpanded] = useState(false);

  const [abrPromptsExpanded, setAbrPromptsExpanded] = useState(false);

  const [discoveryPromptsExpanded, setDiscoveryPromptsExpanded] = useState(false);

  const [showLicenseAnalyzer, setShowLicenseAnalyzer] = useState(false);

  const [analyzerData, setAnalyzerData] = useState(null);

  const [customerSortMode, setCustomerSortMode] = useState('sectioned'); // 'sectioned' or 'alphabetical'

  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  const [confirmationDialog, setConfirmationDialog] = useState(null);

  const [messageDialog, setMessageDialog] = useState(null);

  const [showLibraryCode, setShowLibraryCode] = useState(false);

  const [libraryModified, setLibraryModified] = useState(false);



// Track if library has been modified from initial state

useEffect(() => {

  const isModified = JSON.stringify(moduleLibrary) !== JSON.stringify(INITIAL_MODULE_LIBRARY);

  setLibraryModified(isModified);

}, [moduleLibrary]);



const autoResizeTextarea = (textarea) => {

    if (textarea) {

      textarea.style.height = 'auto';

      textarea.style.height = Math.max(textarea.scrollHeight, 40) + 'px';

    }

  };





// Auto-resize textareas on mount and when sections expand (but NOT on every state change)

useEffect(() => {

  const timer = setTimeout(() => {

    const textareas = document.querySelectorAll('textarea');

    textareas.forEach(textarea => {

      autoResizeTextarea(textarea);

    });

  }, 0);

  

  return () => clearTimeout(timer);

}, [expandedSections, expandedContactNotes, expandedMeetings, notesExpanded]);



// Preserve scroll position when switching between customers

useEffect(() => {

  if (selectedCustomer) {

    const timer = setTimeout(() => {

      const textareas = document.querySelectorAll('textarea');

      textareas.forEach(textarea => {

        autoResizeTextarea(textarea);

      });

    }, 100);

    

    return () => clearTimeout(timer);

  }

}, [selectedCustomer?.id]);



  // Utility functions

  const formatDate = (d) => {

    if (!d) return '';

    const dt = new Date(d + 'T00:00:00');

    return `${String(dt.getMonth() + 1).padStart(2, '0')}/${String(dt.getDate()).padStart(2, '0')}/${String(dt.getFullYear()).slice(-2)}`;

  };



  const getMeetingTitle = (m) => {

    if (!m) return 'Untitled Meeting';

    const d = m.meetingNotesDate ? formatDate(m.meetingNotesDate) : '';

    const t = m.meetingType || '';

    const f = m.focus || '';

    // If we have date and meeting type and focus

    if (d && t && f) return `${d} - ${t}: ${f}`;

  

    // If we have date and meeting type (no focus)

    if (d && t) return `${d} - ${t}`;



    // If we have meeting type and focus (no date)

    if (t && f) return `${t}: ${f}`;

  

    // Fallback to just what we have

    return d || t || 'Untitled Meeting';

  };



  const getRatingColor = (r) => RATING_COLORS[r] || 'text-gray-300';



  const hasOutstanding = (m) => TASK_FIELDS.some(f => {

    const val = m[f.id];

    return val && val !== 'Complete' && val !== 'N/A';

  });



  const getAllTasks = () => {

  const tasks = [];

  customers.forEach(c => {

    if (c.data.meetings) {

      c.data.meetings.forEach((m, i) => {

        if (hasOutstanding(m)) {

          tasks.push({ 

            customerId: c.id, 

            customerName: c.name, 

            meetingIndex: i, 

            meetingTitle: getMeetingTitle(m), 

            rating: m.rating, 

            link: m.scRequestLink,

            isOverdue: isMeetingOverdue(m)

          });

        }

      });

    }

  });

  return tasks;

};



  const customerHasTasks = (id) => {

    const c = customers.find(cu => cu.id === id);

    return c?.data.meetings?.some(hasOutstanding) || false;

  };



  const customerHasModules = (id) => {

  const c = customers.find(cu => cu.id === id);

  if (!c?.data?.modules || c.data.modules.length === 0) return false;

  

  // Default module names

  const defaultModules = [

    'CRM', 'Electronic Bank Payments', 'Financial Exception Management',

    'Intelligent Performance Management', 'SuiteAnalytics Assistant',

    'Intelligent Item Recommendations', 'Advisor', 'Insights',

    'LCS Training On-Demand', 'OCI Anomaly Detection', 'Oracle Code Assist',

    'SuiteAnswers Virtual Support Assistant/NS Expert', 'SuiteScript GenAI API',

    'Support - Standard', 'Prompt Studio', 'Text Enhance',

    'Employee Users', 'Full Licence Users'

  ];

  

  // Check if there are any modules beyond the default ones

  return c.data.modules.some(m => !defaultModules.includes(m.name));

};



const isMeetingOverdue = (m) => {

  if (!m.meetingNotesDate) return false;

  const meetingDate = new Date(m.meetingNotesDate + 'T00:00:00');

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return meetingDate <= today;

};





  // Data management

  const exportData = () => {

    const dataToExport = { customers, exportDate: new Date().toISOString() };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download = `customer-notes-${new Date().toISOString().split('T')[0]}.json`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  };

const exportLibraryAsCode = () => {

  // Helper to escape strings for JavaScript

  const escapeString = (str) => {

    if (!str) return '';

    return str

      .replace(/\\/g, '\\\\')  // Escape backslashes first

      .replace(/'/g, "\\'")     // Escape single quotes

      .replace(/\n/g, '\\n')    // Escape newlines

      .replace(/\r/g, '\\r')    // Escape carriage returns

      .replace(/\t/g, '\\t');   // Escape tabs

  };

  

  // Format the module library as JavaScript code

  let code = 'const INITIAL_MODULE_LIBRARY = {\n';

  

  Object.keys(moduleLibrary).forEach((processArea, index) => {

    code += `  '${processArea}': [\n`;

    

    moduleLibrary[processArea].forEach((mod, modIndex) => {

      code += `    { name: '${escapeString(mod.name)}', type: '${mod.type}', overview: '${escapeString(mod.overview)}', link: '${escapeString(mod.link)}'`;

      if (mod.prerequisites) {

        code += `, prerequisites: '${escapeString(mod.prerequisites)}'`;

      }

      code += ' }';

      

      if (modIndex < moduleLibrary[processArea].length - 1) {

        code += ',\n';

      } else {

        code += '\n';

      }

    });

    

    code += '  ]';

    if (index < Object.keys(moduleLibrary).length - 1) {

      code += ',\n';

    } else {

      code += '\n';

    }

  });

  

  code += '};';

  

  setShowLibraryCode(code);

};



  const importData = (event) => {

  const file = event.target.files[0];

  if (!file) return;

  

  const reader = new FileReader();

  reader.onload = (e) => {

    try {

      const imported = JSON.parse(e.target.result);

      if (imported.customers) {

        setCustomers(imported.customers);

        setSavedData({ customers: imported.customers });

        setSelectedCustomer(null);

      }

      if (imported.moduleLibrary) setModuleLibrary(imported.moduleLibrary);

      alert('Data imported successfully!');

    } catch (error) {

      alert('Error importing data. Please check the file format.');

      console.error(error);

    }

  };

  reader.readAsText(file);

  event.target.value = '';

};



const importFromExcel = async (event) => {

  const file = event.target.files[0];

  if (!file) return;

  

  try {

    const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs');

    const data = await file.arrayBuffer();

    const workbook = XLSX.read(data);

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    

    // Helper function to parse budget (e.g., "$10M to $20M" â†’ "20000000")

    const parseBudget = (value) => {

      if (!value) return '';

      const str = String(value).toUpperCase();

      

      // Extract numbers and multiplier from format like "$10M to $20M"

      const match = str.match(/\$?(\d+(?:\.\d+)?)(K|M|B)?\s+TO\s+\$?(\d+(?:\.\d+)?)(K|M|B)?/i);

      if (match) {

        const topNumber = parseFloat(match[3]);

        const multiplier = match[4];

        let result = topNumber;

        

        if (multiplier === 'K') result *= 1000;

        else if (multiplier === 'M') result *= 1000000;

        else if (multiplier === 'B') result *= 1000000000;

        

        return String(Math.round(result));

      }

      

      // Fallback: just extract numbers

      return str.replace(/[^0-9]/g, '');

    };

    

    // Helper function to parse employees (e.g., "100 to 249" â†’ "249")

    const parseEmployees = (value) => {

      if (!value) return '';

      const str = String(value);

      

      // Extract the top end of range

      const match = str.match(/(\d+(?:,\d+)*)\s+to\s+(\d+(?:,\d+)*)/i);

      if (match) {

        return match[2].replace(/,/g, '');

      }

      

      // Fallback: just extract numbers

      return str.replace(/[^0-9]/g, '');

    };

    

    // Helper function to round ARR

    const roundARR = (value) => {

      if (!value) return '';

      const num = parseFloat(String(value).replace(/[^0-9.-]/g, ''));

      return isNaN(num) ? '' : String(Math.round(num));

    };

    

    // Helper function to remove ID prefix from company name (number + space)

    const cleanCompanyName = (name) => {

      if (!name) return 'New Customer';

      const str = String(name);

      // Remove pattern like "12345 " from the beginning (number followed by space)

      return str.replace(/^\d+\s+/, '').trim();

    };

    

    // Helper function to reverse name from "Last, First" to "First Last"

    const reverseAccountManagerName = (name) => {

      if (!name) return '';

      const str = String(name).trim();

      

      // Check if format is "Last, First"

      const match = str.match(/^([^,]+),\s*(.+)$/);

      if (match) {

        return `${match[2]} ${match[1]}`.trim();

      }

      

      // Return as-is if not in that format

      return str;

    };

    

    // Helper function to parse date from Excel

    const parseDate = (value) => {

      if (!value) return '';

      

      // If it's already a date string in YYYY-MM-DD format, return it

      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {

        return value;

      }

      

      // Excel stores dates as numbers (days since 1900-01-01)

      if (typeof value === 'number') {

        const date = new Date((value - 25569) * 86400 * 1000);

        return date.toISOString().split('T')[0];

      }

      

      // Try to parse as date string

      try {

        const date = new Date(value);

        if (!isNaN(date.getTime())) {

          return date.toISOString().split('T')[0];

        }

      } catch (e) {

        console.warn('Could not parse date:', value);

      }

      

      return '';

    };

    

    // Helper function to parse Multi-Subsidiary Customer flag

    const parseSubs = (value) => {

      if (!value) return '';

      const str = String(value).toLowerCase().trim();

      // If "no", return "1". If "yes", return empty string

      return str === 'no' ? '1' : '';

    };

    

    // Group rows by company (using the full name with ID as key)

    const companiesMap = new Map();

    jsonData.forEach(row => {

      const fullName = row['Company Name'] || row['Customer Name'] || '';

      if (!fullName) return;

      

      if (!companiesMap.has(fullName)) {

        companiesMap.set(fullName, []);

      }

      companiesMap.get(fullName).push(row);

    });

    

     // Create customers from Active rows

    const newCustomers = [];

    const duplicatesFound = [];

    companiesMap.forEach((rows, fullName) => {

      // Find the Active row

      const activeRow = rows.find(row => 

        String(row['Status'] || '').toLowerCase() === 'active'

      );

      

      // If no Active row found, skip this company

      if (!activeRow) {

        console.warn(`No Active row found for ${fullName}, skipping`);

        return;

      }

      

      const cleanName = cleanCompanyName(fullName);

      const customerNumber = activeRow['Customer #'] || activeRow['Customer Number'] || '';

      const internalId = activeRow['Internal ID'] || '';

// Check for duplicates before adding

const isDuplicate = customers.some(c => 

  c.name.toLowerCase() === cleanName.toLowerCase() && 

  c.data.general?.customerNumber === customerNumber

);



if (isDuplicate) {

  duplicatesFound.push({ name: cleanName, number: customerNumber });

}  

 newCustomers.push({

        id: Date.now() + Math.random(),

        name: cleanName,

        lastEdited: new Date().toISOString().split('T')[0],

        data: {

          overview: { 

            customerName: cleanName,

            generalNotes: '' 

          },

          general: {

            industry: activeRow['Industry'] || '',

            annualBudget: parseBudget(activeRow['Annual Budget'] || activeRow['Budget']),

            employees: parseEmployees(activeRow['# of Employees'] || activeRow['Employees']),

            customerNumber: customerNumber,

            acquisition: parseDate(activeRow['Acquisition'] || activeRow['Acquisition Date']),

            arr: roundARR(activeRow['ARR']),

            tier: activeRow['Tier'] || '',

            subs: parseSubs(activeRow['Multi-Subsidiary Customer Flag']),

            cc: activeRow['C/C'] || activeRow['CC'] || ''

          },

          nonprofit: {},

          healthCheck: {},

          links: {

            nsRecord: internalId ? `https://nlcorp.app.netsuite.com/app/common/entity/custjob.nl?id=${internalId}` : '',

            website: activeRow['Website'] || '',

            linkedIn: activeRow['LinkedIn'] || activeRow['LinkedIn Profile'] || '',

            additional: []

          },

          contacts: [{}],

          modules: [

            { name: 'CRM', status: 'Licensed', processArea: 'CRM + Marketing' },

            { name: 'Electronic Bank Payments', status: 'Licensed', processArea: 'Procurement' },

            { name: 'Financial Exception Management', status: 'Licensed', processArea: 'Accounting + Reconciliations' },

            { name: 'Intelligent Performance Management', status: 'Licensed', processArea: 'Planning Analysis + Reporting' },

            { name: 'SuiteAnalytics Assistant', status: 'Licensed', processArea: 'Analytics' },

            { name: 'Intelligent Item Recommendations', status: 'Licensed', processArea: 'Sales + eCommerce' },

            { name: 'Advisor', status: 'Licensed', processArea: 'Support' },

            { name: 'Insights', status: 'Licensed', processArea: 'Support' },

            { name: 'LCS Training On-Demand', status: 'Licensed', processArea: 'Support' },

            { name: 'OCI Anomaly Detection', status: 'Licensed', processArea: 'Support' },

            { name: 'Oracle Code Assist', status: 'Licensed', processArea: 'Support' },

            { name: 'SuiteAnswers Virtual Support Assistant/NS Expert', status: 'Licensed', processArea: 'Support' },

            { name: 'SuiteScript GenAI API', status: 'Licensed', processArea: 'Support' },

            { name: 'Support - Standard', status: 'Licensed', processArea: 'Support' },

            { name: 'Prompt Studio', status: 'Licensed', processArea: 'Infrastructure' },

            { name: 'Text Enhance', status: 'Licensed', processArea: 'Infrastructure' },

            { name: 'Employee Users', status: 'Licensed', processArea: 'Users', quantity: 5 },

            { name: 'Full Licence Users', status: 'Licensed', processArea: 'Users', quantity: 1 }

          ],

          meetings: [{

            accountManagerName: reverseAccountManagerName(activeRow['Account Manager Name'] || activeRow['Account Manager']),

            taskUpdateSC: 'Not Started',

            taskConfirmOpps: 'Not Started',

            taskUploadDiscovery: 'Not Started',

            taskLastTellEmail: 'Not Started',

            taskFollowUps: 'Not Started'

          }],

          thirdParty: []

        }

      });

    });

    

    // Check if there are duplicates

    if (duplicatesFound.length > 0) {

      const dupeList = duplicatesFound.map(d => `${d.name} (${d.number})`).join('\n');

      setConfirmationDialog({

        message: `The following customers already exist:\n\n${dupeList}\n\nDo you want to import them anyway?`,

        onConfirm: () => {

          setCustomers([...customers, ...newCustomers].sort((a, b) => a.name.localeCompare(b.name)));

          setMessageDialog({

            title: 'Import Successful',

            message: `Successfully imported ${newCustomers.length} customer(s)!`

          });

        }

      });

   } else {

      setCustomers([...customers, ...newCustomers].sort((a, b) => a.name.localeCompare(b.name)));

      setMessageDialog({

        title: 'Import Successful',

        message: `Successfully imported ${newCustomers.length} customer(s)!`

      });

    }

    

  } catch (error) {

    alert('Error importing Excel file. Please check the format.');

    console.error(error);

  }

  

  event.target.value = '';

};  



// Function to reorder modules for all customers

const reorderAllCustomerModules = () => {

  const updatedCustomers = customers.map(customer => {

    if (!customer.data.modules) return customer;

    

    const reorderedModules = customer.data.modules.sort((a, b) => {

      const aArea = a.processArea || 'Uncategorized';

      const bArea = b.processArea || 'Uncategorized';

      

      // If different process areas, maintain the original grouping

      if (aArea !== bArea) {

        const areaOrder = Object.keys(moduleLibrary).indexOf(aArea);

        const bAreaOrder = Object.keys(moduleLibrary).indexOf(bArea);

        return areaOrder - bAreaOrder;

      }

      

      // Within same process area, sort by library order

      const aIndex = moduleLibrary[aArea]?.findIndex(libMod => libMod.name === a.name) ?? 999;

      const bIndex = moduleLibrary[aArea]?.findIndex(libMod => libMod.name === b.name) ?? 999;

      return aIndex - bIndex;

    });

    

    return { ...customer, data: { ...customer.data, modules: reorderedModules } };

  });

  

  setCustomers(updatedCustomers);

  alert('All customer modules have been reordered to match the library!');

};



// Module library management

  const addModuleToLibrary = () => {

  if (!newModule.name || !newModule.processArea) return;

  setModuleLibrary(prev => ({

    ...prev,

    [newModule.processArea]: [...(prev[newModule.processArea] || []), { 

      name: newModule.name, 

      type: newModule.type, 

      overview: newModule.overview, 

      link: newModule.link,

      prerequisites: newModule.prerequisites || ''

    }]

  }));

  setNewModule({ name: '', type: 'Module', overview: '', link: '', processArea: '', prerequisites: '' });

  setShowAddModuleForm(false);

};



  const updateModuleInLibrary = (processArea, moduleIndex, field, value) => {

    setModuleLibrary(prev => ({

      ...prev,

      [processArea]: prev[processArea].map((mod, i) => 

        i === moduleIndex ? { ...mod, [field]: value } : mod

      )

    }));

  };



  const deleteModuleFromLibrary = (processArea, moduleIndex) => {

    setModuleLibrary(prev => ({

      ...prev,

      [processArea]: prev[processArea].filter((_, i) => i !== moduleIndex)

    }));

  };



  // Customer management

  const updateCustomer = (updates) => {

    if (!selectedCustomer) return;

    const updated = { ...selectedCustomer, ...updates, lastEdited: new Date().toISOString().split('T')[0] };

    setSelectedCustomer(updated);

    setCustomers(customers.map(c => c.id === updated.id ? updated : c).sort((a, b) => a.name.localeCompare(b.name)));

  };



  const updateName = (n) => {

    const updates = { name: n };

    if (!selectedCustomer.data.overview) selectedCustomer.data.overview = {};

    selectedCustomer.data.overview.customerName = n;

    updateCustomer(updates);

  };



  const updateField = (sec, fld, val, idx = null) => {

  if (!selectedCustomer) return;

  const u = { ...selectedCustomer };

  if (idx !== null) {

    if (!u.data[sec]) u.data[sec] = [{}];

    u.data[sec][idx] = { ...u.data[sec][idx], [fld]: val };

  } else {

    if (!u.data[sec]) u.data[sec] = {};

    u.data[sec][fld] = val;

  }

  // Update last edited date

  u.lastEdited = new Date().toISOString().split('T')[0];

  

  setSelectedCustomer(u);

  setCustomers(customers.map(c => c.id === u.id ? u : c));

};



  const createCustomer = () => {

  const nc = {

    id: Date.now(), 

    name: 'New Customer', 

    lastEdited: new Date().toISOString().split('T')[0],

    data: { 

      overview: { customerName: 'New Customer', generalNotes: '' }, 

      general: {}, 

      nonprofit: {}, 

      healthCheck: {}, 

      links: { additional: [] }, 

      contacts: [{}], 

      modules: [

        { name: 'CRM', status: 'Licensed', processArea: 'CRM + Marketing' },

        { name: 'Electronic Bank Payments', status: 'Licensed', processArea: 'Procurement' },

        { name: 'Financial Exception Management', status: 'Licensed', processArea: 'Accounting + Reconciliations' },

        { name: 'Intelligent Performance Management', status: 'Licensed', processArea: 'Planning Analysis + Reporting' },

        { name: 'SuiteAnalytics Assistant', status: 'Licensed', processArea: 'Analytics' },

        { name: 'Intelligent Item Recommendations', status: 'Licensed', processArea: 'Sales + eCommerce' },

        { name: 'Advisor', status: 'Licensed', processArea: 'Support' },

        { name: 'Insights', status: 'Licensed', processArea: 'Support' },

        { name: 'LCS Training On-Demand', status: 'Licensed', processArea: 'Support' },

        { name: 'OCI Anomaly Detection', status: 'Licensed', processArea: 'Support' },

        { name: 'Oracle Code Assist', status: 'Licensed', processArea: 'Support' },

        { name: 'SuiteAnswers Virtual Support Assistant/NS Expert', status: 'Licensed', processArea: 'Support' },

        { name: 'SuiteScript GenAI API', status: 'Licensed', processArea: 'Support' },

        { name: 'Support - Standard', status: 'Licensed', processArea: 'Support' },

        { name: 'Prompt Studio', status: 'Licensed', processArea: 'Infrastructure' },

        { name: 'Text Enhance', status: 'Licensed', processArea: 'Infrastructure' },

        { name: 'Employee Users', status: 'Licensed', processArea: 'Users', quantity: 5 },

        { name: 'Full Licence Users', status: 'Licensed', processArea: 'Users', quantity: 1 }

      ], 

      meetings: [{

        taskUpdateSC: 'Not Started',

        taskConfirmOpps: 'Not Started',

        taskUploadDiscovery: 'Not Started',

        taskLastTellEmail: 'Not Started',

        taskFollowUps: 'Not Started'

      }], 

      thirdParty: [] 

    }

  };

  setCustomers([...customers, nc].sort((a, b) => a.name.localeCompare(b.name)));

  setSelectedCustomer(nc);

  setActiveTab('customers');

};



  const deleteCustomer = (id) => {

    const updatedCustomers = customers.filter(c => c.id !== id);

    setCustomers(updatedCustomers);

    if (selectedCustomer?.id === id) setSelectedCustomer(null);

  };



  // Module status management

const updateModuleStatus = (moduleName, status, processArea, quantity = null) => {
    if (!selectedCustomer) return;
    const u = { ...selectedCustomer };
    if (!u.data.modules) u.data.modules = [];
    
    const existingIdx = u.data.modules.findIndex(m => m.name === moduleName);
    if (existingIdx >= 0) {
      if (status === '') {
        u.data.modules.splice(existingIdx, 1);
      } else {
        const updates = { ...u.data.modules[existingIdx], status, processArea };
        // If quantity is provided, update it; if it's a user license without quantity, default to 1
        if (quantity !== null) {
          updates.quantity = quantity;
        } else if (!updates.quantity && (status === 'Licensed' || status === 'Opportunity')) {
          const moduleInfo = Object.values(moduleLibrary).flat().find(m => m.name === moduleName);
          if (moduleInfo?.type === 'User') {
            updates.quantity = 1;
          }
        }
        u.data.modules[existingIdx] = updates;
      }
    } else if (status !== '') {
      const newModule = { name: moduleName, status, processArea };
      // Default quantity to 1 for user licenses
      if (quantity !== null) {
        newModule.quantity = quantity;
      } else if (status === 'Licensed' || status === 'Opportunity') {
        const moduleInfo = Object.values(moduleLibrary).flat().find(m => m.name === moduleName);
        if (moduleInfo?.type === 'User') {
          newModule.quantity = 1;
        }
      }
      u.data.modules.push(newModule);
    }
    
    setSelectedCustomer(u);
    setCustomers(customers.map(c => c.id === u.id ? u : c));
    
    // Sync to analyzer immediately with the updated data
    if (showLicenseAnalyzer) {
      setTimeout(() => syncToAnalyzer(u), 50);
    }
  };


  const getModuleStatus = (moduleName) => {

    if (!selectedCustomer?.data?.modules) return '';

    const mod = selectedCustomer.data.modules.find(m => m.name === moduleName);

    return mod?.status || '';

  };

// Auto-save customers to localStorage whenever they change

useEffect(() => {

  setSavedData({ customers });

}, [customers]);



// Empty array means this runs once on mount



// Listen for updates from License Analyzer

useEffect(() => {

  const handleMessage = (event) => {


    

    if (event.data.type === 'THIRD_PARTY_UPDATE') {

  if (!selectedCustomer) {


    return;

  }

  


  

  const u = { ...selectedCustomer };

  if (!u.data.thirdParty) u.data.thirdParty = [];

  

  // Create a new array with only solutions that exist in the analyzer

  const updatedSolutions = [];

  

  event.data.customSolutions.forEach(newSolution => {

    if (newSolution.solutionName && newSolution.solutionName.trim()) {

      const existingIndex = u.data.thirdParty.findIndex(

        existing => existing.solutionName === newSolution.solutionName && 

                   existing.purpose === newSolution.purpose

      );

      

      if (existingIndex >= 0) {

        // Update existing solution


        updatedSolutions.push({

          ...u.data.thirdParty[existingIndex],

          ...newSolution

        });

      } else {

        // Add new solution


        updatedSolutions.push(newSolution);

      }

    }

  });

  

  // Replace the entire array (this removes deleted solutions)

  u.data.thirdParty = updatedSolutions;

  

  u.lastEdited = new Date().toISOString().split('T')[0];

  setSelectedCustomer(u);

  setCustomers(prev => prev.map(c => c.id === u.id ? u : c));

}

if (event.data.type === 'EVALUATION_UPDATE') {
      if (!selectedCustomer) {
        return;
      }
      
      
      const u = { ...selectedCustomer };
      if (!u.data.modules) u.data.modules = [];
      
      // Remove all existing opportunities that came from the analyzer
      u.data.modules = u.data.modules.filter(m => !(m.status === MODULE_STATUS.OPPORTUNITY && m.source === 'analyzer'));
      
      // Add new opportunities from evaluations
      event.data.evaluations.forEach(evalModule => {
        if (evalModule.name && evalModule.name.trim()) {
          // Get all possible notes app names for this analyzer name
          const possibleNotesNames = getNotesAppNamesForAnalyzer(evalModule.name);
          
          // Check if it's already licensed (check all possible names)
          const isLicensed = u.data.modules.some(m => 
            possibleNotesNames.includes(m.name) && m.status === 'Licensed'
          );
          
          // Check if it's already an opportunity (from any source, check all possible names)
          const isAlreadyOpportunity = u.data.modules.some(m =>
            possibleNotesNames.includes(m.name) && m.status === MODULE_STATUS.OPPORTUNITY
          );
          
          if (!isLicensed && !isAlreadyOpportunity) {
            u.data.modules.push({
              name: evalModule.name,
              status: 'Opportunity',
              processArea: evalModule.processArea,
              source: 'analyzer'
            });
          } else {
          }
        }
      });
      
      u.lastEdited = new Date().toISOString().split('T')[0];
      setSelectedCustomer(u);
      setCustomers(prev => prev.map(c => c.id === u.id ? u : c));
    }
  };

  

  window.addEventListener('message', handleMessage);

  return () => window.removeEventListener('message', handleMessage);

}, [selectedCustomer, setSelectedCustomer, setCustomers]);

// Real-time sync: whenever modules or third-party solutions change, sync to analyzer
useEffect(() => {
  if (!selectedCustomer || !showLicenseAnalyzer) return;
  
  const syncTimer = setTimeout(() => {
    syncToAnalyzer(selectedCustomer);
  }, 100); // Small delay to batch rapid changes
  
  return () => clearTimeout(syncTimer);
}, [selectedCustomer?.data?.modules, selectedCustomer?.data?.thirdParty, showLicenseAnalyzer]);

// Helper function to sync data to analyzer
const syncToAnalyzer = (customer) => {
  const iframe = document.getElementById('licenseAnalyzerFrame');
  if (!iframe || !iframe.contentWindow) return;

  // Get opportunities and map names to analyzer format
  const opportunities = (customer.data.modules || [])
    .filter(m => m.status === MODULE_STATUS.OPPORTUNITY)
    .map(m => ({
      name: mapModuleName(m.name), // Map to analyzer name
      processArea: m.processArea
    }));
  
  // Remove duplicates (e.g., ACS Monitor, ACS Optimize, ACS Architect all map to ACS)
  const uniqueOpportunities = opportunities.filter((opp, index, self) =>
    index === self.findIndex(o => o.name === opp.name)
  );
  
  iframe.contentWindow.postMessage({
    type: 'OPPORTUNITIES_SYNC_FROM_NOTES',
    opportunities: uniqueOpportunities
  }, '*');
  
  // Sync third-party solutions
  const solutions = (customer.data.thirdParty || []).map(sol => ({
    purpose: sol.purpose || '',
    solutionName: sol.solutionName || '',
    connectedToNS: sol.connectedToNS || 'unknown',
    connectorName: sol.connectorName || ''
  }));
  
  iframe.contentWindow.postMessage({
    type: 'THIRD_PARTY_SYNC_FROM_NOTES',
    solutions: solutions
  }, '*');
  
};



const syncOpportunitiesToAnalyzer = () => {

  if (!selectedCustomer) return;

  

  const iframe = document.getElementById('licenseAnalyzerFrame');

  if (iframe && iframe.contentWindow) {

    const opportunities = (selectedCustomer.data.modules || [])

      .filter(m => m.status === MODULE_STATUS.OPPORTUNITY)

      .map(m => ({ name: m.name, processArea: m.processArea }));

    

    iframe.contentWindow.postMessage({

      type: 'OPPORTUNITIES_SYNC_FROM_NOTES',

      opportunities: opportunities

    }, '*');

    


  }

};



const prepareAnalyzerData = (customer) => {
  const licensed = [];
  const opportunities = [];

  (customer.data.modules || []).forEach(module => {
    const mappedName = mapModuleName(module.name);

  


  

  // Only include if it's in the valid analyzer modules list

  if (!VALID_ANALYZER_MODULES.includes(mappedName)) {


    return; // Skip this module

  }

  

  if (module.status === MODULE_STATUS.LICENSED) {


    licensed.push(mappedName);

  } else if (module.status === MODULE_STATUS.OPPORTUNITY) {


    opportunities.push(mappedName);

  }

});











  // Get 3rd party solutions as custom solutions

const customSolutions = [];

(customer.data.thirdParty || []).forEach(solution => {

  if (solution.solutionName) {

    // Build solution name with connector in parenthesis if it exists

    let solutionDisplay = solution.solutionName;

    if (solution.connectorName) {

      solutionDisplay += ` (${solution.connectorName})`;

    }

    

    customSolutions.push({

      title: solution.purpose || 'Custom Solution',

      name: solutionDisplay,

      integrated: solution.connectedToNS === 'integrated' || solution.connectedToNS === 'both',

      manual: solution.connectedToNS === 'manual' || solution.connectedToNS === 'both'

    });

  }

});



  const fullLicenseUsers = (customer.data.modules || []).find(m => m.name === 'Full Licence Users' && m.status === 'Licensed');



return {

    customerName: customer.name,

    edition: customer.data.general?.baseSKU || '',

    serviceTier: customer.data.general?.tier || '',

    users: fullLicenseUsers?.quantity || '',

    licensed: licensed.join(', '),

    opportunities: opportunities.join(', '),

    customSolutions: customSolutions,

    isNonprofit: customer.data.general?.industry?.toLowerCase().includes('nonprofit') || false

  };

};

// Helper function now imported from constants/moduleMapping.js

const openLicenseAnalyzer = (customer) => {

  const data = prepareAnalyzerData(customer);




  setAnalyzerData(data);

  setShowLicenseAnalyzer(true);

};



  // Render input component

  const renderInput = (field, value, onChange) => {

    const baseClass = "w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100";

    

    switch (field.type) {

      case 'text':

  return <input 

    type="text" 

    value={value || ''} 

    onChange={(e) => onChange(e.target.value)} 

    maxLength={field.maxLength || undefined}

    className={baseClass} 

  />;

      

      case 'number':

  return <input 

    type="number" 

    value={value || ''} 

    onChange={(e) => onChange(e.target.value)} 

    max={field.maxLength ? Math.pow(10, field.maxLength) - 1 : undefined}

    className={`${baseClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 

  />;

      

      case 'currency':

        return (

          <div className="flex">

            <span className="px-2 py-1.5 text-sm bg-zinc-700 border border-r-0 border-zinc-700 rounded-l text-gray-300">$</span>

            <input type="text" value={value ? Number(value).toLocaleString() : ''} onChange={(e) => onChange(e.target.value.replace(/,/g, ''))} className={`${baseClass} rounded-l-none`} />

          </div>

        );

      

      case 'date':

        return <input type="date" value={value || ''} onChange={(e) => onChange(e.target.value)} className={baseClass} />;

      

      case 'url':

        return <input type="url" value={value || ''} onChange={(e) => onChange(e.target.value)} className={baseClass} />;

      

      case 'textarea':

        return (

          <textarea 

            value={value || ''} 

            onChange={(e) => {

              onChange(e.target.value);

              autoResizeTextarea(e.target);

            }}

            onInput={(e) => autoResizeTextarea(e.target)}

            rows={1} 

            className={`${baseClass} resize-none overflow-hidden`}

            style={{ minHeight: '2.5rem' }}

          />

        );

      case 'select':

        return (

          <select value={value || ''} onChange={(e) => onChange(e.target.value)} className={baseClass}>

            <option value="">Select...</option>

            {field.options?.map(o => <option key={o} value={o}>{o}</option>)}

          </select>

        );

      

      case 'multiselect':

        const contacts = selectedCustomer?.data?.contacts || [];

        const names = contacts.map(c => c.contactName).filter(n => n?.trim());

        const selected = value ? value.split(',').map(x => x.trim()) : [];

        return (

          <div className="space-y-1">

            {names.map(n => (

              <label key={n} className="flex items-center text-sm text-gray-300">

                <input 

                  type="checkbox" 

                  checked={selected.includes(n)} 

                  onChange={(e) => onChange(e.target.checked ? [...selected, n].join(', ') : selected.filter(x => x !== n).join(', '))} 

                  className="w-4 h-4 mr-2" 

                />

                {n}

              </label>

            ))}

            {names.length === 0 && <p className="text-sm text-gray-500">No contacts</p>}

          </div>

        );

      

      case 'taskStatus':

        return (

          <select value={value || ''} onChange={(e) => onChange(e.target.value)} className={baseClass}>

            {TASK_STATUSES.map(s => <option key={s} value={s}>{s || 'Select...'}</option>)}

          </select>

        );

            

      default:

        return null;

    }

  };



  // Render field grid

  const renderFieldGrid = (fields, section, cols = 3) => (

    <div className={`grid grid-cols-${cols} gap-3`}>

      {fields.map(f => (

        <div key={f.id} className={f.id === 'mission' ? 'col-span-3' : ''}>

          <label className="block font-medium text-gray-300 mb-1 text-sm">{f.label}</label>

          {renderInput(f, selectedCustomer.data[section]?.[f.id], (v) => updateField(section, f.id, v))}

        </div>

      ))}

    </div>

  );



  return (

    <div className="flex h-screen bg-zinc-950">

      {/* Sidebar */}

      <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">

  <div className="p-3 border-b border-zinc-800">

    <h1 className="text-xl font-bold text-gray-100 mb-3">Customer Notes</h1>

  </div>



<div className="p-3 border-b border-zinc-800">

  <div className="flex flex-col gap-2">

    <button onClick={createCustomer} className="w-full flex items-center justify-start gap-2 px-3 py-1.5 bg-[#86B596] hover:bg-[#86B596] text-zinc-900 rounded transition text-xs">

      <UserPlus size={14} />

      <span>Add New Customer</span>

    </button>

    <label className="w-full flex items-center justify-start gap-2 px-3 py-1.5 bg-[#E2C06B] text-zinc-900 rounded hover:bg-[#E2C06B] transition text-xs cursor-pointer">

      <Table size={14} />

      <span>Import Customer Record</span>

      <input type="file" accept=".xlsx,.xls" onChange={importFromExcel} className="hidden" />

    </label>

<button onClick={() => setShowAddModuleForm(true)} className="w-full flex items-center justify-start gap-2 px-3 py-1.5 bg-[#9B6B9E] text-zinc-900 rounded hover:bg-[#9B6B9E] transition text-xs">

      <Package size={14} />

      <span>Add New Product</span>

    </button>

    <button onClick={exportLibraryAsCode} className="w-full flex items-center justify-start gap-2 px-3 py-1.5 bg-[#FF8675] text-zinc-900 rounded hover:bg-[#FF8675] transition text-xs relative">

      <BookOpen size={14} />

      <span>Export Product Library</span>

      {libraryModified && (

        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-900"></span>

      )}

    </button>

    <button onClick={exportData} className="w-full flex items-center justify-start gap-2 px-3 py-1.5 bg-[#606988] text-zinc-900 rounded hover:bg-[#606988] transition text-xs">

      <Upload size={14} />

      <span>Export Notes Data</span>

    </button>

    <label className="w-full flex items-center justify-start gap-2 px-3 py-1.5 bg-[#558EA4] text-zinc-900 rounded hover:bg-[#558EA4] transition text-xs cursor-pointer">

      <Download size={14} />

      <span>Import Notes Data</span>

      <input type="file" accept=".json" onChange={importData} className="hidden" />

    </label>

    

  </div>

</div>

  <div className="flex-1 overflow-y-auto">

   {/* Customers Section */}

<div className="border-b border-zinc-800">

  <div className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800">

    <button

      onClick={() => {

        setActiveTab('customers');

        setSelectedCustomer(null);

      }}

      className="flex items-center gap-2 text-sm flex-1 text-left"

    >

      <Users size={16} className="text-gray-400" />

      <span className="font-semibold text-gray-200">Customers ({customers.length})</span>

    </button>

    <button

      onClick={() => setCustomersExpanded(!customersExpanded)}

      className="p-1 hover:bg-zinc-700 rounded"

    >

      {customersExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}

    </button>

  </div>

  {customersExpanded && (

  <div className="border-t border-zinc-700 bg-zinc-950">

    {customers.sort((a, b) => {

      const aHasTasks = customerHasTasks(a.id);

      const bHasTasks = customerHasTasks(b.id);

      const aHasOverdue = a.data.meetings?.some(m => hasOutstanding(m) && isMeetingOverdue(m));

      const bHasOverdue = b.data.meetings?.some(m => hasOutstanding(m) && isMeetingOverdue(m));

      

      // Red alerts first

      if (aHasOverdue && !bHasOverdue) return -1;

      if (!aHasOverdue && bHasOverdue) return 1;

      

      // Yellow alerts second

      if (aHasTasks && !aHasOverdue && !(bHasTasks || bHasOverdue)) return -1;

      if (bHasTasks && !bHasOverdue && !(aHasTasks || aHasOverdue)) return 1;

      

      // Alphabetical within each group

      return a.name.localeCompare(b.name);

    }).map(c => (

        <div 

          key={c.id} 

          onClick={() => { setSelectedCustomer(c); setActiveTab('customers'); }} 

          className={`px-3 py-2 border-b border-zinc-800 cursor-pointer hover:bg-zinc-800 transition ${selectedCustomer?.id === c.id ? 'bg-zinc-800 border-l-2 border-l-zinc-500' : ''}`}

        >

              <div className="flex items-center gap-2">

                {customerHasTasks(c.id) && (() => {

                  const hasOverdue = c.data.meetings?.some(m => hasOutstanding(m) && isMeetingOverdue(m));

                  return <span className={`${hasOverdue ? 'text-[#C74364] hover:text-[#D96682]' : 'text-amber-400'} text-xs`}>⚠ </span>;

                })()}

                {!customerHasModules(c.id) && <span className="text-[#C74364] hover:text-[#D96682] text-xs">●</span>}

                <div className="flex-1 min-w-0">

                  <h3 className="font-semibold text-gray-100 text-sm truncate">{c.name}</h3>

                  <p className="text-xs text-gray-500">{c.lastEdited}</p>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>



    {/* Tasks Section */}

<div className="border-b border-zinc-800">

  <div className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800">

    <button

      onClick={() => setActiveTab('summary')}

      className="flex items-center gap-2 text-sm flex-1 text-left"

    >

      <FileText size={16} className="text-gray-400" />

      <span className="font-semibold text-gray-200">Outstanding Tasks ({getAllTasks().length})</span>

    </button>

    <button

      onClick={() => setTasksExpanded(!tasksExpanded)}

      className="p-1 hover:bg-zinc-700 rounded"

    >

      {tasksExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}

    </button>

  </div>

  {tasksExpanded && (

  <div className="border-t border-zinc-700 bg-zinc-950">

    {getAllTasks().length > 0 ? (

      getAllTasks().sort((a, b) => {

        // Red (overdue) first

        if (a.isOverdue && !b.isOverdue) return -1;

        if (!a.isOverdue && b.isOverdue) return 1;

        // Then alphabetical by customer name

        return a.customerName.localeCompare(b.customerName);

      }).map((t, i) => (

              <div key={i} className="border-t border-zinc-800 px-3 py-2 bg-zinc-950 hover:bg-zinc-900 cursor-pointer" onClick={() => { 

                setSelectedCustomer(customers.find(c => c.id === t.customerId)); 

                setActiveTab('customers'); 

                setExpandedMeetings({ [t.meetingIndex]: true }); 

              }}>

                <div className="font-semibold text-gray-200 text-xs mb-1">

                  {t.customerName}

                </div>

                <div className="flex items-start gap-2">

                  <button 

                    className={`text-xs ${getRatingColor(t.rating)} hover:opacity-80 text-left flex-1`}

                  >

                    {t.meetingTitle}

                  </button>

                  <div className="flex items-center gap-1 flex-shrink-0">

                    {t.link && <a href={t.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200" onClick={(e) => e.stopPropagation()}><Globe size={12} /></a>}

                    {t.isOverdue ? (

                      <span className="text-[#C74364] hover:text-[#D96682] text-xs">⚠ </span>

                    ) : (

                      <span className="text-amber-400 text-xs">⚠ </span>

                    )}

                  </div>

                </div>

              </div>

            ))

          ) : (

            <p className="text-sm text-gray-500 px-3 py-2">No outstanding tasks</p>

          )}

        </div>

      )}

    </div>



    {/* Modules Section */}

<div className="border-b border-zinc-800">

  <div className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800">

    <button

      onClick={() => setActiveTab('modules')}

      className="flex items-center gap-2 text-sm flex-1 text-left"

    >

      <Package size={16} className="text-gray-400" />

      <span className="font-semibold text-gray-200">Product Library</span>

    </button>

    <button

      onClick={() => setModulesExpanded(!modulesExpanded)}

      className="p-1 hover:bg-zinc-700 rounded"

    >

      {modulesExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}

    </button>

  </div>

  {modulesExpanded && (

    <div className="border-t border-zinc-800 bg-zinc-950">

      {MODULE_TYPES.map(type => (

        <button 

          key={type}

          onClick={() => setActiveTab(`type-${type}`)} 

          className={`w-full flex items-center gap-2 pl-8 pr-3 py-2 text-sm border-b border-zinc-800 ${activeTab === `type-${type}` ? 'bg-zinc-700 text-white' : 'text-gray-300 hover:bg-zinc-800'}`}

        >

          <span>{type === 'AI' ? 'AI' : `${type}s`}</span>

        </button>

      ))}

    </div>

  )}

</div>

  </div>

</div>

      {/* Main Content */}

      <div className="flex-1 flex flex-col overflow-hidden">

        {activeTab === 'summary' ? (

          <div className="flex-1 overflow-y-auto p-4">

           <div className="px-4">

              <h2 className="text-2xl font-bold text-gray-100 mb-4">All Outstanding Tasks</h2>

             {getAllTasks().length > 0 ? (

  <div className="space-y-2">

    {customers.filter(c => customerHasTasks(c.id)).sort((a, b) => {

      const aHasOverdue = a.data.meetings?.some(m => hasOutstanding(m) && isMeetingOverdue(m));

      const bHasOverdue = b.data.meetings?.some(m => hasOutstanding(m) && isMeetingOverdue(m));

      

      // Red (overdue) first

      if (aHasOverdue && !bHasOverdue) return -1;

      if (!aHasOverdue && bHasOverdue) return 1;

      

      // Then alphabetical

      return a.name.localeCompare(b.name);

    }).map(c => (

      <div key={c.id} className="bg-zinc-900 rounded border border-zinc-800 p-2.5">

        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-500 flex-shrink-0">•</span>
          <h3 className="font-semibold text-gray-200 text-sm">{c.name}</h3>
        </div>

        <div className="space-y-2">

          {getAllTasks().filter(t => t.customerId === c.id).sort((a, b) => {

            // Red (overdue) first within customer

            if (a.isOverdue && !b.isOverdue) return -1;

            if (!a.isOverdue && b.isOverdue) return 1;

            return 0;

         }).map((t, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-zinc-950 rounded border border-zinc-800">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { 
                    setSelectedCustomer(c); 
                    setActiveTab('customers'); 
                    setExpandedMeetings({ [t.meetingIndex]: true }); 
                  }} 
                  className={`text-xs ${getRatingColor(t.rating)} hover:opacity-80`}
                >
                  {t.meetingTitle}
                </button>
                {t.link && <a href={t.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200"><Globe size={14} /></a>}
              </div>
              {t.isOverdue ? (
                <span className="text-[#C74364] hover:text-[#D96682] text-xs">⚠</span>
              ) : (
                <span className="text-amber-400 text-xs">⚠</span>
              )}
            </div>
          ))}

        </div>

      </div>

    ))}

  </div>

) : (

  <p className="text-gray-500">No outstanding tasks</p>

)}

            </div>

          </div>           

        

        ) : activeTab === 'modules' ? (

          <div className="flex-1 overflow-y-auto p-4">

            <div className="px-4">

              <div className="flex items-center justify-between mb-4">

  <h2 className="text-2xl font-bold text-gray-100">Product Library</h2>

  <div className="flex gap-2">

<button onClick={() => setShowAddModuleForm(true)} className="flex items-center gap-2 px-3 py-1.5 bg-[#9B6B9E] hover:bg-[#9B6B9E] text-zinc-900 rounded transition text-xs">

      <Package size={14} />

      <span>Add New Product</span>

    </button>

    <button onClick={exportLibraryAsCode} className="flex items-center gap-2 px-3 py-1.5 bg-[#FF8675] text-zinc-900 rounded hover:bg-[#FF8675] text-zinc-900 rounded transition text-xs relative">

      <BookOpen size={14} />

      <span>Export Product Library</span>

      {libraryModified && (

        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-900"></span>

      )}

    </button>

  </div>

</div>

              

              {showAddModuleForm && (

  <div className="mb-4 p-4 bg-zinc-900 rounded border border-zinc-800">

    <h3 className="text-lg font-bold text-gray-100 mb-3">Add New Module</h3>

    <div className="grid grid-cols-2 gap-3">

      <div>

        <label className="block font-medium text-gray-300 mb-1 text-sm">Module Name</label>

        <input 

          type="text" 

          value={newModule.name} 

          onChange={(e) => setNewModule({...newModule, name: e.target.value})} 

          className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100" 

        />

      </div>

      <div>

        <label className="block font-medium text-gray-300 mb-1 text-sm">Type</label>

        <select 

          value={newModule.type} 

          onChange={(e) => setNewModule({...newModule, type: e.target.value})} 

          className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100"

        >

          {MODULE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}

        </select>

      </div>

      <div>

        <label className="block font-medium text-gray-300 mb-1 text-sm">Process Area</label>

        <select 

          value={newModule.processArea} 

          onChange={(e) => setNewModule({...newModule, processArea: e.target.value})} 

          className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100"

        >

          <option value="">Select...</option>

          {Object.keys(moduleLibrary).map(area => <option key={area} value={area}>{area}</option>)}

          <option value="NEW">+ Create New Category</option>

        </select>

        {newModule.processArea === 'NEW' && (

          <input 

            type="text" 

            placeholder="New category name" 

            onChange={(e) => setNewModule({...newModule, processArea: e.target.value})} 

            className="w-full mt-2 px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100" 

          />

        )}

      </div>

      <div>

        <label className="block font-medium text-gray-300 mb-1 text-sm">Link</label>

        <input 

          type="url" 

          value={newModule.link} 

          onChange={(e) => setNewModule({...newModule, link: e.target.value})} 

          className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100" 

        />

      </div>

    </div>

    <div className="mt-3">

      <label className="block font-medium text-gray-300 mb-1 text-sm">Overview</label>

      <textarea 

        value={newModule.overview} 

        onChange={(e) => setNewModule({...newModule, overview: e.target.value})} 

        rows={2} 

        className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100" 

      />

    </div>

    <div className="mt-3">

      <label className="block font-medium text-gray-300 mb-1 text-sm">Prerequisites/Considerations</label>

      <textarea 

        value={newModule.prerequisites || ''} 

        onChange={(e) => setNewModule({...newModule, prerequisites: e.target.value})} 

        rows={2} 

        placeholder="Prerequisites, dependencies, or important considerations..."

        className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100" 

      />

    </div>

    <div className="flex gap-2 mt-3">

      <button onClick={addModuleToLibrary} className="px-3 py-1.5 bg-[#86B596] hover:bg-[#7BA586] text-white rounded bg-[#86B596] hover:bg-[#7BA586] transition text-sm">Add Module</button>

      <button 

        onClick={() => { 

          setShowAddModuleForm(false); 

          setNewModule({ name: '', type: 'Module', overview: '', link: '', processArea: '', prerequisites: '' }); 

        }} 

        className="px-3 py-1.5 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition text-sm"

      >

        Cancel

      </button>

    </div>

  </div>

)}

              

              <div className="space-y-2">

                {Object.keys(moduleLibrary).map(processArea => (

                  <div key={processArea} className="bg-zinc-900 rounded border border-zinc-800 p-2.5">

                    <button 
                      onClick={() => setExpandedProcessAreas(p => ({ ...p, [processArea]: !p[processArea] }))} 
                      className="w-full flex items-center justify-between hover:bg-zinc-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 flex-shrink-0">•</span>
                        <h3 className="text-sm font-semibold text-gray-200">{processArea}</h3>
                      </div>
                      <div className="flex items-center gap-2">

                        <span className="text-xs text-gray-500">({moduleLibrary[processArea].length})</span>

                        {expandedProcessAreas[processArea] ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}

                      </div>

                    </button>

                    {expandedProcessAreas[processArea] && (

                      <div className="pt-3 pb-2">

                        {moduleLibrary[processArea].length > 0 ? (

                          <div className="space-y-2">

                     {moduleLibrary[processArea].map((mod, i) => {

  const isEditing = editingModule === `${processArea}-${i}`;

  return (

    <div 

      key={i} 

      draggable={!isEditing}

      onDragStart={(e) => {

        setDraggedModule({ processArea, index: i, module: mod });

        e.dataTransfer.effectAllowed = 'move';

      }}

      onDragOver={(e) => {

        e.preventDefault();

        e.dataTransfer.dropEffect = 'move';

      }}

      onDrop={(e) => {

        e.preventDefault();

        if (!draggedModule) return;

        

        // Remove from old location

        const newLibrary = { ...moduleLibrary };

        newLibrary[draggedModule.processArea] = newLibrary[draggedModule.processArea].filter((_, idx) => idx !== draggedModule.index);

        

        // Add to new location

        if (!newLibrary[processArea]) newLibrary[processArea] = [];

        newLibrary[processArea].splice(i, 0, draggedModule.module);

        

        setModuleLibrary(newLibrary);

        setDraggedModule(null);

      }}

      onDragEnd={() => setDraggedModule(null)}

      className={`border border-zinc-800 rounded p-3 bg-zinc-950 ${!isEditing ? 'cursor-move hover:border-zinc-600' : ''} ${draggedModule?.processArea === processArea && draggedModule?.index === i ? 'opacity-50' : ''}`}

    >

      <div className="flex items-start justify-between mb-2">

        <div className="flex-1">

          {isEditing ? (

            <>

              <input 

                type="text" 

                value={mod.name} 

                onChange={(e) => updateModuleInLibrary(processArea, i, 'name', e.target.value)} 

                className="font-semibold text-gray-200 text-sm bg-zinc-800 border border-zinc-700 rounded px-2 py-1 w-full mb-1" 

              />

              <select 

                value={mod.type} 

                onChange={(e) => updateModuleInLibrary(processArea, i, 'type', e.target.value)} 

                className="text-xs text-gray-500 bg-zinc-800 border border-zinc-700 rounded px-2 py-1"

              >

                {MODULE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}

              </select>

            </>

          ) : (

            <>

              <h4 className="font-semibold text-gray-200 text-xs">{mod.name}</h4>

              <span className="text-[10px] text-gray-500">{mod.type}</span>

            </>

          )}

        </div>

        <div className="flex items-center gap-2">

          {mod.link && <a href={mod.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200"><Globe size={16} /></a>}

          {isEditing ? (

            <button 

              onClick={() => setEditingModule(null)} 

              className="text-emerald-400 hover:text-emerald-300 text-xs px-2 py-1 bg-zinc-800 rounded"

            >

              Done

            </button>

          ) : (

            <button 

              onClick={() => setEditingModule(`${processArea}-${i}`)} 

              className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 bg-zinc-800 rounded"

            >

              Edit

            </button>

          )}

         <button 
    onClick={() =>setDeleteConfirmation({
    message: `Are you sure you want to remove "${mod.name}" from the library?`,
    onConfirm: () => deleteModuleFromLibrary(processArea, i)
})} 
className="text-[#C74364] hover:text-[#D96682]">
    <Trash2 size={12} />
</button>


        </div>

      </div>

      {isEditing ? (

        <>

          <div className="mt-2">

            <label className="block font-medium text-gray-300 mb-1 text-xs">Overview</label>

            <textarea 

              value={mod.overview || ''} 

              onChange={(e) => updateModuleInLibrary(processArea, i, 'overview', e.target.value)} 

              placeholder="Overview..." 

              className="text-sm text-gray-400 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 w-full" 

              rows={2} 

            />

          </div>

          <div className="mt-2">

            <label className="block font-medium text-gray-300 mb-1 text-xs">Prerequisites/Considerations</label>

            <textarea 

              value={mod.prerequisites || ''} 

              onChange={(e) => updateModuleInLibrary(processArea, i, 'prerequisites', e.target.value)} 

              placeholder="Prerequisites, dependencies, or important considerations..." 

              className="text-sm text-gray-400 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 w-full" 

              rows={2} 

            />

          </div>

          <div className="mt-2">

            <label className="block font-medium text-gray-300 mb-1 text-xs">Link</label>

            <input 

              type="url" 

              value={mod.link || ''} 

              onChange={(e) => updateModuleInLibrary(processArea, i, 'link', e.target.value)} 

              placeholder="Link URL..." 

              className="text-sm text-gray-400 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 w-full" 

            />

          </div>

        </>

      ) : (

        <>

          {mod.overview && (

            <div className="mt-2">

              <label className="block font-medium text-gray-300 mb-1 text-[10px]">Overview</label>
              <p className="text-xs text-gray-400">{mod.overview}</p>

            </div>

          )}

          {mod.prerequisites && (

            <div className="mt-2">

              <label className="block font-medium text-gray-300 mb-1 text-[10px]">Prerequisites/Considerations</label>
              <p className="text-xs text-gray-400">{mod.prerequisites}</p>

            </div>

          )}

        </>

      )}

    </div>

  );

})}

                          </div>

                        ) : (

                          <p className="text-sm text-gray-500 py-2">No modules in this category yet.</p>

                        )}

                      </div>

                    )}

                  </div>

                ))}

              </div>

            </div>

          </div>

) : activeTab.startsWith('type-') ? (

  <div className="flex-1 overflow-y-auto p-4">

    <div className="max-w-6xl mx-auto">

      {MODULE_TYPES.map(moduleType => {

        if (activeTab !== `type-${moduleType}`) return null;

        

        return (

          <div key={moduleType}>

            <h2 className="text-2xl font-bold text-white mb-4">{moduleType === 'AI' ? 'AI' : `${moduleType}s`}</h2>

            <div className="space-y-3">

              {Object.keys(moduleLibrary).map(processArea => {

                const modulesOfType = moduleLibrary[processArea].filter(mod => mod.type === moduleType);

                if (modulesOfType.length === 0) return null;

                

                return (

                  <div key={processArea} className="bg-zinc-900 rounded border border-zinc-800 p-4">

                    <h3 className="text-lg font-bold text-white mb-3">{processArea}</h3>

                    <div className="space-y-2">

                      {modulesOfType.map((mod, i) => (

                        <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-950">

                          <div className="flex items-center justify-between mb-2">

                            <div className="flex items-center gap-2">

                              <h4 className="font-semibold text-gray-200 text-sm">{mod.name}</h4>

                              {mod.link && <a href={mod.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200"><Globe size={16} /></a>}

                            </div>

                            <span className="text-xs text-gray-500">{mod.type}</span>

                          </div>

                          {mod.overview && <p className="text-sm text-gray-400">{mod.overview}</p>}

                        </div>

                      ))}

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        );

      })}

    </div>

  </div>

        ) : activeTab === 'customers' && !selectedCustomer ? (

          <div className="flex-1 overflow-y-auto p-4">

  <div className="px-4">

   <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold text-gray-100">All Customers</h2>
        <div className="flex items-center gap-3">
          {/* Toggle buttons */}
          <div className="flex bg-zinc-800 rounded border border-zinc-700">
            <button 
              onClick={() => setCustomerSortMode('alphabetical')}
              className={`px-3 py-1.5 text-xs transition ${customerSortMode === 'alphabetical' ? 'bg-zinc-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              A-Z
            </button>
            <button 
              onClick={() => setCustomerSortMode('sectioned')}
              className={`px-3 py-1.5 text-xs transition ${customerSortMode === 'sectioned' ? 'bg-zinc-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              By Type
            </button>
            <button 
              onClick={() => setCustomerSortMode('recent')}
              className={`px-3 py-1.5 text-xs transition ${customerSortMode === 'recent' ? 'bg-zinc-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Most Recent
            </button>
          </div>
          <button onClick={createCustomer} className="flex items-center gap-2 px-3 py-1.5 bg-[#86B596] hover:bg-[#86B596] text-zinc-900 rounded transition text-xs">
            <UserPlus size={14} />
            <span>Add New Customer</span>
          </button>
          <label className="flex items-center gap-2 px-3 py-1.5 bg-[#E2C06B] text-zinc-900 rounded hover:bg-[#E2C06B] transition text-xs cursor-pointer">
            <Table size={14} />
            <span>Import Customer Record</span>
            <input type="file" accept=".xlsx,.xls" onChange={importFromExcel} className="hidden" />
          </label>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search customers..."
        value={customerSearchQuery}
        onChange={(e) => setCustomerSearchQuery(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100 placeholder-gray-500"
      />
    </div>

{customerSortMode === 'alphabetical' ? (
  /* Alphabetical View - All Customers */
  <CustomerGrid
    customers={customers
      .filter(c => c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name))}
    onSelectCustomer={setSelectedCustomer}
    customerHasTasks={customerHasTasks}
    customerHasModules={customerHasModules}
    isMeetingOverdue={isMeetingOverdue}
    hasOutstanding={hasOutstanding}
  />
) : customerSortMode === 'recent' ? (
  /* Most Recent View - Sorted by Last Edited */
  <CustomerGrid
    customers={customers
      .filter(c => c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()))
      .sort((a, b) => {
        // Sort by most recent date first (descending)
        const dateCompare = b.lastEdited.localeCompare(a.lastEdited);
        // If dates are equal, sort by name (ascending)
        return dateCompare !== 0 ? dateCompare : a.name.localeCompare(b.name);
      })}
    onSelectCustomer={setSelectedCustomer}
    customerHasTasks={customerHasTasks}
    customerHasModules={customerHasModules}
    isMeetingOverdue={isMeetingOverdue}
    hasOutstanding={hasOutstanding}
  />) : (
  /* Sectioned View - Nonprofits and For-Profits */
  <>
  
    {/* Nonprofits Section */}

    {customers.filter(c => c.data.general?.industry?.toLowerCase().includes('nonprofit') && c.name.toLowerCase().includes(customerSearchQuery.toLowerCase())).length > 0 && (
      <>
        <h3 className="text-xl font-semibold text-gray-100 mb-3 mt-6">Nonprofits</h3>
        <CustomerGrid
          customers={customers
            .filter(c => c.data.general?.industry?.toLowerCase().includes('nonprofit') && c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name))}
          onSelectCustomer={setSelectedCustomer}
          customerHasTasks={customerHasTasks}
          customerHasModules={customerHasModules}
          isMeetingOverdue={isMeetingOverdue}
          hasOutstanding={hasOutstanding}
        />

        <div className="mb-6" />

      </>

    )}

    

   {/* For-Profits Section */}

    {customers.filter(c => !c.data.general?.industry?.toLowerCase().includes('nonprofit') && c.name.toLowerCase().includes(customerSearchQuery.toLowerCase())).length > 0 && (
      <>
        <h3 className="text-xl font-semibold text-gray-100 mb-3 mt-6">For-Profits</h3>
        <CustomerGrid
          customers={customers
            .filter(c => !c.data.general?.industry?.toLowerCase().includes('nonprofit') && c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name))}
          onSelectCustomer={setSelectedCustomer}
          customerHasTasks={customerHasTasks}
          customerHasModules={customerHasModules}
          isMeetingOverdue={isMeetingOverdue}
          hasOutstanding={hasOutstanding}
        />

      </>

    )}

  </>

)}        

</div>  

</div>  



) : selectedCustomer ? (

          <>

            {/* Module Selector Modal */}

            {showModuleSelector && (

  <div className="fixed inset-0 bg-zinc-950 bg-opacity-50 flex items-center justify-center z-50 py-12 px-8" onClick={() => setShowModuleSelector(false)}>

    <div className="bg-zinc-900 rounded-lg border border-zinc-800 w-full max-w-4xl max-h-full overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>

      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">

        <h3 className="text-xl font-bold text-gray-100">Select Modules/SuiteApps</h3>

        <button onClick={() => setShowModuleSelector(false)} className="text-gray-400 hover:text-gray-200"><X size={24} /></button>

      </div>

      <div className="flex-1 overflow-y-auto p-4">

        {Object.keys(moduleLibrary).map(processArea => (

          <div key={processArea} className="mb-4 border border-zinc-800 rounded bg-zinc-950">

            <button

              onClick={() => setExpandedModalProcessAreas(p => ({ ...p, [processArea]: !p[processArea] }))}

              className="w-full flex items-center justify-between p-3 hover:bg-zinc-900"

            >

              <h4 className="font-bold text-gray-200">{processArea}</h4>

              <div className="flex items-center gap-2">

                <span className="text-xs text-gray-500">({moduleLibrary[processArea].length})</span>

                {expandedModalProcessAreas[processArea] ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}

              </div>

            </button>

            {expandedModalProcessAreas[processArea] && (

              <div className="p-3 pt-0">

                {moduleLibrary[processArea].length > 0 ? (

                  <div className="space-y-2">

                   

{moduleLibrary[processArea].map((mod, i) => {

  const currentModule = selectedCustomer.data.modules?.find(m => m.name === mod.name);

  const isUserType = mod.type === 'User';

  

  return (

    <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-900">

      <div className="flex items-start gap-3">

        <div className="flex-1">

          <div className="flex items-center gap-2">

            <h5 className="font-semibold text-gray-200 text-sm">{mod.name}</h5>

            {mod.link && <a href={mod.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200"><Globe size={14} /></a>}

          </div>

          <p className="text-xs text-gray-500">{mod.type}</p>

          {mod.overview && (

            <div className="mt-2">

              <p className="text-xs font-bold text-gray-300">Overview:</p>

              <p className="text-xs text-gray-400 ml-3 mt-0.5">{mod.overview}</p>

            </div>

          )}

          {mod.prerequisites && (

            <div className="mt-2">

              <p className="text-xs font-bold text-gray-300">Prerequisites/Considerations:</p>

              <p className="text-xs text-gray-400 ml-3 mt-0.5">{mod.prerequisites}</p>

            </div>

          )}

        </div>        

{isUserType ? (

          <div className="flex gap-2 flex-wrap items-start">

            {/* Licensed number input */}

            <div className="flex flex-col items-center">

              <input

                type="number"

                min="0"

                value={getModuleStatus(mod.name) === 'Licensed' ? (currentModule?.quantity || 1) : ''}

                onChange={(e) => {

                  const qty = parseInt(e.target.value) || 0;

                  if (qty > 0) {

                    updateModuleStatus(mod.name, 'Licensed', processArea, qty);

                  } else {

                    updateModuleStatus(mod.name, '', processArea);

                  }

                }}

                placeholder="0"

                className="w-12 px-1 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

              />

              <span className="text-xs text-gray-400 mt-1">Lic</span>

            </div>

            

            {/* Opportunity number input */}

            <div className="flex flex-col items-center">

              <input

                type="number"

                min="0"

                value={getModuleStatus(mod.name) === 'Opportunity' ? (currentModule?.quantity || 1) : ''}

                onChange={(e) => {

                  const qty = parseInt(e.target.value) || 0;

                  if (qty > 0) {

                    updateModuleStatus(mod.name, 'Opportunity', processArea, qty);

                  } else {

                    updateModuleStatus(mod.name, '', processArea);

                  }

                }}

                placeholder="0"

                className="w-12 px-1 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

              />

              <span className="text-xs text-gray-400 mt-1">Opp</span>

            </div>

            

            {/* Radio buttons for other statuses */}

            {['Dropped', 'Lost', 'CAI', 'Rec'].map((status, idx) => {

              const labels = ['Drop', 'Lost', 'CAI', 'Rec'];

              return (

                <label key={status} className="flex flex-col items-center">

                  <input

                    type="radio"

                    name={`module-${processArea}-${i}`}

                    checked={getModuleStatus(mod.name) === status}

                    onChange={() => updateModuleStatus(mod.name, status, processArea)}

                    className="w-4 h-4"

                  />

                  <span className="text-xs text-gray-400 mt-1">{labels[idx]}</span>

                </label>

              );

            })}

          </div>

        ) : (

          <div className="flex gap-2 flex-wrap">

            {['Licensed', 'Dropped', 'Opportunity', 'Lost', 'CAI', 'Rec'].map((status, idx) => {

              const labels = ['Lic', 'Drop', 'Opp', 'Lost', 'CAI', 'Rec'];

              return (

                <label key={status} className="flex flex-col items-center">

                  <input

                    type="radio"

                    name={`module-${processArea}-${i}`}

                    checked={getModuleStatus(mod.name) === status}

                    onChange={() => updateModuleStatus(mod.name, status, processArea)}

                    className="w-4 h-4"

                  />

                  <span className="text-xs text-gray-400 mt-1">{labels[idx]}</span>

                </label>

              );

            })}

          </div>

        )}

      </div>

    </div>

  );

})}

                  </div>

                ) : (

                  <p className="text-sm text-gray-500">No modules in this category.</p>

                )}

              </div>

            )}

          </div>

        ))}

      </div>

      <div className="p-4 border-t border-zinc-800">

        <button onClick={() => setShowModuleSelector(false)} className="w-full px-4 py-2 bg-[#86B596] hover:bg-[#7BA586] text-white rounded bg-[#86B596] hover:bg-[#7BA586] transition">Done</button>

      </div>

    </div>

  </div>

)}



            {/* Customer Header */}

<div className="bg-zinc-900 border-b border-zinc-800 p-4">

  <input 

    type="text" 

    value={selectedCustomer.name} 

    onChange={(e) => updateName(e.target.value)} 

    className="text-2xl font-bold text-gray-100 bg-transparent border-none focus:outline-none w-full" 

  />

  <div className="flex items-center gap-2 mt-1">

    <p className="text-xs text-gray-500">Last Edited: {selectedCustomer.lastEdited}</p>

    <button 

      onClick={() => openLicenseAnalyzer(selectedCustomer)}

      className="flex items-center gap-1 px-2 py-1 bg-[#3B7087] text-white rounded hover:bg-[#336073] transition text-xs"

    >

      <Brain size={14} />

      <span>License Analysis</span>

    </button>

    <button 

      onClick={() => setDeleteConfirmation({

        message: `Are you sure you want to delete "${selectedCustomer.name}"? This action cannot be undone.`,

        onConfirm: () => deleteCustomer(selectedCustomer.id)

      })} 

      className="text-[#C74364] hover:text-[#D96682] transition"

    >

      <Trash2 size={14} />

    </button>

  </div>

</div>



            {/* Notes Section */}

            <div className="bg-zinc-900 border-b border-zinc-800 p-4">

              <button 

                onClick={() => setNotesExpanded(!notesExpanded)} 

                className="flex items-center justify-between w-full"

              >

                <div className="flex items-center gap-2">

                  <span className="font-semibold text-gray-300 text-sm">General Notes</span>

                  {selectedCustomer.data.overview?.generalNotes && !notesExpanded && (

                    <span className="text-[#FF8675] text-xs">●</span>

                  )}

                </div>

                {notesExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}

              </button>

              {notesExpanded && (

                <textarea 

                  value={selectedCustomer.data.overview?.generalNotes || ''} 

                  onChange={(e) => {

                    updateField('overview', 'generalNotes', e.target.value);

                    autoResizeTextarea(e.target);

                  }}

                  onFocus={(e) => autoResizeTextarea(e.target)}

                  rows={3} 

                  className="w-full mt-2 px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100 resize-none overflow-hidden" 

                  style={{ minHeight: '4rem' }}

                />

              )}

            </div>



            {/* Main Content Area */}

            <div className="flex-1 flex overflow-hidden">

              {/* Left Panel - Customer Details */}

              <div className="flex-1 overflow-y-auto p-2">

                <div className="max-w-4xl mx-auto">

                  {/* Customer Overview */}

<CollapsibleSection
  title="Customer Overview"
  isExpanded={expandedSections.overview}
  onToggle={() => setExpandedSections(p => ({ ...p, overview: !p.overview }))}
  className="bg-zinc-900 rounded border border-zinc-800 p-2.5 mb-3"
>

                        <div className="mt-4 p-3 bg-zinc-950 border border-zinc-800 rounded">

  <h4 className="font-bold text-gray-200 mb-3 text-sm">General Information</h4>

  <div className="space-y-3">

    {/* Row 1: Industry (wider), Annual Budget, Employees (smaller) */}

    <div className="grid grid-cols-12 gap-3">

      <div className="col-span-5">

        <label className="block font-medium text-gray-300 mb-1 text-sm">Industry</label>

        {renderInput(GENERAL_FIELDS.find(f => f.id === 'industry'), selectedCustomer.data.general?.industry, (v) => updateField('general', 'industry', v))}

      </div>

      <div className="col-span-4">

        <label className="block font-medium text-gray-300 mb-1 text-sm">Annual Budget</label>

        {renderInput(GENERAL_FIELDS.find(f => f.id === 'annualBudget'), selectedCustomer.data.general?.annualBudget, (v) => updateField('general', 'annualBudget', v))}

      </div>

      <div className="col-span-3">

        <label className="block font-medium text-gray-300 mb-1 text-sm"># of Employees</label>

        {renderInput(GENERAL_FIELDS.find(f => f.id === 'employees'), selectedCustomer.data.general?.employees, (v) => updateField('general', 'employees', v))}

      </div>

    </div>

    {/* Row 2: Customer #, Acquisition, ARR */}

    <div className="grid grid-cols-3 gap-3">

      {GENERAL_FIELDS.filter(f => f.row === 2).map(f => (

        <div key={f.id}>

          <label className="block font-medium text-gray-300 mb-1 text-sm">{f.label}</label>

          {renderInput(f, selectedCustomer.data.general?.[f.id], (v) => updateField('general', f.id, v))}

        </div>

      ))}

    </div>

    {/* Row 3: Base SKU (wider), Tier, Subs (smaller), C/C (smaller) */}

    <div className="grid grid-cols-12 gap-3">

      <div className="col-span-5">

        <label className="block font-medium text-gray-300 mb-1 text-sm">Base SKU</label>

        {renderInput(GENERAL_FIELDS.find(f => f.id === 'baseSKU'), selectedCustomer.data.general?.baseSKU, (v) => updateField('general', 'baseSKU', v))}

      </div>

      <div className="col-span-3">

        <label className="block font-medium text-gray-300 mb-1 text-sm">Tier</label>

        {renderInput(GENERAL_FIELDS.find(f => f.id === 'tier'), selectedCustomer.data.general?.tier, (v) => updateField('general', 'tier', v))}

      </div>

      <div className="col-span-2">

        <label className="block font-medium text-gray-300 mb-1 text-sm">Subs</label>

        {renderInput(GENERAL_FIELDS.find(f => f.id === 'subs'), selectedCustomer.data.general?.subs, (v) => updateField('general', 'subs', v))}

      </div>

      <div className="col-span-2">

        <label className="block font-medium text-gray-300 mb-1 text-sm">C/C</label>

        {renderInput(GENERAL_FIELDS.find(f => f.id === 'cc'), selectedCustomer.data.general?.cc, (v) => updateField('general', 'cc', v))}

      </div>

    </div>

  </div>

</div>

                        

                        {selectedCustomer.data.general?.industry?.toLowerCase().includes('nonprofit') && (

                          <div className="mt-4 p-3 bg-zinc-950 border border-zinc-800 rounded">

                            <h4 className="font-bold text-gray-200 mb-3 text-sm">Nonprofit</h4>

                            {renderFieldGrid(NONPROFIT_FIELDS, 'nonprofit')}

                          </div>

                        )}

                        

                        <div className="mt-4 p-3 bg-black border border-zinc-800 rounded">

  <div className="flex items-center gap-2 mb-3">

    <h4 className="font-bold text-gray-200 text-sm">Health Check</h4>

    <div className="group relative">

      <Info size={14} className="text-gray-500 hover:text-gray-300 cursor-help" />

      <div className="invisible group-hover:visible absolute left-0 top-6 w-80 p-3 bg-zinc-800 border border-zinc-700 rounded shadow-lg text-xs text-gray-300 z-50">

        Regular health checks help you optimize performance, avoid disruptions, and ensure your NetSuite account is aligned with your current and future business needs.

      </div>

    </div>

  </div>

  <div className="space-y-3">

    {HEALTH_CHECK_FIELDS.map(f => (

      <div key={f.id} className="flex items-start gap-3">

        <div style={{ width: '140px' }}>

          <div className="flex items-center gap-1 mb-1">

            <label className="font-medium text-gray-300 text-sm">{f.label}</label>

            <div className="group relative">

              <Info size={12} className="text-gray-500 hover:text-gray-300 cursor-help" />

              <div className="invisible group-hover:visible absolute left-0 top-5 w-96 p-3 bg-zinc-800 border border-zinc-700 rounded shadow-lg text-xs text-gray-300 z-50">

                {f.tooltip}

              </div>

            </div>

          </div>

          <div className="w-32">

            <StatusSelect

              value={selectedCustomer.data.healthCheck?.[f.id]}

              onChange={(v) => updateField('healthCheck', f.id, v)}

              type="health"

            />

          </div>

        </div>

        <div className="flex-1">

          <label className="block font-medium text-gray-300 mb-1 text-sm">Reason</label>

          <input 

            type="text" 

            value={selectedCustomer.data.healthCheck?.[`${f.id}Notes`] || ''} 

            onChange={(e) => updateField('healthCheck', `${f.id}Notes`, e.target.value)} 

            className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100" 

          />

        </div>

      </div>

    ))}

  </div>

</div>

                        

                        <div className="mt-4 p-3 bg-black border border-zinc-800 rounded">

                          <h4 className="font-bold text-gray-200 mb-3 text-sm">Links</h4>

                          <div className="space-y-2 mb-3">

                            {LINK_FIELDS.map(f => (

                              <LinkInput

                                key={f.id}

                                label={f.label}

                                value={selectedCustomer.data.links?.[f.id]}

                                onChange={(v) => updateField('links', f.id, v)}

                              />

                            ))}

                          </div>

                          {selectedCustomer.data.links?.additional?.map((l, i) => (

                            <div key={i} className="mb-2">

                              <div className="flex items-center justify-between mb-1">

                                <input 

                                  type="text" 

                                  value={l.label || ''} 

                                  onChange={(e) => {

                                    const u = { ...selectedCustomer };

                                    u.data.links.additional[i].label = e.target.value;

                                    setSelectedCustomer(u);

                                    setCustomers(customers.map(c => c.id === u.id ? u : c));

                                  }} 

                                  className="flex-1 font-medium text-gray-300 text-sm bg-transparent border-none focus:outline-none px-0" 

                                />

                                <button 

                                  onClick={() => setDeleteConfirmation({

                                    message: `Are you sure you want to delete the link "${l.label || 'Unnamed Link'}"?`,

                                    onConfirm: () => {

                                      const u = { ...selectedCustomer };

                                      u.data.links.additional.splice(i, 1);

                                      setSelectedCustomer(u);

                                      setCustomers(customers.map(c => c.id === u.id ? u : c));

                                    }

                                  })} 

                                  className="text-[#C74364] hover:text-[#D96682] ml-2"

                                >

                                  <X size={16} />

                                </button>

                              </div>

                              <LinkInput

                                label=""

                                value={l.url}

                                onChange={(v) => {

                                  const u = { ...selectedCustomer };

                                  u.data.links.additional[i].url = v;

                                  setSelectedCustomer(u);

                                  setCustomers(customers.map(c => c.id === u.id ? u : c));

                                }}

                              />

                            </div>

                          ))}

                          <button 

                            onClick={() => {

                              const u = { ...selectedCustomer };

                              if (!u.data.links.additional) u.data.links.additional = [];

                              u.data.links.additional.push({ label: 'New Link', url: '' });

                              setSelectedCustomer(u);

                              setCustomers(customers.map(c => c.id === u.id ? u : c));

                            }} 

                            className="flex items-center gap-1 px-2 py-1 bg-zinc-800 text-gray-300 rounded hover:bg-zinc-700 transition text-xs mt-2"

                          >

                            <Plus size={14} />

                            <span>Add Link</span>

                          </button>

                        </div>

                      </CollapsibleSection>

                  

                  {/* Contacts Section */}

<CollapsibleSection
  title="Contacts"
  isExpanded={expandedSections.contacts}
  onToggle={() => setExpandedSections(p => ({ ...p, contacts: !p.contacts }))}
  className="bg-zinc-900 rounded border border-zinc-800 p-2.5 mb-3"
>

    {/* Table Header */}

    <div className="grid grid-cols-[1fr_1fr_40px_40px] gap-2 mb-1 px-2">

      <div className="font-medium text-gray-300 text-sm">Name</div>

      <div className="font-medium text-gray-300 text-sm">Role</div>

      <div></div>

      <div></div>

    </div>

    

    {/* Contact Rows */}

    {(selectedCustomer.data.contacts || [{}]).map((ct, i) => (

      <div key={i} className="mb-2">

        <div className="grid grid-cols-[1fr_1fr_40px_40px] gap-2 items-start px-2">

          <div>

            {renderInput({ type: 'text' }, ct.contactName, (v) => updateField('contacts', 'contactName', v, i))}

          </div>

          <div>

            {renderInput({ type: 'text' }, ct.role, (v) => updateField('contacts', 'role', v, i))}

          </div>

          <button 

            onClick={() => setExpandedContactNotes(p => ({ ...p, [`contacts-${i}`]: !p[`contacts-${i}`] }))} 

            className="text-gray-400 hover:text-gray-200"

          >

            {expandedContactNotes[`contacts-${i}`] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}

          </button>

          <button 

            onClick={() => setDeleteConfirmation({

              message: `Are you sure you want to delete contact "${ct.contactName || 'Unnamed Contact'}"?`,

              onConfirm: () => {

                const u = { ...selectedCustomer };

                u.data.contacts.splice(i, 1);

                setSelectedCustomer(u);

                setCustomers(customers.map(c => c.id === u.id ? u : c));

              }

            })} 

            className="text-[#C74364] hover:text-[#D96682]"

          >

            <Trash2 size={14} />

          </button>

        </div>

        

        {expandedContactNotes[`contacts-${i}`] && (

          <div className="mt-2 px-2">

            <textarea 

              value={ct.contactNotes || ''} 

              onChange={(e) => {

                updateField('contacts', 'contactNotes', e.target.value, i);

                autoResizeTextarea(e.target);

              }}

              onFocus={(e) => autoResizeTextarea(e.target)}

              rows={2} 

              placeholder="Notes..."

              className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100 resize-none overflow-hidden" 

              style={{ minHeight: '2.5rem' }}

            />

          </div>

        )}

      </div>

    ))}

    <button 

      onClick={() => {

        const u = { ...selectedCustomer };

        if (!u.data.contacts) u.data.contacts = [];

        u.data.contacts.unshift({});

        setSelectedCustomer(u);

        setCustomers(customers.map(c => c.id === u.id ? u : c));

      }} 

      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition text-sm mt-2"

    >

      <Plus size={16} />

      <span>Add Contacts</span>

    </button>

</CollapsibleSection>

                  
{/* Modules Section */}
<CollapsibleSection
  title="Modules/SuiteApps"
  isExpanded={expandedSections.modules}
  onToggle={() => setExpandedSections(p => ({ ...p, modules: !p.modules }))}
  className="bg-zinc-900 rounded border border-zinc-800 p-2.5 mb-3"
>
  {selectedCustomer.data.modules && selectedCustomer.data.modules.length > 0 ? (
    <div className="space-y-4 mb-3">
      {['Licensed', 'Opportunity', 'Potential Opportunity', 'CAI', 'Recommended', 'Dropped', 'Lost'].map(status => {
        const filteredModules = selectedCustomer.data.modules.filter(m => {
          if (status === 'Opportunity') {
            return m.status === MODULE_STATUS.OPPORTUNITY && (!m.source || m.source !== 'analyzer');
          } else if (status === 'Potential Opportunity') {
            return m.status === MODULE_STATUS.OPPORTUNITY && m.source === 'analyzer';
          }
          return m.status === status;
        });
        if (filteredModules.length === 0) return null;
        
        const statusLabels = { 
          'Licensed': 'Licensed', 
          'Dropped': 'Dropped', 
          'Opportunity': 'Opportunities', 
          'Potential Opportunity': 'Potential Opportunities',
          'Lost': 'Lost', 
          'CAI': 'CustomerAI', 
          'Recommended': 'Recommendations' 
        };
        
        const statusColors = {
          'Licensed': 'bg-[#1a2e23] border-[#86B596]',
          'Opportunity': 'bg-blue-950 border-blue-700',
          'Potential Opportunity': 'bg-indigo-950 border-indigo-600',
          'CAI': 'bg-purple-950 border-purple-700',
          'Recommended': 'bg-[#2e2a1a] border-[#E2C06B]',
          'Dropped': 'bg-[#2e1a20] border-[#C74364]',
          'Lost': 'bg-orange-950 border-orange-700'
        };
        
        const statusIcons = {
          'Licensed': '✓',
          'Opportunity': '○',
          'Potential Opportunity': '◎',
          'CAI': '★',
          'Recommended': '↑',
          'Dropped': '✕',
          'Lost': '⊘'
        };
        
        return (
          <div key={status} className={`border-l-4 ${statusColors[status]} rounded-r p-3`}>
            <h4 className="font-bold text-gray-200 text-sm mb-3 flex items-center gap-2">
              <span className="text-lg">{statusIcons[status]}</span>
              {statusLabels[status]}
              <span className="text-xs text-gray-500">({filteredModules.length})</span>
            </h4>
            {status === 'Licensed' ? (
              <div className="space-y-3">
                {Object.entries(
                  filteredModules.reduce((acc, m) => {
                    const area = m.processArea || 'Uncategorized';
                    if (!acc[area]) acc[area] = [];
                    acc[area].push(m);
                    return acc;
                  }, {})
                ).map(([area, mods]) => (
                  <div key={area}>
                    <h5 className="font-semibold text-gray-300 text-xs mb-1">{area}</h5>
                    <div className="space-y-1 ml-2">
                      {mods.sort((a, b) => {
                        const aIndex = moduleLibrary[area]?.findIndex(libMod => libMod.name === a.name) ?? 999;
                        const bIndex = moduleLibrary[area]?.findIndex(libMod => libMod.name === b.name) ?? 999;
                        return aIndex - bIndex;
                      }).map((m, idx) => (
                        <div key={idx} className="border border-zinc-700 rounded p-2 bg-zinc-950 flex items-center justify-between hover:bg-zinc-900 transition">
                          <span className="text-gray-200 text-sm">
                            {m.name}
                            {m.quantity && <span className="text-xs text-gray-400 ml-2">({m.quantity})</span>}
                          </span>
                         <button 
  onClick={() => setDeleteConfirmation({
    message: `Are you sure you want to remove "${m.name}" from this customer's modules?`,
    onConfirm: () => {
      // Calculate updated opportunities with mapped names
      const updatedModules = (selectedCustomer.data.modules || [])
        .filter(mod => mod.name !== m.name)
        .filter(mod => mod.status === MODULE_STATUS.OPPORTUNITY)
        .map(mod => ({
          name: mapModuleName(mod.name),
          processArea: mod.processArea
        }));
      
      // Remove duplicates
      const uniqueOpportunities = updatedModules.filter((opp, index, self) =>
        index === self.findIndex(o => o.name === opp.name)
      );
      
      // Delete the module
      updateModuleStatus(m.name, '', m.processArea);
      
      // Immediately sync to analyzer
      if (status === 'Potential Opportunity' || status === 'Opportunity') {
        const iframe = document.getElementById('licenseAnalyzerFrame');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'OPPORTUNITIES_SYNC_FROM_NOTES',
            opportunities: uniqueOpportunities
          }, '*');
          
        }
      }
    }
  })} 
  className="text-[#C74364] hover:text-[#D96682]"
>
  <Trash2 size={12} />
</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredModules.map((m, idx) => (
                  <div key={idx} className="border border-zinc-700 rounded p-2 bg-zinc-950 flex items-center justify-between hover:bg-zinc-900 transition">
                    <span className="text-gray-200 text-sm">{m.name}</span>
                  <button 
  onClick={() => setDeleteConfirmation({
    message: `Are you sure you want to remove "${m.name}" from this customer's modules?`,
    onConfirm: () => {
      // Calculate what opportunities will remain BEFORE updating state
      const remainingOpportunities = (selectedCustomer.data.modules || [])
        .filter(mod => !(mod.name === m.name && mod.status === 'Opportunity'))
        .filter(mod => mod.status === 'Opportunity')
        .map(mod => ({ name: mod.name, processArea: mod.processArea }));
      
      // Now delete the module
      updateModuleStatus(m.name, '', m.processArea);
      
      // Sync the pre-calculated list to analyzer
      if (status === 'Potential Opportunity') {
        setTimeout(() => {
          const iframe = document.getElementById('licenseAnalyzerFrame');
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
              type: 'OPPORTUNITIES_SYNC_FROM_NOTES',
              opportunities: remainingOpportunities
            }, '*');
            
          }
        }, 100);
      }
    }
  })} 
  className="text-[#C74364] hover:text-[#D96682]"
>
  <Trash2 size={12} />
</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-sm text-gray-500 mb-3">No modules selected yet.</p>
  )}
  <button 
    onClick={() => setShowModuleSelector(true)} 
    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition text-sm"
  >
    <Plus size={16} />
    <span>Add Modules/SuiteApps</span>
  </button>
</CollapsibleSection>


                  

                  {/* 3rd Party Solutions Section */}

<CollapsibleSection
  title="3rd Party Solutions"
  isExpanded={expandedSections.thirdParty}
  onToggle={() => setExpandedSections(p => ({ ...p, thirdParty: !p.thirdParty }))}
  className="bg-zinc-900 rounded border border-zinc-800 p-2.5 mb-3"
>

                      {(selectedCustomer.data.thirdParty || []).map((tp, i) => (

  <div key={i} className="border border-zinc-800 rounded p-3 mb-3 bg-zinc-900">

    <div className="mb-3">

      <div className="flex gap-2 mb-3">

        <div className="grid grid-cols-2 gap-3 flex-1">

          <div>

            <label className="block font-medium text-gray-300 mb-1 text-sm">Solution Name</label>

{renderInput({ type: 'text' }, tp.solutionName, (v) => {

  updateField('thirdParty', 'solutionName', v, i);

})}

          </div>

          <div>

            <label className="block font-medium text-gray-300 mb-1 text-sm">Purpose</label>

{renderInput({ type: 'text' }, tp.purpose, (v) => {

  updateField('thirdParty', 'purpose', v, i);

})}

          </div>

        </div>

        <button 

          onClick={() => setDeleteConfirmation({

            message: `Are you sure you want to delete "${tp.solutionName || 'this 3rd party solution'}"?`,

            onConfirm: () => {

      const u = { ...selectedCustomer };

      u.data.thirdParty.splice(i, 1);

      setSelectedCustomer(u);

      setCustomers(customers.map(c => c.id === u.id ? u : c));

            }

          })} 

          className="text-[#C74364] hover:text-[#D96682] h-5 flex items-center"

        >

          <Trash2 size={14} />

        </button>

      </div>

      <div className="grid grid-cols-2 gap-3" style={{paddingRight: 'calc(14px + 0.5rem)'}}>

        <div>

          <label className="block font-medium text-gray-300 mb-1 text-sm">Integration Type</label>

          <select 

  value={tp.connectedToNS || ''} 

  onChange={(e) => {

    updateField('thirdParty', 'connectedToNS', e.target.value, i);

  }} 

  className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100"

>

            <option value="">Select...</option>

            <option value="integrated">Integrated</option>

            <option value="manual">Manual</option>

            <option value="both">Integrated + Manual</option>

            <option value="disconnected">Disconnected</option>

            <option value="unknown">Unknown</option>

          </select>

        </div>

        <div>

          <label className="block font-medium text-gray-300 mb-1 text-sm">Connector Name</label>

          <input 

  type="text" 

  value={tp.connectorName || ''} 

  onChange={(e) => {

    updateField('thirdParty', 'connectorName', e.target.value, i);

  }} 

  className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:ring-1 focus:ring-zinc-500 text-gray-100" 

  placeholder="e.g., Boomi, Celigo"

          />

        </div>

      </div>

    </div>

  </div>

))}

                        {(selectedCustomer.data.thirdParty || []).length === 0 && (

                          <p className="text-sm text-gray-500 mb-3">No 3rd party solutions added yet.</p>

                        )}

                        <button 

  onClick={() => {

    const u = { ...selectedCustomer };

    if (!u.data.thirdParty) u.data.thirdParty = [];

    u.data.thirdParty.unshift({});

    setSelectedCustomer(u);

    setCustomers(customers.map(c => c.id === u.id ? u : c));

  }}

                          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition text-sm"

                        >

                          <Plus size={16} />

                          <span>Add 3rd Party Solution</span>

                        </button>

                      </CollapsibleSection>

                </div>

              </div>

              

              <div className="w-1 bg-zinc-800" />

              

              {/* Right Panel - Meeting Notes (continues in next message due to length) */}

              <MeetingNotesPanel 

  selectedCustomer={selectedCustomer}

  updateField={updateField}

  renderInput={renderInput}

  expandedMeetings={expandedMeetings}

  setExpandedMeetings={setExpandedMeetings}

  meetingSummaryExpanded={meetingSummaryExpanded}

  setMeetingSummaryExpanded={setMeetingSummaryExpanded}

  getMeetingTitle={getMeetingTitle}

  getRatingColor={getRatingColor}

  hasOutstanding={hasOutstanding}

  isMeetingOverdue={isMeetingOverdue}

  setDeleteConfirmation={setDeleteConfirmation}

  customers={customers}

  setCustomers={setCustomers}

  setSelectedCustomer={setSelectedCustomer}

  meetingPromptsExpanded={meetingPromptsExpanded}

  setMeetingPromptsExpanded={setMeetingPromptsExpanded}

  abrPromptsExpanded={abrPromptsExpanded}

  setAbrPromptsExpanded={setAbrPromptsExpanded}

  discoveryPromptsExpanded={discoveryPromptsExpanded}

  setDiscoveryPromptsExpanded={setDiscoveryPromptsExpanded}

/>

            </div>

          </>

        ) : (

          <div className="flex items-center justify-center h-full">

            <div className="text-center text-gray-600">

              <Users size={48} className="mx-auto mb-4" />

              <p className="text-lg">Select a customer or create a new one</p>

            </div>

          </div>

        )}

      </div>



{/* License Analyzer Modal */}

{showLicenseAnalyzer && analyzerData && (

  <div className="fixed inset-0 bg-zinc-950 bg-opacity-90 flex items-center justify-center z-50" onClick={() => setShowLicenseAnalyzer(false)}>

    <div className="bg-zinc-900 rounded-lg border border-zinc-800 w-[95vw] h-[95vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>

      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-800">

        <h3 className="text-xl font-bold text-gray-100">License Analysis: {analyzerData.customerName}</h3>

        <button onClick={() => setShowLicenseAnalyzer(false)} className="text-gray-400 hover:text-gray-200">

          <X size={24} />

        </button>

      </div>

    <div className="flex-1 overflow-auto bg-zinc-950">

<iframe
  id="licenseAnalyzerFrame"
  ref={(iframe) => {
    if (iframe && analyzerData) {
      iframe.onload = () => {
        setTimeout(() => {
          if (iframe.contentWindow) {
            
            // Send initial data WITHOUT opportunities (we'll sync them separately)
            const initialData = {
              ...analyzerData,
              opportunities: '' // Clear any old opportunities
            };
            
            iframe.contentWindow.postMessage({
              type: 'CUSTOMER_DATA',
              ...initialData
            }, '*');
            
            // Wait for analyzer to load, then force sync from notes app
            setTimeout(() => {
              if (iframe.contentWindow) {
                
                // Send the actual current opportunities
                syncToAnalyzer(selectedCustomer);
                
              }
            }, 1500);
          }
        }, 500);
      };
    }
  }}
  src="/license-analyzer.html"

  className="w-full h-full border-none"

  title="License Analyzer"

/>

</div>

    </div>

  </div>

)}



<ConfirmationModal

        isOpen={!!deleteConfirmation}

        message={deleteConfirmation?.message}

        onConfirm={() => {

          deleteConfirmation?.onConfirm();

          setDeleteConfirmation(null);

        }}

        onCancel={() => setDeleteConfirmation(null)}

      />



{/* Confirmation Dialog Modal */}

{confirmationDialog && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-zinc-900 rounded-lg max-w-md w-full mx-4 p-6 border border-zinc-800">

      <h3 className="text-xl font-bold text-gray-100 mb-4">Confirm Action</h3>

      <p className="text-gray-300 mb-6 whitespace-pre-line">{confirmationDialog.message}</p>

      <div className="flex gap-3 justify-end">

        <button 

          onClick={() => {

            if (confirmationDialog.onCancel) confirmationDialog.onCancel();

            setConfirmationDialog(null);

          }} 

          className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition"

        >

          Cancel

        </button>

        <button 

          onClick={() => {

            confirmationDialog.onConfirm();

            setConfirmationDialog(null);

          }} 

          className="px-4 py-2 bg-[#86B596] hover:bg-[#7BA586] text-white rounded transition"

        >

          Confirm

        </button>

      </div>

    </div>

  </div>

)}



{/* Message Dialog Modal */}

{messageDialog && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-zinc-900 rounded-lg max-w-md w-full mx-4 p-6 border border-zinc-800">

      <h3 className="text-xl font-bold text-gray-100 mb-4">{messageDialog.title}</h3>

      <p className="text-gray-300 mb-6">{messageDialog.message}</p>

      <div className="flex gap-3 justify-end">

        <button 

          onClick={() => setMessageDialog(null)} 

          className="px-4 py-2 bg-[#86B596] hover:bg-[#7BA586] text-white rounded transition"

        >

          OK

        </button>

      </div>

    </div>

  </div>

)}

{/* Library Code Export Modal */}

{showLibraryCode && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-zinc-900 rounded-lg max-w-4xl w-full mx-4 p-6 border border-zinc-800 max-h-[90vh] flex flex-col">

      <div className="flex items-center justify-between mb-4">

        <h3 className="text-xl font-bold text-gray-100">Product Library Code</h3>

        <button onClick={() => setShowLibraryCode(false)} className="text-gray-400 hover:text-gray-200">

          <X size={24} />

        </button>

      </div>

      <p className="text-sm text-gray-300 mb-4">Copy this code and replace the INITIAL_MODULE_LIBRARY constant in App.jsx (around line 44)</p>

      <div className="flex-1 overflow-auto bg-zinc-950 rounded border border-zinc-700 p-4">

        <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{showLibraryCode}</pre>

      </div>

      <div className="flex gap-3 justify-end mt-4">

        <button 

          onClick={() => {

            navigator.clipboard.writeText(showLibraryCode);

            alert('Code copied to clipboard!');

          }} 

          className="px-4 py-2 bg-[#86B596] hover:bg-[#7BA586] text-white rounded transition"

        >

          Copy to Clipboard

        </button>

        <button 

          onClick={() => setShowLibraryCode(false)} 

          className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition"

        >

          Close

        </button>

      </div>

    </div>

  </div>

)}

    </div>

  );

}



// Separate component for Meeting Notes Panel

function MeetingNotesPanel({ 

  selectedCustomer, 

  updateField, 

  renderInput, 

  expandedMeetings, 

  setExpandedMeetings,

  meetingSummaryExpanded,

  setMeetingSummaryExpanded,

  getMeetingTitle,

  getRatingColor,

  hasOutstanding,

  isMeetingOverdue,

  setDeleteConfirmation,

  customers,

  setCustomers,

  setSelectedCustomer,

  meetingPromptsExpanded,

  setMeetingPromptsExpanded,

  abrPromptsExpanded,

  setAbrPromptsExpanded,

  discoveryPromptsExpanded,

  setDiscoveryPromptsExpanded

}) {  const meetings = selectedCustomer.data.meetings || [{}];

  

  const getMeetingSummary = (ms) => ms.map((m, i) => ({ 

    index: i, 

    title: getMeetingTitle(m), 

    rating: m.rating || '', 

    hasOutstandingTasks: hasOutstanding(m), 

    isOverdue: isMeetingOverdue(m) && hasOutstanding(m),

    link: m.scRequestLink 

  }));

return (

  <div className="w-1/2 bg-zinc-900 overflow-y-auto p-4 ml-2 mr-2 mt-2 rounded border border-zinc-800">

    <div className="flex items-center justify-between mb-4">

 

        <h3 className="text-lg font-bold text-gray-100">Meeting Notes</h3>

        <button 

          onClick={() => {

            const u = { ...selectedCustomer };

            if (!u.data.meetings) u.data.meetings = [];

            u.data.meetings.unshift({

     taskUpdateSC: 'Not Started',

      taskConfirmOpps: 'Not Started',

      taskUploadDiscovery: 'Not Started',

      taskLastTellEmail: 'Not Started',

      taskFollowUps: 'Not Started'

});

            setSelectedCustomer(u);

            setCustomers(customers.map(c => c.id === u.id ? u : c));

          }} 

          className="flex items-center gap-1 px-2 py-1 bg-[#86B596] hover:bg-[#7BA586] text-white rounded bg-[#86B596] hover:bg-[#7BA586] transition text-xs"

        >

          <Plus size={14} />

          <span>New Meeting</span>

        </button>

      </div>

      {/* Meeting Prompts Section */}

      <div className="mb-4 p-3 bg-zinc-950 border border-zinc-800 rounded">

        <button 

          onClick={() => setMeetingPromptsExpanded(!meetingPromptsExpanded)} 

          className="w-full flex items-center justify-between mb-2"

        >

          <h4 className="font-semibold text-gray-200 text-sm">Meeting Prompts</h4>

          {meetingPromptsExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}

        </button>

        {meetingPromptsExpanded && (

          <div className="space-y-3 mt-3">

            {/* ABR Prompts */}

            <div className="border border-zinc-700 rounded p-2 bg-zinc-900">

              <button 

                onClick={() => setAbrPromptsExpanded(!abrPromptsExpanded)} 

                className="w-full flex items-center justify-between"

              >

                <h5 className="font-semibold text-gray-300 text-xs">ABR Prompts</h5>

                {abrPromptsExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}

              </button>

              {abrPromptsExpanded && (

                <ul className="mt-2 space-y-1 ml-2">

                  <li className="text-xs text-gray-400">• What are your strategies/priorities for this fiscal year?</li>

                  <li className="text-xs text-gray-400">• What new initiatives are on the horizon?</li>

                  <li className="text-xs text-gray-400">• What challenges are you facing/needs not being met by your current solutions?</li>

                </ul>

              )}

            </div>



            {/* Discovery Prompts */}

            <div className="border border-zinc-700 rounded p-2 bg-zinc-900">

              <button 

                onClick={() => setDiscoveryPromptsExpanded(!discoveryPromptsExpanded)} 

                className="w-full flex items-center justify-between"

              >

                <h5 className="font-semibold text-gray-300 text-xs">Discovery Prompts</h5>

                {discoveryPromptsExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}

              </button>

              {discoveryPromptsExpanded && (

                <ul className="mt-2 space-y-1 ml-2">

                  <li className="text-xs text-gray-400">• Can you walk me through your current process for [X]?</li>

                  <li className="text-xs text-gray-400">• What systems or tools are you currently using to manage this process?</li>

                  <li className="text-xs text-gray-400">• Who is typically involved in the process?</li>

                  <li className="text-xs text-gray-400">• How much time does the process take from start to finish, and how much time would you like it to take?</li>

                  <li className="text-xs text-gray-400">• What is working well with your current approach?</li>

                  <li className="text-xs text-gray-400">• What are the biggest challenges or pain points you are experiencing?</li>

                  <li className="text-xs text-gray-400">• If you could improve one thing about the process, what would it be?</li>

                </ul>

              )}

            </div>

          </div>

        )}

      </div>      

      {meetings.map((mtg, i) => (

  <div key={i} className="border border-zinc-800 rounded p-3 mb-3 bg-black">

    <div className="w-full flex items-center justify-between mb-2">

      <button 

        onClick={() => setExpandedMeetings(p => ({ ...p, [i]: !p[i] }))} 

        className="flex items-center gap-2 flex-1"

      >

        <h4 className={`font-semibold text-sm ${getRatingColor(mtg.rating)}`}>{getMeetingTitle(mtg)}</h4>

        {mtg.scRequestLink && <a href={mtg.scRequestLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200" onClick={(e) => e.stopPropagation()}><Globe size={14} /></a>}

        {hasOutstanding(mtg) && <span className={`${isMeetingOverdue(mtg) ? 'text-[#C74364] hover:text-[#D96682]' : 'text-amber-400'} text-xs`}>⚠  </span>}

      </button>

      <div className="flex items-center gap-2">

        <button 

          onClick={() => setExpandedMeetings(p => ({ ...p, [i]: !p[i] }))}

          className="p-1"

        >

          {expandedMeetings[i] ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}

        </button>

        <button 

          onClick={(e) => { 

            e.stopPropagation(); 

            setDeleteConfirmation({

              message: `Are you sure you want to delete this meeting: "${getMeetingTitle(mtg)}"?`,

              onConfirm: () => {

                const u = { ...selectedCustomer };

                u.data.meetings.splice(i, 1);

                setSelectedCustomer(u);

                setCustomers(customers.map(c => c.id === u.id ? u : c));

              }

            });

          }} 

          className="text-[#C74364] hover:text-[#D96682]"

        >

          <Trash2 size={14} />

        </button>

      </div>

    </div>

          {expandedMeetings[i] && (

            <div className="space-y-3 pt-2">

              <div className="grid grid-cols-2 gap-2">

                <div>

                  <label className="block font-medium text-gray-300 mb-1 text-xs">Meeting Type</label>

                  {renderInput({ type: 'text' }, mtg.meetingType, (v) => updateField('meetings', 'meetingType', v, i))}

                </div>

                <div>

                  <label className="block font-medium text-gray-300 mb-1 text-xs">Focus</label>

                  {renderInput({ type: 'text' }, mtg.focus, (v) => updateField('meetings', 'focus', v, i))}

                </div>

              </div>

              <div className="flex items-end gap-2">

                <div style={{ width: '100px' }}>

                  <label className="block font-medium text-gray-300 mb-1 text-xs">SC Request #</label>

                  {renderInput({ type: 'text' }, mtg.scRequestNumber, (v) => updateField('meetings', 'scRequestNumber', v, i))}

                </div>

                <div className="flex-1">

                  <LinkInput

                    label="SC Request Link"

                    value={mtg.scRequestLink}

                    onChange={(v) => updateField('meetings', 'scRequestLink', v, i)}

                  />

                </div>

              </div>

              <div>

                <label className="block font-medium text-gray-300 mb-1 text-xs">Account Manager Name</label>

                {renderInput({ type: 'text' }, mtg.accountManagerName, (v) => updateField('meetings', 'accountManagerName', v, i))}

              </div>

              <div>

                <label className="block font-medium text-gray-300 mb-1 text-xs">Other NetSuite Attendees</label>

                {renderInput({ type: 'text' }, mtg.otherNetSuiteAttendees, (v) => updateField('meetings', 'otherNetSuiteAttendees', v, i))}

              </div>

              <div>

                <label className="block font-medium text-gray-300 mb-1 text-xs">Customer Attendees</label>

                {renderInput({ type: 'multiselect' }, mtg.customerAttendees, (v) => updateField('meetings', 'customerAttendees', v, i))}

              </div>

              

              {/* Knowledge Transfer */}

              <div>

                <h5 className="font-semibold text-gray-200 mb-2 text-xs">Knowledge Transfer</h5>

                <div className="ml-2 space-y-2">

                  <div>

                    <label className="block font-medium text-gray-300 mb-1 text-xs">Date</label>

                    {renderInput({ type: 'date' }, mtg.knowledgeTransferDate, (v) => updateField('meetings', 'knowledgeTransferDate', v, i))}

                  </div>

                  <div>

                    <label className="block font-medium text-gray-300 mb-1 text-xs">Notes</label>

                    {renderInput({ type: 'textarea' }, mtg.knowledgeTransfer, (v) => updateField('meetings', 'knowledgeTransfer', v, i))}

                  </div>

                </div>

              </div>

              

              {/* Meeting Notes */}

              <div>

                <h5 className="font-semibold text-gray-200 mb-2 text-xs">Meeting Notes</h5>

                <div className="ml-2 space-y-2">

                  <div>

                    <label className="block font-medium text-gray-300 mb-1 text-xs">Date</label>

                    {renderInput({ type: 'date' }, mtg.meetingNotesDate, (v) => updateField('meetings', 'meetingNotesDate', v, i))}

                  </div>

                  <div>

                    <label className="block font-medium text-gray-300 mb-1 text-xs">Notes</label>

                    {renderInput({ type: 'textarea' }, mtg.meetingNotes, (v) => updateField('meetings', 'meetingNotes', v, i))}

                  </div>

  <div>

      <label className="block font-medium text-gray-300 mb-1 text-xs">Identified Opportunities</label>

      {renderInput({ type: 'textarea' }, mtg.identifiedOpportunities, (v) => updateField('meetings', 'identifiedOpportunities', v, i))}

    </div>

                  <div>

                    <label className="block font-medium text-gray-300 mb-1 text-xs">Follow-Ups</label>

                    {renderInput({ type: 'textarea' }, mtg.followUps, (v) => updateField('meetings', 'followUps', v, i))}

                  </div>

                </div>

              </div>

              

              {/* Post Knowledge Transfer */}

              <div>

                <h5 className="font-semibold text-gray-200 mb-2 text-xs">Post Knowledge Transfer</h5>

                <div className="ml-2 space-y-2">

                  <div>

                    <label className="block font-medium text-gray-300 mb-1 text-xs">Date</label>

                    {renderInput({ type: 'date' }, mtg.postKnowledgeTransferDate, (v) => updateField('meetings', 'postKnowledgeTransferDate', v, i))}

                  </div>

                  <div>

                    <label className="block font-medium text-gray-300 mb-1 text-xs">Notes</label>

                    {renderInput({ type: 'textarea' }, mtg.postKnowledgeTransfer, (v) => updateField('meetings', 'postKnowledgeTransfer', v, i))}

                  </div>

                </div>

              </div>

              

              {/* Tasks */}

              <div>

                <h5 className="font-semibold text-gray-200 mb-2 text-xs">Tasks</h5>

                <div className="ml-2 grid grid-cols-5 gap-2">

                  {TASK_FIELDS.map(t => (

                    <div key={t.id}>

                      <label className="block font-medium text-gray-300 mb-1 text-xs">{t.label}</label>

                      {renderInput({ type: 'taskStatus' }, mtg[t.id], (v) => updateField('meetings', t.id, v, i))}

                    </div>

                  ))}

                </div>

              </div>

              

              {/* Meeting Rating */}

              <div>

                <h5 className="font-semibold text-gray-200 mb-2 text-xs">Meeting Rating</h5>

                <div className="ml-2 flex items-start gap-3">

                  <div style={{ width: '140px' }}>

                    <label className="block font-medium text-gray-300 mb-1 text-xs">Rating</label>

                    <div className="w-32">

                      <StatusSelect

                        value={mtg.rating}

                        onChange={(v) => updateField('meetings', 'rating', v, i)}

                        type="meeting"

                        autoFill={(t) => updateField('meetings', 'ratingReason', t, i)}

                      />

                    </div>

                  </div>

                  <div className="flex-1">

                    <label className="block font-medium text-gray-300 mb-1 text-xs">Reason</label>

                    {renderInput({ type: 'text' }, mtg.ratingReason, (v) => updateField('meetings', 'ratingReason', v, i))}

                  </div>

                </div>

              </div>

              

              {/* Links */}

              <div>

                <h5 className="font-semibold text-gray-200 mb-2 text-xs">Links</h5>

                <div className="ml-2 space-y-2">

                  {(mtg.links || []).map((lnk, li) => (

                    <div key={li}>

                      <div className="flex items-center justify-between mb-1">

                        <input 

                          type="text" 

                          value={lnk.label || ''} 

                          onChange={(e) => { 

                            const u = [...(mtg.links || [])]; 

                            u[li] = { ...u[li], label: e.target.value }; 

                            updateField('meetings', 'links', u, i); 

                          }} 

                          placeholder="Link title" 

                          className="flex-1 font-medium text-gray-300 text-xs bg-transparent border-none focus:outline-none px-0" 

                        />

                        <button 

                          onClick={() => setDeleteConfirmation({

                            message: `Are you sure you want to delete the link "${lnk.label || 'Unnamed Link'}"?`,

                            onConfirm: () => updateField('meetings', 'links', (mtg.links || []).filter((_, x) => x !== li), i)

                          })} 

                          className="text-[#C74364] hover:text-[#D96682]"

                        >

                          <X size={14} />

                        </button>

                      </div>

                      <LinkInput

                        label=""

                        value={lnk.url}

                        onChange={(v) => {

                          const u = [...(mtg.links || [])]; 

                          u[li] = { ...u[li], url: v }; 

                          updateField('meetings', 'links', u, i);

                        }}

                        showIcon={true}

                      />

                    </div>

                  ))}

                  <button 

                    onClick={() => updateField('meetings', 'links', [...(mtg.links || []), { label: '', url: '' }], i)} 

                    className="flex items-center gap-1 px-2 py-1 bg-zinc-800 text-gray-300 rounded hover:bg-zinc-700 transition text-xs"

                  >

                    <Plus size={14} />

                    <span>Add Link</span>

                  </button>

                </div>

              </div>

            </div>

          )}

        </div>

      ))}

    </div>

  );

}