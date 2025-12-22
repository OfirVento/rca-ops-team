"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Activity,
    AlertCircle,
    TrendingUp,
    ChevronRight,
    BarChart3,
    Clock,
    Settings2,
    Play,
    FileText,
    ShieldCheck,
    Zap,
    History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngine, LifecycleStage } from '@/context/EngineContext';
import { IssueCard } from '@/components/ui/IssueCard';
import { PilotGuide } from '@/components/layout/PilotGuide';
import Link from 'next/link';

interface StageDashboardClientProps {
    stageName: LifecycleStage;
}

export function StageDashboardClient({ stageName }: StageDashboardClientProps) {
    const { stages, issues } = useEngine();
    const [activeTab, setActiveTab] = useState<'Performance' | 'Issues' | 'Lab'>('Performance');

    const stageData = stages.find(s => s.name === stageName);
    const stageIssues = issues.filter(i => i.stage === stageName);

    if (!stageData) return <div>Stage not found</div>;

    const renderStageWidget = () => {
        switch (stageName) {
            case 'Catalog':
                return (
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rule Coverage & Change Feed</h3>
                            <span className="text-[10px] font-bold text-emerald-600">92% Cover</span>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-start gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                                        <History className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-800 tracking-tight">Price Update: Tier 2 EMEA</p>
                                        <p className="text-[10px] font-medium text-slate-500 italic">By System Admin • 2h ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'CPQ':
                return (
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm col-span-2">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Approval Load & Quality</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Queue Depth</p>
                                <p className="text-2xl font-black text-indigo-900 tracking-tight">8 Pending</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Quality Score</p>
                                <p className="text-2xl font-black text-emerald-900 tracking-tight">98.2%</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm col-span-2 flex items-center justify-center italic text-slate-400 text-sm">
                        Standard stage metrics initialized. Specialized widgets coming soon.
                    </div>
                );
        }
    };

    return (
        <div className="flex h-full w-full">
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/30">
                <header className="px-10 pt-10 pb-8 border-b border-slate-200/50 bg-white/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/" className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lifecycle Stage</span>
                            <ChevronRight className="h-3 w-3 text-slate-300" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{stageName}</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
                                {stageName} <span className="text-primary/40">Lab</span>
                            </h1>
                            <p className="text-sm font-bold text-slate-400 mt-2 max-w-lg">
                                Deep-dive into {stageName} health, anomalies, and optimization opportunities.
                            </p>
                        </div>

                        <div className="flex bg-slate-200/50 rounded-2xl p-1.5 min-w-[300px]">
                            {['Performance', 'Issues', 'Lab'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={cn(
                                        "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        activeTab === tab
                                            ? "bg-white text-primary shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-10 py-12 pb-32 no-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeTab === 'Performance' && (
                            <motion.div
                                key="performance"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-12"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4 text-slate-400">
                                            <BarChart3 className="h-4 w-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Throughput</span>
                                        </div>
                                        <p className="text-3xl font-black text-slate-900 tracking-tight">{stageData.counts.total}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Records in motion</p>
                                    </div>
                                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4 text-amber-500">
                                            <AlertCircle className="h-4 w-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">At Risk</span>
                                        </div>
                                        <p className="text-3xl font-black text-slate-900 tracking-tight">{stageData.counts.atRisk}</p>
                                        <p className="text-[10px] font-bold text-amber-500 mt-1 uppercase">Requiring intervention</p>
                                    </div>
                                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4 text-primary">
                                            <Clock className="h-4 w-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Avg Cycle</span>
                                        </div>
                                        <p className="text-3xl font-black text-slate-900 tracking-tight">1.4d</p>
                                        <p className="text-[10px] font-bold text-primary mt-1 uppercase">SLA target: 2.0d</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {renderStageWidget()}

                                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                            <TrendingUp className="h-3.5 w-3.5" />
                                            Health Index Trend
                                        </h3>
                                        <div className="h-40 flex items-end gap-2 pb-2">
                                            {[45, 60, 55, 75, 70, 85, 92].map((h, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "flex-1 rounded-t-lg transition-colors",
                                                        i === 6 ? "bg-primary" : "bg-slate-100"
                                                    )}
                                                    style={{ height: `${h}%` }}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-[8px] font-bold text-slate-400 uppercase">Mon</span>
                                            <span className="text-[8px] font-black text-primary uppercase">Today</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'Issues' && (
                            <motion.div
                                key="issues"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-4xl space-y-8"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-amber-500" />
                                        Critical Workstreams
                                    </h2>
                                </div>
                                <div className="space-y-6">
                                    {stageIssues.map(issue => (
                                        <IssueCard key={issue.id} issue={issue} className="bg-white shadow-sm" />
                                    ))}
                                    {stageIssues.length === 0 && (
                                        <div className="h-64 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 space-y-4">
                                            <ShieldCheck className="h-10 w-10 opacity-20" />
                                            <p className="text-xs font-black uppercase tracking-widest">No Active Issues</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'Lab' && (
                            <motion.div
                                key="lab"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-12"
                            >
                                <div className="p-12 rounded-[3rem] bg-indigo-950 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 opacity-5">
                                        <Settings2 className="h-64 w-64" />
                                    </div>
                                    <div className="relative z-10 max-w-2xl">
                                        <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-6">Optimization <span className="text-primary">Studio</span></h2>
                                        <p className="text-lg font-medium text-slate-300 mb-10 leading-relaxed">
                                            Simulate operational changes, test new logic against historical data, and deploy automated fixes directly from the lab.
                                        </p>
                                        <div className="flex gap-4">
                                            <button className="h-14 px-8 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-transform">
                                                <Play className="h-4 w-4" /> Run Simulation
                                            </button>
                                            <button className="h-14 px-8 rounded-2xl bg-white/10 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all">
                                                View Historical Baselines
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group hover:border-primary/20 transition-all">
                                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-3">Test Against Sample Data</h3>
                                        <p className="text-xs font-bold text-slate-500 leading-relaxed mb-6">
                                            Run new business rules against the last 30 days of production data to identify edge cases before they hit the stream.
                                        </p>
                                        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Configure Test Set</button>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group hover:border-primary/20 transition-all">
                                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Zap className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-3">Predictive ROI</h3>
                                        <p className="text-xs font-bold text-slate-500 leading-relaxed mb-6">
                                            Calculate the estimated margin recovery or cycle time improvement for proposed operational changes.
                                        </p>
                                        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View Projection</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <PilotGuide />
        </div>
    );
}
