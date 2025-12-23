"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Search,
    ShieldCheck,
    RotateCcw,
    Loader2,
    Activity,
    UserCircle2,
    Settings2,
    FileText,
    BrainCircuit,
    ChevronRight,
    Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'Selection' | 'Proof' | 'Preview' | 'Applying' | 'Verifying' | 'Completed';

interface Decision {
    id: number;
    title: string;
    why: string;
    scope: string;
    primaryAction: string;
    secondaryActions: string[];
    proofData: { record: string; contract: string; billing: string; status: string }[];
    previewDiff: { field: string; before: string; after: string }[];
}

const DECISIONS: Decision[] = [
    {
        id: 1,
        title: "Contract ↔ billing mismatch",
        why: "This can cause billing confusion and disparities.",
        scope: "9 accounts · 12 invoices",
        primaryAction: "Fix contract ↔ billing mismatch",
        secondaryActions: ["Unstick approvals", "Resolve CPQ rule conflict"],
        proofData: [
            { record: "ACME-402", contract: "Net 30", billing: "Net 60", status: "Mismatch" },
            { record: "GLOBEX-12", contract: "Net 45", billing: "Net 15", status: "Mismatch" },
            { record: "STARK-55", contract: "Monthly", billing: "Quarterly", status: "Drift" }
        ],
        previewDiff: [
            { field: "Payment Terms", before: "Net 60", after: "Net 30 (Sync)" },
            { field: "Invoice Cycle", before: "Manual", after: "Automated" },
            { field: "Approval Ref", before: "None", after: "AUTH-Q4-01" }
        ]
    },
    {
        id: 2,
        title: "Approvals are backing up",
        why: "Approvals are slowing closes and affecting forecast flow.",
        scope: "11 deals · 2 approvers",
        primaryAction: "Unstick approvals",
        secondaryActions: ["Fix billing mismatch", "Resolve CPQ rule conflict"],
        proofData: [
            { record: "OPP-882", contract: "Legal Prep", billing: "52h Aging", status: "Stalled" },
            { record: "OPP-910", contract: "Finance Review", billing: "38h Aging", status: "Delayed" },
            { record: "OPP-774", contract: "Executive Sign", billing: "14h Aging", status: "Pending" }
        ],
        previewDiff: [
            { field: "Routing Path", before: "Sequential", after: "Parallel (Escalated)" },
            { field: "SLA Deadline", before: "Expired", after: "Reset (Priority)" },
            { field: "Owner", before: "J. Doe", after: "System Bypass" }
        ]
    },
    {
        id: 3,
        title: "CPQ rule conflict",
        why: "Rule conflict is creating inconsistent outcomes and rework.",
        scope: "37 quotes affected",
        primaryAction: "Resolve CPQ rule conflict",
        secondaryActions: ["Fix billing mismatch", "Unstick approvals"],
        proofData: [
            { record: "Q-9012", contract: "Disc Policy v1", billing: "Pricing Floor", status: "Overlap" },
            { record: "Q-9015", contract: "Tier 2 Logic", billing: "Legacy Global", status: "Conflict" },
            { record: "Q-8821", contract: "Bundle A-1", billing: "Component v2", status: "Anomaly" }
        ],
        previewDiff: [
            { field: "Rule Priority", before: "Default", after: "High (Clean)" },
            { field: "Override Policy", before: "Allow All", after: "Restricted" },
            { field: "Logic Engine", before: "Legacy", after: "Pilot v2.4" }
        ]
    }
];

export function LiveWorkspace() {
    const [currentDecisionId, setCurrentDecisionId] = useState(1);
    const [step, setStep] = useState<Step>('Selection');
    const [verifyingCount, setVerifyingCount] = useState(0);

    const decision = DECISIONS.find(d => d.id === currentDecisionId) || DECISIONS[0];

    // Handle verification auto-progression
    useEffect(() => {
        if (step === 'Verifying') {
            const interval = setInterval(() => {
                setVerifyingCount(prev => {
                    if (prev >= 9) {
                        clearInterval(interval);
                        setTimeout(() => setStep('Completed'), 1000);
                        return 9;
                    }
                    return prev + 1;
                });
            }, 300);
            return () => clearInterval(interval);
        } else if (step === 'Selection') {
            setVerifyingCount(0);
        }
    }, [step]);

    const handlePrimaryClick = () => {
        if (step === 'Selection') setStep('Preview');
        else if (step === 'Proof') setStep('Preview');
        else if (step === 'Preview') {
            setStep('Applying');
            setTimeout(() => setStep('Verifying'), 1500);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="grid grid-cols-12 gap-8 h-full">

                {/* Component 1: Agent Runboard */}
                <div className="col-span-3 space-y-4">
                    <div className="flex items-center gap-2 px-1 mb-2">
                        <Activity className="h-3 w-3 text-google-blue" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Runboard</span>
                    </div>

                    <div className="space-y-3">
                        {[
                            { name: 'Orchestration Pilot', state: step === 'Verifying' ? 'Verifying' : 'Scanning', activity: 'Comparing contract-to-billing terms', impact: 'High', icon: BrainCircuit, color: 'text-google-blue' },
                            { name: 'Approval Coach', state: 'Waiting on you', activity: 'Triaging SLA aging in CPQ', impact: 'Med', icon: UserCircle2, color: 'text-google-yellow' },
                            { name: 'CPQ Policy Agent', state: 'Investigating', activity: 'Identifying discount overlaps', impact: 'Med', icon: ShieldCheck, color: 'text-google-green' },
                            { name: 'Billing Sentinel', state: 'Proposing', activity: 'Automating reconciliation', impact: 'High', icon: Settings2, color: 'text-google-red' }
                        ].map((agent, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-google-blue/30 transition-all group cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <agent.icon className={cn("h-4 w-4", agent.color)} />
                                        <span className="text-xs font-bold text-slate-900">{agent.name}</span>
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter",
                                        agent.state === 'Waiting on you' ? "bg-google-yellow/10 text-google-yellow border border-google-yellow/20" :
                                            agent.state === 'Verifying' ? "bg-google-green/10 text-google-green border border-google-green/20" :
                                                "bg-slate-50 text-slate-400 border border-slate-200"
                                    )}>
                                        {agent.state}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-600 mb-2 leading-snug">{agent.activity}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-slate-400">Impact: <span className="text-slate-600 uppercase">{agent.impact}</span></span>
                                    {(agent.state === 'Scanning' || agent.state === 'Investigating') && (
                                        <div className="flex gap-0.5">
                                            <div className="h-1 w-1 rounded-full bg-google-blue animate-bounce [animation-delay:-0.3s]" />
                                            <div className="h-1 w-1 rounded-full bg-google-blue animate-bounce [animation-delay:-0.15s]" />
                                            <div className="h-1 w-1 rounded-full bg-google-blue animate-bounce" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Component 2: Decision Card */}
                <div className="col-span-5 flex flex-col pt-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentDecisionId + step}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="bg-white border-2 border-slate-900 rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
                        >
                            {/* Accent line */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-google-blue" />

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-google-blue animate-pulse" />
                                        <span className="text-[11px] font-black text-google-blue uppercase tracking-[0.2em]">Primary Decision</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-none italic">{decision.title}</h2>
                                    <p className="text-slate-600 text-base">{decision.why}</p>
                                </div>

                                <div className="flex items-center gap-6 py-4 border-y border-slate-100">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blast Radius</span>
                                        <span className="text-lg font-bold text-slate-900">{decision.scope}</span>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intelligence Confidence</span>
                                        <span className="text-lg font-bold text-google-green italic">98.2%</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <button
                                        onClick={handlePrimaryClick}
                                        disabled={step === 'Applying' || step === 'Verifying'}
                                        className={cn(
                                            "w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                                            step === 'Completed' ? "bg-google-green text-white" :
                                                "bg-google-blue text-white hover:bg-black hover:scale-[1.01] shadow-xl hover:shadow-google-blue/20"
                                        )}
                                    >
                                        {step === 'Applying' && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {step === 'Verifying' && <Activity className="h-4 w-4 animate-pulse" />}
                                        {step === 'Completed' && <CheckCircle2 className="h-4 w-4" />}
                                        {step === 'Selection' && decision.primaryAction}
                                        {step === 'Proof' && "Proceed to Preview"}
                                        {step === 'Preview' && "Confirm and Apply Fix"}
                                        {step === 'Applying' && "Applying Live Fix..."}
                                        {step === 'Verifying' && `Verifying Changes...`}
                                        {step === 'Completed' && `Fix Successfully Applied`}
                                    </button>

                                    {step === 'Selection' && (
                                        <div className="grid grid-cols-2 gap-3">
                                            {decision.secondaryActions.map((act, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentDecisionId(i === 0 ? (currentDecisionId === 1 ? 2 : 1) : 3)}
                                                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200/50"
                                                >
                                                    {act}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <button
                                        onClick={() => setStep('Proof')}
                                        className="text-[11px] font-bold text-slate-400 hover:text-google-blue transition-colors flex items-center gap-1.5 group"
                                    >
                                        <Search className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                                        Show proof first
                                    </button>
                                    <button className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1.5 group">
                                        Jump to chat
                                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Component 3: Proof / Preview / Verify Panel */}
                <div className="col-span-4 space-y-6 pt-8">
                    <AnimatePresence mode="wait">
                        {step === 'Selection' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50"
                            >
                                <BrainCircuit className="h-12 w-12 text-slate-200 mb-4" />
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest text-center">Select an action to see intelligence proof</p>
                            </motion.div>
                        )}

                        {step === 'Proof' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm overflow-hidden flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Evidence Workbench</span>
                                    <span className="text-[10px] font-bold text-google-blue bg-blue-50 px-2 py-1 rounded-lg">Rule v2.4a</span>
                                </div>

                                <p className="text-xs text-slate-600 mb-4 font-medium italic">"I detected structural disagreement between production billing schedules and legal contract Net-Terms across these core accounts."</p>

                                <div className="flex-1 overflow-hidden rounded-xl border border-slate-100">
                                    <table className="w-full text-left text-[11px]">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="px-4 py-2.5 font-black text-slate-400 uppercase tracking-tighter">Record</th>
                                                <th className="px-4 py-2.5 font-black text-slate-400 uppercase tracking-tighter">Contract</th>
                                                <th className="px-4 py-2.5 font-black text-slate-400 uppercase tracking-tighter">Billing</th>
                                                <th className="px-4 py-2.5 font-black text-slate-400 uppercase tracking-tighter">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {decision.proofData.map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-3 font-bold text-slate-900">{row.record}</td>
                                                    <td className="px-4 py-3 text-slate-600">{row.contract}</td>
                                                    <td className="px-4 py-3 text-slate-600 font-mono">{row.billing}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-google-red font-black text-[9px] uppercase">{row.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px]">
                                    <span className="text-slate-400">Total Conflicts Detected</span>
                                    <span className="font-black text-slate-900 uppercase">9 Instances</span>
                                </div>
                            </motion.div>
                        )}

                        {step === 'Preview' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm overflow-hidden flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Pre-Change Preview</span>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                                        <ShieldCheck className="h-3 w-3" />
                                        <span className="text-[10px] font-black">Simulation Passed</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {decision.previewDiff.map((diff, i) => (
                                        <div key={i} className="space-y-1.5 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{diff.field}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[11px] text-slate-400 line-through decoration-google-red/40 decoration-2">{diff.before}</span>
                                                <ArrowRight className="h-3 w-3 text-slate-300" />
                                                <span className="text-[11px] font-bold text-google-green">{diff.after}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-google-blue/5 rounded-2xl border border-google-blue/10 space-y-2.5">
                                    <p className="text-[10px] font-black text-google-blue uppercase tracking-widest">Operational Guardrails</p>
                                    {[
                                        'Zero logic conflicts remaining post-sync',
                                        'Automatic rollback point initialized',
                                        'Downstream billing alerts suppressed'
                                    ].map((g, i) => (
                                        <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600">
                                            <CheckCircle2 className="h-3 w-3 text-google-blue/40" />
                                            <span>{g}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {(step === 'Verifying' || step === 'Completed') && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white border-2 border-google-green rounded-[32px] p-8 shadow-sm flex flex-col h-full"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Live Engine</span>
                                        <span className="text-xl font-bold text-slate-900 tracking-tight italic">Automated Verification</span>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-google-green/10 flex items-center justify-center">
                                        <CheckCircle2 className="h-6 w-6 text-google-green" />
                                    </div>
                                </div>

                                <div className="space-y-5 flex-1">
                                    {[
                                        { t: 'Compiling change set', s: true },
                                        { t: 'Applying updates to records', s: true },
                                        { t: 'Re-checking affected paths', s: verifyingCount > 3 },
                                        { t: 'Confirming consistency', s: verifyingCount > 6 },
                                        { t: 'Logging and establishing rollback', s: verifyingCount === 9 }
                                    ].map((check, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-5 w-5 rounded-full flex items-center justify-center transition-all duration-500",
                                                check.s ? "bg-google-green text-white rotate-0" : "bg-slate-100 text-slate-300"
                                            )}>
                                                {check.s ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />}
                                            </div>
                                            <span className={cn(
                                                "text-xs font-semibold transition-all",
                                                check.s ? "text-slate-900" : "text-slate-400"
                                            )}>
                                                {check.t}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Verification Status</span>
                                        <span className="text-lg font-bold text-slate-900">{verifyingCount}/9 <span className="text-[11px] text-google-green uppercase font-black ml-1">Verified</span></span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-google-green"
                                            animate={{ width: `${(verifyingCount / 9) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'Applying' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-[32px] border border-slate-200 shadow-sm"
                            >
                                <div className="relative mb-6">
                                    <Loader2 className="h-12 w-12 text-google-blue animate-spin" />
                                    <div className="absolute inset-0 bg-google-blue/10 rounded-full scale-150 animate-pulse" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-widest">Applying Logic Fix</h3>
                                <p className="text-[11px] text-slate-400 text-center font-medium max-w-[180px]">Orchestrating changes across 9 accounts and downstream schedules...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
