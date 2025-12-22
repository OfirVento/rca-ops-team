"use client";

import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Search,
    Filter,
    TrendingUp,
    AlertTriangle,
    FileText,
    MoreVertical,
    History,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngine, LifecycleStage, RuleSet, RuleStatus } from '@/context/EngineContext';
import { PilotGuide } from '@/components/layout/PilotGuide';
import { LogicStatusBadge } from '@/components/logic/LogicStatusBadge';
import { UsageChips } from '@/components/logic/UsageChips';
import { Sparkline } from '@/components/logic/Sparkline';
import { RuleDetailDrawer } from '@/components/logic/RuleDetailDrawer';

export default function AreaRuleSets() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const area = params.area as string;
    const initialFilter = searchParams.get('filter') as RuleStatus | 'All' || 'All';
    const initialRuleSet = searchParams.get('ruleSet');

    const { ruleSets } = useEngine();
    const [filter, setFilter] = useState<string>(initialFilter);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRuleSetId, setSelectedRuleSetId] = useState<string | null>(initialRuleSet);
    const [isDrawerOpen, setIsDrawerOpen] = useState(!!initialRuleSet);

    const filteredAreaSets = useMemo(() => {
        return ruleSets.filter(rs => {
            const matchesArea = area === 'All' || rs.area === area;
            const matchesFilter = filter === 'All' || rs.status === filter || (filter === 'TRENDING' && rs.violations90d > 100);
            const matchesSearch = rs.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rs.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesArea && matchesFilter && matchesSearch;
        });
    }, [ruleSets, area, filter, searchQuery]);

    const handleOpenDetail = (id: string) => {
        setSelectedRuleSetId(id);
        setIsDrawerOpen(true);
    };

    return (
        <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0 relative">
                <header className="px-10 pt-10 pb-6 border-b border-slate-200/50 bg-white/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => router.push('/rules')}
                            className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <ChevronLeft className="h-4 w-4 text-slate-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Rule Sets</span>
                                <span className="text-slate-300">/</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{area}</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
                                {area} <span className="text-slate-400">Rules</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                            {['All', 'ACTIVE', 'TRENDING', 'LEGACY', 'PROPOSED'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={cn(
                                        "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                        filter === f
                                            ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                            : "bg-white border border-slate-200 text-slate-500 hover:border-brand-600/20 hover:text-brand-600"
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Filter area rules..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-600/10 transition-all w-64 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-10 py-10 no-scrollbar relative min-h-0">
                    <div className="max-w-7xl mx-auto space-y-8 pb-20">
                        {/* 2) Agent Summary (Area Specific) */}
                        <section className="bg-indigo-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-4 max-w-2xl">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">Agent Intelligence Report</span>
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight leading-tight uppercase italic">
                                        In {area}, <span className="text-indigo-400">3 rule sets account for 92%</span> of evaluations in the last 90 days.
                                    </h2>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="px-4 py-2 bg-indigo-900/50 border border-indigo-800 rounded-2xl flex items-center gap-3 group cursor-pointer hover:bg-indigo-900 transition-all" onClick={() => setFilter('TRENDING')}>
                                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Bundle Violations ↑ 31%</p>
                                                <p className="text-[9px] font-bold text-indigo-400/80 uppercase">Since Oct 18 update</p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 bg-indigo-900/50 border border-indigo-800 rounded-2xl flex items-center gap-3 group cursor-pointer hover:bg-indigo-900 transition-all" onClick={() => handleOpenDetail('rs1')}>
                                            <div className="h-4 w-4 rounded-full bg-indigo-700 flex items-center justify-center text-[10px] font-black">v12</div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Discount Approvals Stable</p>
                                                <p className="text-[9px] font-bold text-indigo-400/80 uppercase">Deployed 6 days ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-900/40 backdrop-blur-md rounded-3xl p-6 border border-indigo-800/50 min-w-[280px]">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">90d Performance Area</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Evals', val: '41.2k', trend: [10, 15, 8, 20, 18, 25, 30] },
                                            { label: 'Violations', val: '892', trend: [5, 4, 12, 8, 15, 10, 22] },
                                            { label: 'Auto-Fixes', val: '142', trend: [2, 5, 3, 8, 4, 10, 12] },
                                        ].map((t, idx) => (
                                            <div key={idx} className="flex items-center gap-6">
                                                <div className="shrink-0 w-16">
                                                    <p className="text-[8px] font-black text-indigo-500 uppercase">{t.label}</p>
                                                    <p className="text-lg font-black tracking-tighter">{t.val}</p>
                                                </div>
                                                <div className="flex-1 opacity-50">
                                                    <Sparkline data={t.trend} color="#818cf8" height={20} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4) Rule Sets List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Displaying {filteredAreaSets.length} Logic Bundles
                                </h3>
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors tracking-widest">
                                        Sort <TrendingUp className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {filteredAreaSets.map((rs) => (
                                    <motion.div
                                        key={rs.id}
                                        layoutId={rs.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-brand-600/20 hover:shadow-md transition-all group flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-6 flex-1">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors shrink-0">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div className="min-w-0 max-w-sm">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-base font-black text-slate-900 uppercase tracking-tight italic truncate">
                                                        {rs.name}
                                                    </h4>
                                                    <LogicStatusBadge status={rs.status} />
                                                    {rs.violations90d > 500 && (
                                                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-[8px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">
                                                            <TrendingUp className="h-2 w-2" /> Trending
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-bold text-slate-400 line-clamp-1">{rs.description}</p>
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

                                            <div className="h-10 w-[1px] bg-slate-100 hidden xl:block" />

                                            <div className="hidden xl:block shrink-0">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Deployment</p>
                                                <div className="flex items-center gap-2">
                                                    <History className="h-3 w-3 text-slate-400" />
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{rs.currentVersion}</span>
                                                    <span className="text-[9px] font-bold text-slate-400">{rs.lastChange}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 ml-8">
                                            <button
                                                onClick={() => handleOpenDetail(rs.id)}
                                                className="h-10 px-6 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 transition-all shadow-sm"
                                            >
                                                Open Detail
                                            </button>
                                            <button className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                                                <MoreVertical className="h-4 w-4 text-slate-400" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* 5) Legacy Explanation Panel */}
                        {filter === 'LEGACY' && (
                            <section className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 border-dashed">
                                <div className="flex items-start gap-6">
                                    <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-black text-amber-900 uppercase tracking-tight mb-2">Legacy Engine Observation</h3>
                                        <p className="text-sm font-bold text-amber-900/60 leading-relaxed mb-6">
                                            The rule sets below are still firing in production but have been identified for replacement.
                                            Agents are automatically monitoring them for safety, but we recommend migrating legacy templates.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {filteredAreaSets.map(rs => (
                                                <div key={rs.id} className="bg-white rounded-2xl p-5 border border-amber-200/50 shadow-sm flex items-center justify-between group">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Legacy Source</p>
                                                        <p className="text-sm font-black text-slate-900 italic tracking-tight uppercase leading-none">{rs.legacySource}</p>
                                                        <div className="flex items-center gap-2 mt-3">
                                                            <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Replaced by <span className="text-brand-600 font-black">{rs.replacementId ? ruleSets.find(r => r.id === rs.replacementId)?.name : 'V4 Global Engine'}</span></p>
                                                        </div>
                                                    </div>
                                                    <button className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-600 transition-all shadow-sm">
                                                        Create Retirement Plan
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
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
