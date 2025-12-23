"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutGrid,
    Search,
    ExternalLink,
    FileText,
    TrendingUp,
    AlertTriangle,
    MoreVertical,
    ArrowRight,
    GitBranch,
    List
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngine, LifecycleStage, RuleStatus } from '@/context/EngineContext';
import { PilotGuide } from '@/components/layout/PilotGuide';
import { LifecycleStepper } from '@/components/ui/LifecycleStepper';
import { LogicStatusBadge } from '@/components/logic/LogicStatusBadge';
import { UsageChips } from '@/components/logic/UsageChips';
import { Sparkline } from '@/components/logic/Sparkline';
import { RuleDetailDrawer } from '@/components/logic/RuleDetailDrawer';
import { LogicDiagram } from '@/components/logic/LogicDiagram';

export default function LogicHome() {
    const { stages, ruleSets } = useEngine();
    const [selectedArea, setSelectedArea] = useState<LifecycleStage | 'All'>('All');
    const [filter, setFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRuleSetId, setSelectedRuleSetId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'diagram'>('list');

    const filteredRuleSets = useMemo(() => {
        return ruleSets.filter(rs => {
            const matchesArea = selectedArea === 'All' || rs.area === selectedArea;
            const matchesFilter = filter === 'All' || rs.status === filter || (filter === 'TRENDING' && rs.violations90d > 100);
            const matchesSearch = rs.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rs.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesArea && matchesFilter && matchesSearch;
        });
    }, [ruleSets, selectedArea, filter, searchQuery]);

    const handleOpenDetail = (id: string) => {
        setSelectedRuleSetId(id);
        setIsDrawerOpen(true);
    };

    const handleStageClick = (stageName: string) => {
        if (stageName === selectedArea) {
            setSelectedArea('All');
        } else {
            setSelectedArea(stageName as LifecycleStage);
        }
    };

    // Calculate stats for selected area
    const areaStats = useMemo(() => {
        const areaRules = selectedArea === 'All' ? ruleSets : ruleSets.filter(rs => rs.area === selectedArea);
        return {
            total: areaRules.length,
            active: areaRules.filter(rs => rs.status === 'ACTIVE').length,
            legacy: areaRules.filter(rs => rs.status === 'LEGACY').length,
            evaluations: areaRules.reduce((sum, rs) => sum + rs.evaluations90d, 0),
            violations: areaRules.reduce((sum, rs) => sum + rs.violations90d, 0)
        };
    }, [ruleSets, selectedArea]);

    return (
        <div className="flex h-screen w-full bg-white overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0 relative">
                <header className="px-10 pt-10 pb-6 border-b border-m3-outline-variant bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-lg bg-google-blue/10 flex items-center justify-center">
                                    <LayoutGrid className="h-3.5 w-3.5 text-google-blue" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-google-blue">Control Plane</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-m3-on-surface uppercase italic leading-none">
                                Business <span className="text-google-blue">Logic</span>
                            </h1>
                            <p className="text-sm font-bold text-m3-on-surface-variant">
                                Rules that power agents across the revenue lifecycle
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search rules..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-600/10 transition-all w-64 shadow-sm"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm group">
                                Salesforce <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-brand-600" />
                            </button>
                        </div>
                    </div>

                    {/* Lifecycle Stepper as Filter */}
                    <div className="mt-8">
                        <LifecycleStepper
                            onStageClick={handleStageClick}
                            selectedStage={selectedArea === 'All' ? null : selectedArea}
                        />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-10 py-10 no-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Area Intelligence Banner */}
                        <section className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-4 max-w-2xl">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-google-blue">
                                            {selectedArea === 'All' ? 'Global Intelligence Report' : `${selectedArea} Intelligence Report`}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight leading-tight uppercase italic">
                                        {selectedArea === 'All' ? (
                                            <>Across all areas, <span className="text-google-blue">{areaStats.active} active rule sets</span> with {areaStats.evaluations.toLocaleString()} evaluations (90d).</>
                                        ) : (
                                            <>In {selectedArea}, <span className="text-google-blue">{areaStats.active} rule sets account for 92%</span> of evaluations in the last 90 days.</>
                                        )}
                                    </h2>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 group cursor-pointer hover:bg-white/10 transition-all" onClick={() => setFilter('TRENDING')}>
                                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Violations: {areaStats.violations}</p>
                                                <p className="text-[9px] font-bold text-slate-400/80 uppercase">90d total across bundles</p>
                                            </div>
                                        </div>
                                        {areaStats.legacy > 0 && (
                                            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 group cursor-pointer hover:bg-white/10 transition-all" onClick={() => setFilter('LEGACY')}>
                                                <AlertTriangle className="h-4 w-4 text-amber-400" />
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">{areaStats.legacy} Legacy Rules</p>
                                                    <p className="text-[9px] font-bold text-slate-400/80 uppercase">Still firing in production</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 min-w-[280px]">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-google-blue mb-4">90d Performance</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Evals', val: areaStats.evaluations.toLocaleString(), trend: [10, 15, 8, 20, 18, 25, 30] },
                                            { label: 'Violations', val: areaStats.violations.toString(), trend: [5, 4, 12, 8, 15, 10, 22] },
                                            { label: 'Rule Sets', val: areaStats.total.toString(), trend: [2, 5, 3, 8, 4, 10, 12] },
                                        ].map((t, idx) => (
                                            <div key={idx} className="flex items-center gap-6">
                                                <div className="shrink-0 w-20">
                                                    <p className="text-[8px] font-black text-slate-500 uppercase">{t.label}</p>
                                                    <p className="text-lg font-black tracking-tighter">{t.val}</p>
                                                </div>
                                                <div className="flex-1 opacity-50">
                                                    <Sparkline data={t.trend} color="#4285F4" height={20} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Filter Pills */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                                {['All', 'ACTIVE', 'TRENDING', 'LEGACY', 'PROPOSED'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={cn(
                                            "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                            filter === f
                                                ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                                : "bg-white border border-slate-200 text-slate-500 hover:border-google-blue/20 hover:text-google-blue"
                                        )}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                        viewMode === 'list'
                                            ? "bg-slate-900 text-white"
                                            : "text-slate-500 hover:text-google-blue"
                                    )}
                                >
                                    <List className="h-3.5 w-3.5" />
                                    List
                                </button>
                                <button
                                    onClick={() => setViewMode('diagram')}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                        viewMode === 'diagram'
                                            ? "bg-google-blue text-white shadow-google-glow"
                                            : "text-slate-500 hover:text-google-blue"
                                    )}
                                >
                                    <GitBranch className="h-3.5 w-3.5" />
                                    Diagram
                                </button>
                            </div>
                        </div>

                        {/* Conditional View: Diagram or List */}
                        {viewMode === 'diagram' ? (
                            <LogicDiagram selectedArea={selectedArea} />
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Displaying {filteredRuleSets.length} Logic Bundles
                                            {selectedArea !== 'All' && <span className="text-google-blue ml-2">({selectedArea})</span>}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 pb-20">
                                        {filteredRuleSets.map((rs) => (
                                            <motion.div
                                                key={rs.id}
                                                layoutId={rs.id}
                                                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-google-blue/20 hover:shadow-md transition-all group flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-6 flex-1">
                                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-google-blue transition-colors shrink-0">
                                                        <FileText className="h-6 w-6" />
                                                    </div>
                                                    <div className="min-w-0 max-w-sm">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-base font-black text-slate-900 uppercase tracking-tight italic truncate">
                                                                {rs.name}
                                                            </h4>
                                                            <LogicStatusBadge status={rs.status} />
                                                        </div>
                                                        <p className="text-xs font-bold text-slate-400 line-clamp-1">{rs.description}</p>
                                                        <p className="text-[9px] font-black text-google-blue uppercase tracking-widest mt-1">{rs.area}</p>
                                                    </div>

                                                    <div className="h-10 w-[1px] bg-slate-100 hidden lg:block" />

                                                    <div className="hidden lg:block shrink-0">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">90d Evaluations</p>
                                                        <UsageChips d7={rs.evaluations7d} d30={rs.evaluations30d} d90={rs.evaluations90d} />
                                                    </div>

                                                    <div className="h-10 w-[1px] bg-slate-100 hidden xl:block" />

                                                    <div className="hidden xl:block shrink-0">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Violations / Issues</p>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-black text-slate-900 leading-none">{rs.violations90d}</span>
                                                                <span className="text-[7px] font-bold text-slate-400 uppercase">Violations</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-black text-slate-900 leading-none">{rs.issuesCount}</span>
                                                                <span className="text-[7px] font-bold text-slate-400 uppercase">Issues</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 shrink-0 ml-8">
                                                    <button
                                                        onClick={() => handleOpenDetail(rs.id)}
                                                        className="h-10 px-6 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-google-blue transition-all shadow-sm"
                                                    >
                                                        Open Detail
                                                    </button>
                                                    <button className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                                                        <MoreVertical className="h-4 w-4 text-slate-400" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {filteredRuleSets.length === 0 && (
                                            <div className="text-center py-20 flex flex-col items-center">
                                                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                                                    <FileText className="h-10 w-10 text-slate-300" />
                                                </div>
                                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No Rules Found</h3>
                                                <p className="text-sm font-semibold text-slate-400 mt-2">
                                                    No rule sets match the current filters.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {filter === 'LEGACY' && filteredRuleSets.length > 0 && (
                                    <section className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 border-dashed">
                                        <div className="flex items-start gap-6">
                                            <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                                                <AlertTriangle className="h-6 w-6 text-amber-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-black text-amber-900 uppercase tracking-tight mb-2">Legacy Engine Observation</h3>
                                                <p className="text-sm font-bold text-amber-900/60 leading-relaxed mb-6">
                                                    The rule sets below are still firing in production but have been identified for replacement.
                                                </p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {filteredRuleSets.filter(rs => rs.status === 'LEGACY').map(rs => (
                                                        <div key={rs.id} className="bg-white rounded-2xl p-5 border border-amber-200/50 shadow-sm flex items-center justify-between group">
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Legacy Source</p>
                                                                <p className="text-sm font-black text-slate-900 italic tracking-tight uppercase leading-none">{rs.legacySource || rs.name}</p>
                                                                <div className="flex items-center gap-2 mt-3">
                                                                    <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Replaced by <span className="text-google-blue font-black">V4 Global Engine</span></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>

            <PilotGuide />

            {selectedRuleSetId && (
                <RuleDetailDrawer
                    ruleSetId={selectedRuleSetId}
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                />
            )}
        </div>
    );
}
