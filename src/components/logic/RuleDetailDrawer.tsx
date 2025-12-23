"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Zap,
    FileText,
    History,
    ShieldCheck,
    ExternalLink,
    Play,
    Plus,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Search,
    Split
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngine, RuleSet, Rule, RuleVersion } from '@/context/EngineContext';
import { LogicStatusBadge } from '@/components/logic/LogicStatusBadge';
import { UsageChips } from '@/components/logic/UsageChips';

import { ReceiptCard } from '@/components/logic/ReceiptCard';

interface RuleDetailDrawerProps {
    ruleSetId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const RuleDetailDrawer = ({ ruleSetId, isOpen, onClose }: RuleDetailDrawerProps) => {
    const { ruleSets, rules, versions, evalLogs } = useEngine();
    const [activeTab, setActiveTab] = useState<'Overview' | 'Rules' | 'Versions' | 'Tests'>('Overview');
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);

    const ruleSet = ruleSets.find(rs => rs.id === ruleSetId);
    const rsRules = rules.filter(r => r.ruleSetId === ruleSetId);
    const rsVersions = versions.filter(v => v.ruleSetId === ruleSetId);

    if (!ruleSet) return null;

    const handleOpenReceipt = (ruleId: string) => {
        const log = evalLogs.find(l => l.ruleId === ruleId);
        if (log) {
            setSelectedLogId(log.id);
            setIsReceiptOpen(true);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-[640px] bg-m3-surface shadow-m3-3 z-[70] flex flex-col border-l border-m3-outline-variant"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-m3-outline-variant bg-m3-surface sticky top-0 z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-m3-lg bg-m3-primary flex items-center justify-center text-m3-on-primary shadow-m3-1">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <LogicStatusBadge status={ruleSet.status} />
                                            <span className="m3-type-label-large font-bold text-m3-on-surface-variant uppercase tracking-widest">{ruleSet.currentVersion} • Prod</span>
                                        </div>
                                        <h2 className="m3-type-headline-large font-black tracking-tight text-m3-on-surface mt-2 uppercase">
                                            {ruleSet.name}
                                        </h2>
                                        <p className="m3-type-label-large font-bold text-m3-primary uppercase tracking-widest mt-1">Steward: {ruleSet.owner}</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="h-10 w-10 rounded-full hover:bg-m3-surface-variant m3-state-layer flex items-center justify-center transition-colors">
                                    <X className="h-5 w-5 text-m3-on-surface-variant" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="flex-1 py-3 bg-m3-surface-variant text-m3-on-surface-variant rounded-full m3-type-label-large font-black uppercase tracking-widest hover:bg-m3-outline-variant transition-all m3-state-layer overflow-hidden shadow-m3-1">
                                    Simulate Logic
                                </button>
                                <button className="flex-1 py-3 bg-m3-primary text-m3-on-primary rounded-full m3-type-label-large font-black uppercase tracking-widest hover:bg-google-blue/90 transition-all m3-state-layer overflow-hidden shadow-m3-1">
                                    Propose Change
                                </button>
                                <button className="h-12 w-12 rounded-full border border-m3-outline-variant flex items-center justify-center hover:bg-m3-surface-variant transition-all m3-state-layer overflow-hidden shadow-m3-1">
                                    <ExternalLink className="h-5 w-5 text-m3-primary" />
                                </button>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex border-b border-m3-outline-variant px-8 gap-1">
                            {['Overview', 'Rules', 'Versions', 'Tests'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={cn(
                                        "px-6 py-5 m3-type-label-large font-black uppercase tracking-widest transition-all relative group overflow-hidden",
                                        activeTab === tab
                                            ? "text-m3-primary"
                                            : "text-m3-on-surface-variant hover:text-m3-on-surface"
                                    )}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-m3-primary rounded-t-full"
                                        />
                                    )}
                                    <div className="absolute inset-0 m3-state-layer opacity-0 group-hover:opacity-10" />
                                </button>
                            ))}
                        </div>

                        {/* Tabs Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-8 bg-m3-surface">
                            {activeTab === 'Overview' && <OverviewTab ruleSet={ruleSet} />}
                            {activeTab === 'Rules' && <RulesTab rules={rsRules} onOpenReceipt={handleOpenReceipt} />}
                            {activeTab === 'Versions' && <VersionsTab versions={rsVersions} />}
                            {activeTab === 'Tests' && <TestsTab />}
                        </div>
                    </motion.div>

                    {selectedLogId && (
                        <ReceiptCard
                            logId={selectedLogId}
                            isOpen={isReceiptOpen}
                            onClose={() => setIsReceiptOpen(false)}
                        />
                    )}
                </>
            )}
        </AnimatePresence>
    );
};

const OverviewTab = ({ ruleSet }: { ruleSet: RuleSet }) => (
    <div className="space-y-8">
        <div className="m3-card-elevated bg-white p-8 border border-m3-outline-variant shadow-m3-1">
            <h3 className="m3-type-label-large font-black uppercase tracking-widest text-m3-primary mb-6">Functional Specification</h3>
            <div className="space-y-4">
                <div className="flex gap-6 items-start">
                    <span className="w-16 m3-type-label-large font-black uppercase text-m3-primary py-1 border-b-2 border-m3-primary/20 shrink-0">When:</span>
                    <p className="m3-type-body-large font-bold text-m3-on-surface pt-1">Segment = Enterprise, Region = EMEA</p>
                </div>
                <div className="flex gap-6 items-start">
                    <span className="w-16 m3-type-label-large font-black uppercase text-m3-primary py-1 border-b-2 border-m3-primary/20 shrink-0">If:</span>
                    <p className="m3-type-body-large font-bold text-m3-on-surface pt-1 font-mono">Discount {'>'} 20%</p>
                </div>
                <div className="flex gap-6 items-start">
                    <span className="w-16 m3-type-label-large font-black uppercase text-m3-primary py-1 border-b-2 border-m3-primary/20 shrink-0">Then:</span>
                    <p className="m3-type-body-large font-black text-m3-on-surface pt-1 italic">Route to VP Finance within 24h SLA</p>
                </div>
                <div className="flex gap-6 items-start">
                    <span className="w-16 m3-type-label-large font-black uppercase text-m3-on-surface-variant py-1 border-b-2 border-m3-outline-variant shrink-0">Else:</span>
                    <p className="m3-type-body-large font-bold text-m3-on-surface-variant pt-1 text-slate-400">Auto-approve</p>
                </div>
            </div>
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-m3-outline-variant">
                <p className="m3-type-label-large font-black text-m3-on-surface-variant uppercase tracking-widest">Active Services:</p>
                <span className="px-3 py-1 rounded-full bg-white border border-m3-outline-variant text-[10px] font-black text-m3-on-surface-variant uppercase shadow-m3-1">Salesforce Quote</span>
                <span className="px-3 py-1 rounded-full bg-white border border-m3-outline-variant text-[10px] font-black text-m3-on-surface-variant uppercase shadow-m3-1">Billing ERP</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
            {[
                { label: 'Evaluations', val: ruleSet.evaluations90d, unit: '90d' },
                { label: 'Violations', val: ruleSet.violations90d, unit: '90d' },
                { label: 'Auto-Fixes', val: 84, unit: '90d' },
            ].map((s, i) => (
                <div key={i} className="m3-card-elevated bg-white p-5 shadow-m3-1">
                    <p className="m3-type-label-large font-bold text-m3-on-surface-variant uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="m3-type-headline-large font-black text-google-blue tracking-tighter">{s.val}</p>
                    <p className="text-[10px] font-black text-google-blue/60 uppercase mt-1 tracking-widest">{s.unit} WINDOW</p>
                </div>
            ))}
        </div>

        <div>
            <h3 className="m3-type-label-large font-black uppercase tracking-widest text-m3-on-surface-variant mb-4 px-1">Top Business Outcomes</h3>
            <div className="space-y-3">
                {[
                    { title: "Discount approval missing VP routing", count: 41, impact: 'High' },
                    { title: "Approval SLA breach risk", count: 12, impact: 'Med' },
                ].map((o, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 m3-card-elevated bg-white hover:bg-google-blue/5 transition-all cursor-pointer group m3-state-layer overflow-hidden shadow-m3-1">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="h-8 w-8 rounded-m3-sm bg-google-blue/10 flex items-center justify-center">
                                <Zap className="h-4 w-4 text-google-blue" />
                            </div>
                            <span className="m3-type-label-large font-black text-m3-on-surface group-hover:text-google-blue transition-colors uppercase tracking-tight">{o.title}</span>
                        </div>
                        <span className="m3-type-label-large font-black text-m3-on-surface-variant group-hover:text-google-blue relative z-10">({o.count} items)</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="p-8 m3-card-elevated bg-google-blue text-white border border-google-blue rounded-m3-xl shadow-m3-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-16 w-16" />
            </div>
            <h4 className="m3-type-label-large font-black uppercase tracking-[0.2em] text-white/60 mb-6 relative z-10">Strategic Pilot Recommendation</h4>
            <div className="space-y-4 relative z-10">
                <div className="flex gap-5">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-m3-1">
                        <CheckCircle2 className="h-5 w-5 text-google-blue" />
                    </div>
                    <div className="flex-1">
                        <p className="m3-type-body-large font-black text-white leading-tight">Optimize SMB Threshold: 20% → 25%</p>
                        <p className="m3-type-label-large font-bold text-white/70 mt-2 leading-relaxed">Agent simulations confirm negligible margin risk with a projected 14% improvement in quote-to-cash velocity.</p>
                        <button className="m3-type-label-large font-black uppercase text-white mt-4 tracking-widest underline hover:text-white/80 transition-colors">Review Impact Model</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const RulesTab = ({ rules, onOpenReceipt }: { rules: Rule[], onOpenReceipt: (id: string) => void }) => (
    <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
            <h3 className="m3-type-label-large font-bold uppercase tracking-widest text-m3-on-surface-variant">Logic Clusters</h3>
            <button className="m3-type-label-large font-black uppercase tracking-widest text-white bg-google-blue px-4 py-2 rounded-full hover:bg-[#176BEF] transition-all shadow-m3-1">
                + New Heuristic
            </button>
        </div>

        <div className="space-y-4">
            {rules.map((rule) => (
                <div key={rule.id} className="m3-card-elevated bg-white p-6 hover:shadow-m3-2 transition-all group cursor-pointer m3-state-layer overflow-hidden shadow-m3-1" onClick={() => onOpenReceipt(rule.id)}>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <h4 className="m3-type-label-large font-black text-m3-on-surface uppercase tracking-tight">{rule.name}</h4>
                        <LogicStatusBadge status={rule.status} />
                    </div>
                    <p className="m3-type-label-large font-bold text-m3-on-surface-variant mb-6 leading-relaxed relative z-10 italic">"{rule.summary}"</p>
                    <div className="flex items-center justify-between pt-5 border-t border-m3-outline-variant relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="m3-type-label-large font-bold text-m3-on-surface-variant uppercase tracking-widest opacity-60">Evaluations</span>
                                <span className="m3-type-label-large font-black text-m3-on-surface mt-1">{rule.evaluations90d} evals</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="m3-type-label-large font-bold text-m3-on-surface-variant uppercase tracking-widest opacity-60">Violations</span>
                                <span className="m3-type-label-large font-black text-m3-on-surface mt-1">{rule.violations90d} hits</span>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 m3-type-label-large font-black uppercase tracking-widest text-google-blue bg-google-blue/10 px-5 py-2 rounded-full shadow-m3-1 opacity-0 group-hover:opacity-100 transition-all">
                            Inspect <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const VersionsTab = ({ versions }: { versions: RuleVersion[] }) => (
    <div className="space-y-8">
        <div className="flex items-center justify-between px-1">
            <h3 className="m3-type-label-large font-bold uppercase tracking-widest text-m3-on-surface-variant">Lifecycle Timeline</h3>
            <button className="flex items-center gap-3 m3-type-label-large font-black uppercase tracking-widest text-m3-primary hover:text-google-blue transition-colors">
                <Split className="h-5 w-5" /> Analytics Bridge
            </button>
        </div>

        <div className="relative pl-10 space-y-12">
            <div className="absolute top-0 bottom-0 left-[19px] w-1 bg-m3-outline-variant/30 rounded-full" />

            {versions.map((v, idx) => (
                <div key={v.id} className="relative">
                    <div className={cn(
                        "absolute -left-[31px] top-1 h-6 w-6 rounded-full border-4 border-m3-surface shadow-m3-1 ring-2 ring-m3-outline-variant transition-all",
                        v.env === 'Prod' ? "bg-emerald-500 scale-110" : "bg-m3-surface-variant"
                    )} />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="m3-type-headline-large font-black text-m3-on-surface tracking-tight uppercase">{v.version}</span>
                                <span className={cn(
                                    "px-3 py-1 rounded-full m3-type-label-large font-black uppercase tracking-widest shadow-m3-1",
                                    v.env === 'Prod' ? "bg-emerald-100 text-emerald-950" : "bg-m3-surface-variant text-m3-on-surface-variant"
                                )}>{v.env}</span>
                            </div>
                            <span className="m3-type-label-large font-bold text-m3-on-surface-variant uppercase tracking-tighter">{v.createdAt}</span>
                        </div>

                        <div className="m3-card-elevated bg-white p-6 relative border border-m3-outline-variant shadow-m3-1">
                            <p className="m3-type-label-large font-bold text-m3-on-surface leading-snug mb-4 italic">"{v.reason}"</p>
                            <div className="pt-4 border-t border-m3-outline-variant/50">
                                <p className="m3-type-label-large font-black text-google-blue uppercase tracking-widest mb-3">Structural Delta:</p>
                                <p className="m3-type-label-large font-bold text-google-green leading-tight flex items-center gap-2">
                                    <Plus className="h-3 w-3" /> {v.diffPlain}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <p className="m3-type-label-large font-bold text-m3-on-surface-variant italic">Authored by {v.createdBy}</p>
                            <div className="flex items-center gap-6">
                                <button className="m3-type-label-large font-black uppercase tracking-widest text-m3-outline border-b-2 border-transparent hover:text-m3-primary hover:border-m3-primary transition-all">Compare</button>
                                <button className="m3-type-label-large font-black uppercase tracking-widest text-m3-outline border-b-2 border-transparent hover:text-m3-primary hover:border-m3-primary transition-all">Rollback</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const TestsTab = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleRunTests = () => {
        setIsRunning(true);
        setTimeout(() => {
            setIsRunning(false);
            setShowResults(true);
        }, 2000);
    };

    return (
        <div className="space-y-8">
            <div className="m3-card-elevated bg-white p-8 border border-m3-outline-variant shadow-m3-1">
                <h3 className="m3-type-label-large font-black uppercase tracking-widest text-google-blue mb-6">Simulation Sandbox</h3>
                <div className="space-y-4">
                    {[
                        { id: '30d', label: 'Rolling 30-Day Population', desc: 'Enterprise wide: 2,400 active records' },
                        { id: '1k', label: 'Balanced Representative Sample', desc: 'Standard cross-region verification: 1000 records' },
                        { id: 'edge', label: 'Edge-Case Regression Suite', desc: 'Critical path validation: 12 high-drift scenarios' },
                    ].map((opt) => (
                        <label key={opt.id} className="flex items-start gap-4 p-5 m3-card-elevated bg-white cursor-pointer hover:shadow-m3-2 transition-all group m3-state-layer overflow-hidden shadow-m3-1">
                            <input type="radio" name="dataset" defaultChecked={opt.id === '30d'} className="mt-1.5 h-4 w-4 accent-google-blue" />
                            <div className="relative z-10">
                                <p className="m3-type-label-large font-black text-m3-on-surface uppercase tracking-tight mb-1">{opt.label}</p>
                                <p className="m3-type-label-large font-bold text-m3-on-surface-variant leading-none">{opt.desc}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <button
                onClick={handleRunTests}
                disabled={isRunning}
                className={cn(
                    "w-full py-5 rounded-full text-white m3-type-label-large font-black uppercase tracking-[0.3em] shadow-m3-3 transition-all flex items-center justify-center gap-4 m3-state-layer overflow-hidden",
                    isRunning ? "bg-m3-outline-variant cursor-wait" : "bg-google-blue hover:bg-[#176BEF]"
                )}
            >
                {isRunning ? (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="h-5 w-5 border-3 border-white/20 border-t-white rounded-full"
                        />
                        Modeling Logic Impact...
                    </>
                ) : (
                    <>
                        <Play className="h-4 w-4 fill-current" /> Execute Impact Simulation
                    </>
                )}
            </button>

            {showResults && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between p-8 m3-card-elevated bg-google-green text-white rounded-m3-xl shadow-m3-2">
                        <div className="flex items-center gap-5">
                            <div className="h-12 w-12 bg-white rounded-m3-md flex items-center justify-center text-google-green shadow-m3-1">
                                <CheckCircle2 className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="m3-type-label-large font-black uppercase tracking-widest text-white/60 mb-1">Regression Cleanliness</p>
                                <p className="m3-type-headline-large font-black text-white uppercase">99.7% Pass Ratio</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="m3-type-label-large font-black text-white/60 mb-1">Status</p>
                            <p className="m3-type-headline-large font-black text-white tracking-tighter">SUCCESS</p>
                        </div>
                    </div>

                    <div className="space-y-4 px-1">
                        <h4 className="m3-type-label-large font-black uppercase tracking-widest text-m3-on-surface-variant">Anomalies Detected (8)</h4>
                        <div className="space-y-3">
                            {[
                                { ref: 'Q-11029', why: 'Strategic account bypass failed for Mid-Market region', expected: 'Auto-Approve', actual: 'Fix Rule Set' }
                            ].map((fail, i) => (
                                <div key={i} className="m3-card-elevated bg-white p-5 flex items-center justify-between group shadow-m3-1 m3-state-layer overflow-hidden">
                                    <div className="flex items-center gap-5 relative z-10">
                                        <AlertCircle className="h-5 w-5 text-m3-error" />
                                        <div>
                                            <p className="m3-type-label-large font-black text-m3-on-surface uppercase tracking-tight">{fail.ref}</p>
                                            <p className="m3-type-label-large font-bold text-m3-on-surface-variant">{fail.why}</p>
                                        </div>
                                    </div>
                                    <button className="m3-type-label-large font-black uppercase text-google-blue underline opacity-0 group-hover:opacity-100 transition-all relative z-10">
                                        Generate Unit Test
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
