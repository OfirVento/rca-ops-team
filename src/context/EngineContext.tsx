"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LifecycleStage = 'Catalog' | 'CPQ' | 'Contracts' | 'Orders' | 'Assets' | 'Billing';

export interface StageData {
    name: LifecycleStage;
    health: number; // 0-100
    status: 'Stable' | 'Healthy' | 'Warning' | 'Critical';
    counts: {
        total: number;
        atRisk: number;
        pending: number;
    };
}

export interface Issue {
    id: string;
    stage: LifecycleStage;
    title: string;
    impact: string; // Plain numbers/impact, e.g., "$120k ARR risk"
    description: string; // 1-sentence problem
    rootCause: string; // Human-readable root cause
    impactValue: number;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'New' | 'Triaged' | 'FixProposed' | 'Applied' | 'Verified';
    owner: string; // Routing: Deal Desk, RevOps, Billing, etc.
    suggestedActions: string[];
}

export interface Agent {
    id: string;
    name: string;
    specialty: string;
    status: 'Idle' | 'Analyzing' | 'ProposingFix' | 'Monitoring';
    reasoning: string;
}

export interface Signal {
    id: string;
    source: LifecycleStage | string;
    type: 'Anomaly' | 'Risk' | 'Opportunity';
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    summary: string;
    impactValue: string;
    probability: number;
    timestamp: Date;
}

export interface Recommendation {
    id: string;
    title: string;
    description: string;
    impact: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    action: string;
    status: 'New' | 'Pending' | 'Applied' | 'Dismissed';
}

export type RuleStatus = 'ACTIVE' | 'DORMANT' | 'LEGACY' | 'PROPOSED' | 'DEPRECATED';

export interface RuleSet {
    id: string;
    name: string;
    area: LifecycleStage;
    owner: string;
    description: string;
    status: RuleStatus;
    currentVersion: string;
    evaluations7d: number;
    evaluations30d: number;
    evaluations90d: number;
    violations90d: number;
    issuesCount: number;
    lastChange: string;
    legacySource?: string;
    replacementId?: string;
}

export interface Rule {
    id: string;
    ruleSetId: string;
    name: string;
    status: RuleStatus;
    summary: string;
    inputs: Record<string, any>;
    outputs: Record<string, any>;
    lastTriggered: string;
    evaluations90d: number;
    violations90d: number;
}

export interface RuleVersion {
    id: string;
    ruleSetId: string;
    version: string;
    createdAt: string;
    createdBy: string;
    reason: string;
    env: 'Prod' | 'Stage' | 'Dev';
    deployedAt?: string;
    diffPlain: string;
    diffTech?: string;
}

export interface EvaluationLog {
    id: string;
    timestamp: Date;
    ruleSetId: string;
    ruleId: string;
    versionId: string;
    recordRef: string;
    recordName: string;
    outcome: 'Pass' | 'Violation' | 'Auto-Fix';
    reason: string;
    inputs: Record<string, any>;
    outputs: Record<string, any>;
    issueId?: string;
}

export interface KPIMetrics {
    itemsNeedingAttention: number;
    revenueAtRisk: string;
    cycleTimeHotspots: string;
    billingRisk: string;
    netRevenueEfficiency: string;
}

interface EngineContextType {
    stages: StageData[];
    issues: Issue[];
    agents: Agent[];
    signals: Signal[];
    recommendations: Recommendation[];
    kpiMetrics: KPIMetrics;
    topInsights: string[];
    ruleSets: RuleSet[];
    rules: Rule[];
    versions: RuleVersion[];
    evalLogs: EvaluationLog[];
    heartbeat: number;
}

const EngineContext = createContext<EngineContextType | undefined>(undefined);

const INITIAL_STAGES: StageData[] = [
    { name: 'Catalog', health: 98, status: 'Healthy', counts: { total: 480, atRisk: 2, pending: 5 } },
    { name: 'CPQ', health: 92, status: 'Healthy', counts: { total: 124, atRisk: 12, pending: 8 } },
    { name: 'Contracts', health: 74, status: 'Critical', counts: { total: 85, atRisk: 19, pending: 11 } },
    { name: 'Orders', health: 96, status: 'Healthy', counts: { total: 312, atRisk: 6, pending: 18 } },
    { name: 'Assets', health: 88, status: 'Warning', counts: { total: 420, atRisk: 22, pending: 48 } },
    { name: 'Billing', health: 82, status: 'Warning', counts: { total: 250, atRisk: 12, pending: 4 } },
];

const INITIAL_RULE_SETS: RuleSet[] = [
    // === CATALOG (5 rules) ===
    {
        id: 'cat1',
        name: 'Product Availability',
        area: 'Catalog',
        owner: 'Product Ops',
        description: 'Validates product availability and regional restrictions',
        status: 'ACTIVE',
        currentVersion: 'v6',
        evaluations7d: 3200,
        evaluations30d: 12400,
        evaluations90d: 34000,
        violations90d: 89,
        issuesCount: 12,
        lastChange: '3d ago'
    },
    {
        id: 'cat2',
        name: 'Price Book Selection',
        area: 'Catalog',
        owner: 'RevOps',
        description: 'Matches customer segment to appropriate price book',
        status: 'ACTIVE',
        currentVersion: 'v11',
        evaluations7d: 2800,
        evaluations30d: 11200,
        evaluations90d: 28000,
        violations90d: 156,
        issuesCount: 28,
        lastChange: '1d ago'
    },
    {
        id: 'cat3',
        name: 'SKU Validation',
        area: 'Catalog',
        owner: 'Product Ops',
        description: 'Enforces valid SKU format and active product status',
        status: 'ACTIVE',
        currentVersion: 'v8',
        evaluations7d: 4100,
        evaluations30d: 15600,
        evaluations90d: 42000,
        violations90d: 34,
        issuesCount: 8,
        lastChange: '5d ago'
    },
    {
        id: 'cat4',
        name: 'Bundle Eligibility',
        area: 'Catalog',
        owner: 'Product Ops',
        description: 'Determines which products can be bundled together',
        status: 'ACTIVE',
        currentVersion: 'v3',
        evaluations7d: 1800,
        evaluations30d: 7200,
        evaluations90d: 19000,
        violations90d: 210,
        issuesCount: 45,
        lastChange: '8d ago'
    },
    {
        id: 'cat5',
        name: 'Legacy SKU Mapper',
        area: 'Catalog',
        owner: 'Product Ops',
        description: 'Maps deprecated SKUs to replacement products',
        status: 'LEGACY',
        currentVersion: 'v1',
        evaluations7d: 45,
        evaluations30d: 180,
        evaluations90d: 520,
        violations90d: 8,
        issuesCount: 2,
        lastChange: '60d ago',
        legacySource: 'Legacy ERP Integration'
    },

    // === CPQ (6 rules) ===
    {
        id: 'rs1',
        name: 'Discount Approvals',
        area: 'CPQ',
        owner: 'RevOps',
        description: 'Routes approvals based on discount & segment',
        status: 'ACTIVE',
        currentVersion: 'v12',
        evaluations7d: 2100,
        evaluations30d: 8900,
        evaluations90d: 24000,
        violations90d: 312,
        issuesCount: 41,
        lastChange: '6d ago'
    },
    {
        id: 'rs2',
        name: 'Bundle Compatibility',
        area: 'CPQ',
        owner: 'RevOps',
        description: 'Verifies product compatibility for complex configurations',
        status: 'ACTIVE',
        currentVersion: 'v4',
        evaluations7d: 1200,
        evaluations30d: 4900,
        evaluations90d: 13000,
        violations90d: 540,
        issuesCount: 32,
        lastChange: '12d ago'
    },
    {
        id: 'rs3',
        name: 'Required Fields',
        area: 'CPQ',
        owner: 'RevOps',
        description: 'Mandates specific quoting metadata before signature',
        status: 'LEGACY',
        currentVersion: 'v1.4',
        evaluations7d: 12,
        evaluations30d: 44,
        evaluations90d: 140,
        violations90d: 18,
        issuesCount: 9,
        lastChange: '94d ago',
        legacySource: 'APAC Quote Template v2',
        replacementId: 'rs2'
    },
    {
        id: 'cpq4',
        name: 'Margin Calculator',
        area: 'CPQ',
        owner: 'Finance',
        description: 'Calculates and enforces minimum margin thresholds',
        status: 'ACTIVE',
        currentVersion: 'v7',
        evaluations7d: 1900,
        evaluations30d: 7600,
        evaluations90d: 21000,
        violations90d: 89,
        issuesCount: 15,
        lastChange: '2d ago'
    },
    {
        id: 'cpq5',
        name: 'Quote Expiration',
        area: 'CPQ',
        owner: 'Sales Ops',
        description: 'Manages quote validity periods and auto-expiration',
        status: 'ACTIVE',
        currentVersion: 'v5',
        evaluations7d: 980,
        evaluations30d: 3900,
        evaluations90d: 10500,
        violations90d: 22,
        issuesCount: 6,
        lastChange: '4d ago'
    },
    {
        id: 'cpq6',
        name: 'Multi-Year Pricing',
        area: 'CPQ',
        owner: 'RevOps',
        description: 'Applies uplift and discount rules for multi-year deals',
        status: 'PROPOSED',
        currentVersion: 'v1-draft',
        evaluations7d: 0,
        evaluations30d: 0,
        evaluations90d: 0,
        violations90d: 0,
        issuesCount: 0,
        lastChange: '1d ago'
    },

    // === CONTRACTS (5 rules) ===
    {
        id: 'rs4',
        name: 'Net Terms Alignment',
        area: 'Contracts',
        owner: 'Finance',
        description: 'Ensures payment terms match regional entity policies',
        status: 'LEGACY',
        currentVersion: 'v2',
        evaluations7d: 0,
        evaluations30d: 85,
        evaluations90d: 412,
        violations90d: 12,
        issuesCount: 4,
        lastChange: '120d ago',
        replacementId: 'rs5'
    },
    {
        id: 'rs5',
        name: 'Clause Completeness',
        area: 'Contracts',
        owner: 'Legal',
        description: 'Verifies presence of mandatory legal clauses',
        status: 'ACTIVE',
        currentVersion: 'v8',
        evaluations7d: 840,
        evaluations30d: 2100,
        evaluations90d: 5800,
        violations90d: 41,
        issuesCount: 15,
        lastChange: '2d ago'
    },
    {
        id: 'con3',
        name: 'Signature Authority',
        area: 'Contracts',
        owner: 'Legal',
        description: 'Validates signatory authority based on deal value',
        status: 'ACTIVE',
        currentVersion: 'v4',
        evaluations7d: 620,
        evaluations30d: 2480,
        evaluations90d: 6800,
        violations90d: 18,
        issuesCount: 5,
        lastChange: '7d ago'
    },
    {
        id: 'con4',
        name: 'Renewal Terms',
        area: 'Contracts',
        owner: 'Legal',
        description: 'Enforces auto-renewal and notice period requirements',
        status: 'ACTIVE',
        currentVersion: 'v6',
        evaluations7d: 450,
        evaluations30d: 1800,
        evaluations90d: 4900,
        violations90d: 56,
        issuesCount: 12,
        lastChange: '3d ago'
    },
    {
        id: 'con5',
        name: 'SLA Compliance',
        area: 'Contracts',
        owner: 'Legal',
        description: 'Matches SLA terms to service tier commitments',
        status: 'ACTIVE',
        currentVersion: 'v3',
        evaluations7d: 380,
        evaluations30d: 1520,
        evaluations90d: 4200,
        violations90d: 28,
        issuesCount: 8,
        lastChange: '5d ago'
    },

    // === ORDERS (5 rules) ===
    {
        id: 'ord1',
        name: 'Order Validation',
        area: 'Orders',
        owner: 'Order Ops',
        description: 'Validates order completeness before processing',
        status: 'ACTIVE',
        currentVersion: 'v9',
        evaluations7d: 2400,
        evaluations30d: 9600,
        evaluations90d: 26000,
        violations90d: 142,
        issuesCount: 28,
        lastChange: '1d ago'
    },
    {
        id: 'ord2',
        name: 'Fulfillment Routing',
        area: 'Orders',
        owner: 'Order Ops',
        description: 'Routes orders to appropriate fulfillment center',
        status: 'ACTIVE',
        currentVersion: 'v5',
        evaluations7d: 1800,
        evaluations30d: 7200,
        evaluations90d: 19500,
        violations90d: 34,
        issuesCount: 8,
        lastChange: '4d ago'
    },
    {
        id: 'ord3',
        name: 'Credit Check',
        area: 'Orders',
        owner: 'Finance',
        description: 'Validates customer credit limit before order approval',
        status: 'ACTIVE',
        currentVersion: 'v7',
        evaluations7d: 1200,
        evaluations30d: 4800,
        evaluations90d: 13000,
        violations90d: 89,
        issuesCount: 18,
        lastChange: '2d ago'
    },
    {
        id: 'ord4',
        name: 'Shipping Rules',
        area: 'Orders',
        owner: 'Order Ops',
        description: 'Determines shipping method and carrier selection',
        status: 'ACTIVE',
        currentVersion: 'v4',
        evaluations7d: 980,
        evaluations30d: 3920,
        evaluations90d: 10600,
        violations90d: 12,
        issuesCount: 3,
        lastChange: '6d ago'
    },
    {
        id: 'ord5',
        name: 'Backorder Management',
        area: 'Orders',
        owner: 'Order Ops',
        description: 'Handles out-of-stock items and backorder creation',
        status: 'PROPOSED',
        currentVersion: 'v1-draft',
        evaluations7d: 0,
        evaluations30d: 0,
        evaluations90d: 0,
        violations90d: 0,
        issuesCount: 0,
        lastChange: '3d ago'
    },

    // === ASSETS (5 rules) ===
    {
        id: 'ast1',
        name: 'Asset Provisioning',
        area: 'Assets',
        owner: 'Asset Ops',
        description: 'Triggers provisioning workflows for new subscriptions',
        status: 'ACTIVE',
        currentVersion: 'v6',
        evaluations7d: 890,
        evaluations30d: 3560,
        evaluations90d: 9600,
        violations90d: 45,
        issuesCount: 12,
        lastChange: '2d ago'
    },
    {
        id: 'ast2',
        name: 'Usage Tracking',
        area: 'Assets',
        owner: 'Asset Ops',
        description: 'Monitors consumption against entitlements',
        status: 'ACTIVE',
        currentVersion: 'v8',
        evaluations7d: 2100,
        evaluations30d: 8400,
        evaluations90d: 22800,
        violations90d: 178,
        issuesCount: 34,
        lastChange: '1d ago'
    },
    {
        id: 'ast3',
        name: 'Renewal Eligibility',
        area: 'Assets',
        owner: 'RevOps',
        description: 'Determines renewal timing and eligibility conditions',
        status: 'ACTIVE',
        currentVersion: 'v5',
        evaluations7d: 620,
        evaluations30d: 2480,
        evaluations90d: 6700,
        violations90d: 28,
        issuesCount: 8,
        lastChange: '5d ago'
    },
    {
        id: 'ast4',
        name: 'Upgrade Pathways',
        area: 'Assets',
        owner: 'Product Ops',
        description: 'Defines valid upgrade and downgrade paths',
        status: 'ACTIVE',
        currentVersion: 'v3',
        evaluations7d: 340,
        evaluations30d: 1360,
        evaluations90d: 3680,
        violations90d: 15,
        issuesCount: 4,
        lastChange: '8d ago'
    },
    {
        id: 'ast5',
        name: 'Termination Rules',
        area: 'Assets',
        owner: 'Asset Ops',
        description: 'Manages early termination fees and processes',
        status: 'ACTIVE',
        currentVersion: 'v4',
        evaluations7d: 180,
        evaluations30d: 720,
        evaluations90d: 1950,
        violations90d: 8,
        issuesCount: 2,
        lastChange: '12d ago'
    },

    // === BILLING (5 rules) ===
    {
        id: 'rs6',
        name: 'Usage Anomaly Holds',
        area: 'Billing',
        owner: 'Finance',
        description: 'Places invoices on hold if consumption drifts >30%',
        status: 'ACTIVE',
        currentVersion: 'v8',
        evaluations7d: 512,
        evaluations30d: 1800,
        evaluations90d: 4200,
        violations90d: 142,
        issuesCount: 12,
        lastChange: '4d ago'
    },
    {
        id: 'rs7',
        name: 'Invoice Readiness Checks',
        area: 'Billing',
        owner: 'Billing Ops',
        description: 'Final verification before ERP export',
        status: 'ACTIVE',
        currentVersion: 'v22',
        evaluations7d: 1200,
        evaluations30d: 4500,
        evaluations90d: 12400,
        violations90d: 8,
        issuesCount: 2,
        lastChange: '1d ago'
    },
    {
        id: 'bil3',
        name: 'Proration Calculator',
        area: 'Billing',
        owner: 'Billing Ops',
        description: 'Calculates prorated charges for mid-cycle changes',
        status: 'ACTIVE',
        currentVersion: 'v6',
        evaluations7d: 780,
        evaluations30d: 3120,
        evaluations90d: 8450,
        violations90d: 24,
        issuesCount: 6,
        lastChange: '3d ago'
    },
    {
        id: 'bil4',
        name: 'Tax Calculation',
        area: 'Billing',
        owner: 'Finance',
        description: 'Applies correct tax rates based on jurisdiction',
        status: 'ACTIVE',
        currentVersion: 'v14',
        evaluations7d: 1450,
        evaluations30d: 5800,
        evaluations90d: 15700,
        violations90d: 56,
        issuesCount: 14,
        lastChange: '2d ago'
    },
    {
        id: 'bil5',
        name: 'Dunning Escalation',
        area: 'Billing',
        owner: 'Finance',
        description: 'Manages payment reminder and collection escalation',
        status: 'ACTIVE',
        currentVersion: 'v5',
        evaluations7d: 290,
        evaluations30d: 1160,
        evaluations90d: 3140,
        violations90d: 18,
        issuesCount: 5,
        lastChange: '6d ago'
    }
];


const INITIAL_RULES: Rule[] = [
    {
        id: 'r1',
        ruleSetId: 'rs1',
        name: 'EMEA Enterprise Discount Threshold',
        status: 'ACTIVE',
        summary: 'If Discount > 20% and Segment is Enterprise, then route to VP Finance.',
        inputs: { Segment: 'Enterprise', Region: 'EMEA', Discount: '20%' },
        outputs: { Route: 'VP Finance', SLA: '24h' },
        lastTriggered: '2m ago',
        evaluations90d: 12000,
        violations90d: 184
    },
    {
        id: 'r2',
        ruleSetId: 'rs1',
        name: 'SMB Auto-approval',
        status: 'ACTIVE',
        summary: 'If Segment is SMB and Discount < 25%, then auto-approve.',
        inputs: { Segment: 'SMB', Discount: '25%' },
        outputs: { Status: 'Approved' },
        lastTriggered: '14m ago',
        evaluations90d: 8000,
        violations90d: 12
    }
];

const INITIAL_VERSIONS: RuleVersion[] = [
    {
        id: 'v12',
        ruleSetId: 'rs1',
        version: 'v12',
        createdAt: '2025-12-15',
        createdBy: 'Sarah RevOps',
        reason: 'Tightened routing for EMEA Enterprise due to margin pressure.',
        env: 'Prod',
        deployedAt: '2025-12-15',
        diffPlain: 'Threshold changed: 20% → 15% for EMEA Enterprise',
        diffTech: 'mapping.emea_enterprise.discount_limit: 0.20 -> 0.15'
    },
    {
        id: 'v11',
        ruleSetId: 'rs1',
        version: 'v11',
        createdAt: '2025-10-12',
        createdBy: 'Sarah RevOps',
        reason: 'Initial holiday routing bypass.',
        env: 'Prod',
        deployedAt: '2025-10-12',
        diffPlain: 'Added seasonal exception for Q4 Enterprise.',
        diffTech: 'rules.exceptions.push(q4_enterprise_promo)'
    }
];

const INITIAL_EVAL_LOGS: EvaluationLog[] = [
    {
        id: 'log1',
        timestamp: new Date('2025-12-21T18:00:00'),
        ruleSetId: 'rs1',
        ruleId: 'r1',
        versionId: 'v12',
        recordRef: 'Q-10492',
        recordName: 'Quote #Q-10492',
        outcome: 'Violation',
        reason: 'Discount exceeds 20% threshold for EMEA Enterprise',
        inputs: { Segment: 'Enterprise', Region: 'EMEA', Discount: '27%', DealSize: '$120k ARR' },
        outputs: { ApprovalRoute: 'VP Finance', SLATimer: '24h' },
        issueId: '1'
    }
];

const INITIAL_ISSUES: Issue[] = [
    {
        id: '1',
        stage: 'Contracts',
        title: 'Payment Term Mismatch',
        impact: '$120k ARR risk',
        description: '19 contracts have Net 60 payment terms but billing is set to due-on-receipt.',
        rootCause: 'Pricing rule missing for EMEA tier fallback during signature.',
        impactValue: 120000,
        severity: 'High',
        status: 'FixProposed',
        owner: 'RevOps',
        suggestedActions: ['Propose standardized clause fix', 'Generate addendum checklist'],
    },
    {
        id: '2',
        stage: 'Billing',
        title: 'Usage Anomaly Detected',
        impact: '12 invoices affected',
        description: 'Consumption surge in Tier 2 segments detected in 12 invoices pending release.',
        rootCause: 'Usage spikes exceeding threshold in unmetered surge segments.',
        impactValue: 14200,
        severity: 'Critical',
        status: 'New',
        owner: 'Finance',
        suggestedActions: ['Batch-hold invoices pending review', 'Verify threshold rules'],
    },
];

const INITIAL_AGENTS: Agent[] = [
    { id: '1', name: 'Catalog Guardian', specialty: 'Catalog', status: 'Idle', reasoning: 'System healthy. Monitoring metadata consistency...' },
    { id: '2', name: 'Deal Desk Copilot', specialty: 'CPQ', status: 'Analyzing', reasoning: 'Analyzing discount variance in Mid-Market segment. High severity signal detected.' },
    { id: '3', name: 'Contract Auditor', specialty: 'Contracts', status: 'ProposingFix', reasoning: 'Addressing payment term mismatches in 19 enterprise contracts. High severity signal.' },
    { id: '4', name: 'Orchestration Manager', specialty: 'Orders', status: 'Idle', reasoning: 'Order flow optimized. Zero-intervention rate at 94%.' },
    { id: '5', name: 'Asset Specialist', specialty: 'Assets', status: 'Monitoring', reasoning: 'Investigating entitlement drift in 15 high-ARR accounts. High severity renewal risk.' },
    { id: '6', name: 'Billing Sentinel', specialty: 'Billing', status: 'Analyzing', reasoning: 'Usage anomaly detected in 12 invoices. High severity signal. Reviewing threshold rules.' },
];

export function EngineProvider({ children }: { children: React.ReactNode }) {
    const [stages] = useState<StageData[]>(INITIAL_STAGES);
    const [issues] = useState<Issue[]>(INITIAL_ISSUES);
    const [agents] = useState<Agent[]>(INITIAL_AGENTS);
    const [signals] = useState<Signal[]>([
        { id: 's1', source: 'CPQ', type: 'Anomaly', severity: 'High', summary: 'Discount variance rising in Mid-Market (14d).', impactValue: '$42.1k', probability: 0.85, timestamp: new Date('2025-12-21T10:00:00') },
        { id: 's2', source: 'Contracts', type: 'Risk', severity: 'High', summary: 'Payment term mismatch in 19 enterprise contracts.', impactValue: '$120k', probability: 0.92, timestamp: new Date('2025-12-21T10:00:00') },
        { id: 's3', source: 'Billing', type: 'Anomaly', severity: 'High', summary: 'Usage anomaly detected in 12 invoices pending release.', impactValue: '$14.2k', probability: 0.76, timestamp: new Date('2025-12-21T10:00:00') },
        { id: 's4', source: 'Assets', type: 'Risk', severity: 'High', summary: 'Renewal risk: 15 high-ARR accounts have entitlement drift.', impactValue: '$84.5k', probability: 0.68, timestamp: new Date('2025-12-21T10:00:00') },
    ]);

    const kpiMetrics: KPIMetrics = {
        itemsNeedingAttention: 31,
        revenueAtRisk: '$242.1k',
        cycleTimeHotspots: '1.4d Avg',
        billingRisk: '$48.5k',
        netRevenueEfficiency: '84.2%'
    };

    const topInsights: string[] = [
        "Here are the 3 biggest bottlenecks today and exactly why",
        "Fix these 2 conflicts to prevent downstream billing errors",
        "These 5 accounts are renewal-risk due to entitlement drift / usage anomalies"
    ];

    const [heartbeat, setHeartbeat] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setHeartbeat(h => (h + 1) % 10000);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <EngineContext.Provider value={{
            stages,
            issues,
            agents,
            signals,
            recommendations: [],
            kpiMetrics,
            topInsights,
            ruleSets: INITIAL_RULE_SETS,
            rules: INITIAL_RULES,
            versions: INITIAL_VERSIONS,
            evalLogs: INITIAL_EVAL_LOGS,
            heartbeat
        }}>
            {children}
        </EngineContext.Provider>
    );
}

export function useEngine() {
    const context = useContext(EngineContext);
    if (context === undefined) {
        throw new Error('useEngine must be used within an EngineProvider');
    }
    return context;
}
