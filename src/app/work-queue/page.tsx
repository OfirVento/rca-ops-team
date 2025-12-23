"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Filter,
    Search,
    ArrowUpDown,
    MoreHorizontal,
    ChevronDown,
    CheckCircle2,
    AlertTriangle,
    Zap,
    Target,
    BrainCircuit,
    Activity,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngine, LifecycleStage, Issue } from '@/context/EngineContext';
import { IssueCard } from '@/components/ui/IssueCard';
import { PilotGuide } from '@/components/layout/PilotGuide';
import { FixPreviewModal } from '@/components/ui/FixPreviewModal';

export default function WorkQueue() {
    const { issues, stages, agents, signals } = useEngine();
    const [filterStage, setFilterStage] = useState<LifecycleStage | 'All'>('All');
    const [isGrouped, setIsGrouped] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePreviewFix = (issue: Issue) => {
        setSelectedIssue(issue);
        setIsModalOpen(true);
    };

    const handleApplyFix = () => {
        setIsModalOpen(false);
        alert("Fix applied successfully! Audit trail initialized.");
    };

    const filteredIssues = issues.filter(issue => {
        const matchesStage = filterStage === 'All' || issue.stage === filterStage;
        const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStage && matchesSearch;
    });

    const groupedIssues = isGrouped
        ? filteredIssues.reduce((acc, issue) => {
            (acc[issue.rootCause] = acc[issue.rootCause] || []).push(issue);
            return acc;
        }, {} as Record<string, Issue[]>)
        : null;

    return (
        <div className="flex h-full w-full bg-m3-surface-container-low">
            <div className="flex-1 flex flex-col min-h-0">
                <header className="px-10 pt-10 pb-6 border-b border-m3-outline-variant bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-m3-1">
                    <div className="flex items-end justify-between mb-8">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-xl bg-google-yellow/10 flex items-center justify-center shadow-m3-1">
                                    <Zap className="h-4 w-4 text-google-yellow" />
                                </div>
                                <span className="m3-type-label-large text-google-yellow">Operational Inbox</span>
                            </div>
                            <h1 className="m3-type-display-large text-m3-on-surface italic">
                                Work <span className="text-google-blue opacity-40">Queue</span>
                            </h1>
                            <p className="m3-type-body-large text-m3-on-surface-variant">
                                Actionable issues detected by specialist agents across all lifecycles.
                            </p>
                        </div>


                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setFilterStage('All')}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-[9px] font-black uppercase transition-all whitespace-nowrap",
                                filterStage === 'All'
                                    ? "bg-google-blue text-white"
                                    : "bg-white border border-m3-outline-variant text-m3-on-surface-variant hover:border-google-blue"
                            )}
                        >
                            All
                        </button>
                        {stages.map((stage) => (
                            <button
                                key={stage.name}
                                onClick={() => setFilterStage(stage.name)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-[9px] font-black uppercase transition-all whitespace-nowrap flex items-center gap-1",
                                    filterStage === stage.name
                                        ? "bg-google-blue text-white"
                                        : "bg-white border border-m3-outline-variant text-m3-on-surface-variant hover:border-google-blue"
                                )}
                            >
                                {stage.name}
                                <span className={cn(
                                    "px-1 py-0.5 rounded-full text-[8px] font-black",
                                    filterStage === stage.name ? "bg-white/20 text-white" : "bg-m3-surface-container text-m3-on-surface-variant"
                                )}>
                                    {stage.counts.atRisk}
                                </span>
                            </button>
                        ))}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-10 py-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="space-y-8">
                            <section className="bg-white rounded-[32px] border border-m3-outline-variant shadow-m3-1 flex flex-col overflow-hidden">
                                <div className="p-8 border-b border-m3-outline-variant bg-slate-50/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-google-red animate-pulse" />
                                        <h2 className="m3-type-label-large text-m3-on-surface uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Target className="h-4 w-4 text-google-blue" />
                                            Revenue Focus Findings
                                        </h2>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase italic">Sorted by Rev Impact</span>
                                </div>

                                <div className="p-8 space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority High Impact Findings</span>
                                    </div>

                                    <div className="space-y-4">
                                        {signals.map((sig, i) => (
                                            <motion.div
                                                key={sig.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="group flex items-center gap-5 p-5 rounded-[24px] bg-white border border-slate-100 hover:border-google-blue/30 transition-all shadow-sm hover:shadow-m3-2"
                                            >
                                                <div className={cn(
                                                    "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                                    sig.severity === 'High' || sig.severity === 'Critical' ? "bg-google-red/10 text-google-red" : "bg-google-yellow/10 text-google-yellow"
                                                )}>
                                                    <AlertTriangle className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{sig.summary}</h4>
                                                        <span className={cn(
                                                            "text-[12px] font-black tracking-tighter uppercase shrink-0",
                                                            sig.impactValue.startsWith('+') ? "text-google-green" : "text-google-red"
                                                        )}>
                                                            {sig.impactValue} <span className="text-[9px] opacity-40 italic ml-1 font-bold">Risk</span>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                            Source: <span className="text-slate-600">{sig.source}</span>
                                                        </p>
                                                        <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            Confidence: <span className="text-google-blue font-black">{Math.round(sig.probability * 100)}%</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <ArrowUpDown className="h-4 w-4 text-slate-200 group-hover:text-google-blue transition-colors rotate-90" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Active Agency Workstreams */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 px-2">
                                    <span className="text-[10px] font-black text-google-blue uppercase tracking-[0.3em]">Active Agency Workstreams</span>
                                    <div className="flex-1 h-px bg-slate-100" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {agents.slice(0, 4).map((agent, i) => (
                                        <motion.div
                                            key={agent.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-6 rounded-[28px] bg-white border border-m3-outline-variant shadow-m3-1 flex items-start gap-5 hover:border-google-blue/20 transition-all group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <BrainCircuit className="h-12 w-12 text-google-blue" />
                                            </div>
                                            <div className="relative shrink-0 pt-1">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-google-blue/5 group-hover:text-google-blue transition-colors shadow-inner">
                                                    <Activity className="h-6 w-6 animate-pulse" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                                    <div className="h-2.5 w-2.5 rounded-full border-2 border-google-blue border-t-transparent animate-spin" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.1em] leading-none mb-2.5 flex items-center justify-between">
                                                    {agent.name}
                                                    <span className="h-1.5 w-1.5 rounded-full bg-google-green animate-pulse" />
                                                </h4>
                                                <div className="text-[11px] font-semibold text-slate-500 leading-relaxed italic line-clamp-2">
                                                    {agent.status !== 'Idle' ? agent.reasoning : 'Standing by for orchestration instructions...'}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div >

            <FixPreviewModal
                issue={selectedIssue}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onApply={handleApplyFix}
            />

            <PilotGuide />
        </div >
    );
}
