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
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngine, LifecycleStage, Issue } from '@/context/EngineContext';
import { IssueCard } from '@/components/ui/IssueCard';
import { PilotGuide } from '@/components/layout/PilotGuide';
import { FixPreviewModal } from '@/components/ui/FixPreviewModal';

export default function WorkQueue() {
    const { issues, stages } = useEngine();
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

                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-m3-on-surface-variant group-focus-within:text-google-blue transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search issues..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white border border-m3-outline-variant rounded-full py-2.5 pl-11 pr-4 m3-type-label-large focus:outline-none focus:ring-4 focus:ring-google-blue/10 transition-all w-64 shadow-m3-1"
                                />
                            </div>
                            <div className="flex bg-white border border-m3-outline-variant p-1 rounded-full shadow-m3-1">
                                <button
                                    onClick={() => setIsGrouped(!isGrouped)}
                                    className={cn(
                                        "px-5 py-2 rounded-full m3-type-label-large uppercase transition-all",
                                        isGrouped ? "bg-google-blue text-white shadow-google-glow" : "text-m3-on-surface-variant hover:bg-m3-surface-container-high"
                                    )}
                                >
                                    Group by Root Cause
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar border-b border-slate-100/50 mb-2">
                            <button
                                onClick={() => setFilterStage('All')}
                                className={cn(
                                    "px-6 py-2.5 rounded-full m3-type-label-large uppercase transition-all whitespace-nowrap",
                                    filterStage === 'All'
                                        ? "bg-google-blue text-white shadow-google-glow"
                                        : "bg-white border border-m3-outline-variant text-m3-on-surface-variant hover:border-google-blue"
                                )}
                            >
                                All Stages
                            </button>
                            {stages.map((stage) => (
                                <button
                                    key={stage.name}
                                    onClick={() => setFilterStage(stage.name)}
                                    className={cn(
                                        "px-6 py-2.5 rounded-full m3-type-label-large uppercase transition-all whitespace-nowrap flex items-center gap-2",
                                        filterStage === stage.name
                                            ? "bg-google-blue text-white shadow-google-glow"
                                            : "bg-white border border-m3-outline-variant text-m3-on-surface-variant hover:border-google-blue"
                                    )}
                                >
                                    {stage.name}
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-black shadow-m3-1",
                                        filterStage === stage.name ? "bg-white/20 text-white" : "bg-m3-surface-container text-m3-on-surface-variant"
                                    )}>
                                        {stage.counts.atRisk}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-10 py-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Found {filteredIssues.length} issues needing resolution
                            </span>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 cursor-pointer group">
                                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary">Sort by Impact</span>
                                    <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-primary" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12 pb-20">
                            <AnimatePresence mode="popLayout">
                                {isGrouped && groupedIssues ? (
                                    Object.entries(groupedIssues).map(([cause, groupIssues], groupIdx) => (
                                        <motion.div
                                            key={cause}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: groupIdx * 0.1 }}
                                            className="space-y-4"
                                        >
                                            <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-xl w-fit">
                                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                                                    Root Cause: {cause}
                                                </span>
                                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                                <span className="text-[10px] font-bold text-slate-400 italic">
                                                    {groupIssues.length} records affected
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                {groupIssues.map((issue) => (
                                                    <IssueCard
                                                        key={issue.id}
                                                        issue={issue}
                                                        className="border-slate-200 hover:border-primary/40 shadow-sm"
                                                        onPreviewFix={() => handlePreviewFix(issue)}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    filteredIssues.map((issue, idx) => (
                                        <motion.div
                                            key={issue.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <IssueCard
                                                issue={issue}
                                                className="border-slate-200 hover:border-primary/40 shadow-sm"
                                                onPreviewFix={() => handlePreviewFix(issue)}
                                            />
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>

                            {filteredIssues.length === 0 && (
                                <div className="text-center py-20 flex flex-col items-center">
                                    <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                                        <CheckCircle2 className="h-10 w-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Stage Cleared</h3>
                                    <p className="text-sm font-semibold text-slate-400 mt-2">No open issues found for these filters.</p>
                                </div>
                            )}
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
