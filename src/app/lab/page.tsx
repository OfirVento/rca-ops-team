"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    TrendingUp,
    Target,
    Users,
    AlertTriangle,
    RefreshCcw,
    ShieldCheck,
    ChevronRight,
    Info,
    BarChart3,
    Play,
    Database,
    Search,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PilotGuide } from '@/components/layout/PilotGuide';

export default function OptimizationLab() {
    const [discountThreshold, setDiscountThreshold] = useState(20);
    const [renewalUplift, setRenewalUplift] = useState(3);
    const [dunningStart, setDunningStart] = useState(7);
    const [isSimulating, setIsSimulating] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Simple simulation logic for 1000 records
    const impact = useMemo(() => {
        const revLift = (renewalUplift - 3) * 142000 + (20 - discountThreshold) * 45000;
        const opsLoad = (discountThreshold < 20 ? 15 : -8) + (dunningStart < 5 ? 12 : -5);
        const affected = 1000 * (Math.abs(discountThreshold - 20) / 100 + 0.12);

        return {
            revenue: revLift > 0 ? `+$${(revLift / 1000).toFixed(1)}k` : `-$${(Math.abs(revLift) / 1000).toFixed(1)}k`,
            revenueValue: revLift,
            opsLoad: opsLoad > 0 ? `+${opsLoad}%` : `${opsLoad}%`,
            opsLoadValue: opsLoad,
            affectedRecords: Math.floor(affected),
            risk: discountThreshold > 25 ? 'High' : discountThreshold > 22 ? 'Medium' : 'Low',
            passRate: 100 - (affected / 10),
            simulationTime: '1.2s'
        };
    }, [discountThreshold, renewalUplift, dunningStart]);

    const runSimulation = () => {
        setIsSimulating(true);
        setShowResults(false);
        setTimeout(() => {
            setIsSimulating(false);
            setShowResults(true);
        }, 1500);
    };

    return (
        <div className="flex h-full w-full bg-m3-surface-container-low">
            <div className="flex-1 flex flex-col min-h-0">
                <header className="px-10 pt-10 pb-8 space-y-6 bg-white/80 backdrop-blur-md border-b border-m3-outline-variant sticky top-0 z-20 shadow-m3-1">
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-xl bg-google-blue/10 flex items-center justify-center shadow-m3-1">
                                    <Zap className="h-4 w-4 text-google-blue animate-pulse" />
                                </div>
                                <span className="m3-type-label-large text-google-blue">Simulate & Strategy</span>
                            </div>
                            <h1 className="m3-type-display-large text-m3-on-surface italic">
                                Optimization <span className="text-google-blue opacity-40">Lab</span>
                            </h1>
                            <p className="m3-type-body-large text-m3-on-surface-variant">
                                Portfolio-level "what-if" modeling for revenue policy changes.
                            </p>
                        </div>

                        <button
                            onClick={runSimulation}
                            disabled={isSimulating}
                            className="px-8 py-4 rounded-full bg-google-blue text-white m3-type-label-large uppercase tracking-widest hover:bg-[#176BEF] disabled:opacity-50 transition-all flex items-center gap-3 shadow-google-glow"
                        >
                            {isSimulating ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                            Run Proactive Simulation
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-10 py-10 pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Controls Panel */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white rounded-[2.5rem] p-8 border border-m3-outline-variant shadow-m3-1 space-y-10">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-google-blue/10 flex items-center justify-center text-google-blue shadow-m3-1">
                                        <Database className="h-5 w-5" />
                                    </div>
                                    <h3 className="m3-type-label-large text-m3-on-surface uppercase tracking-widest">Policy Variables</h3>
                                </div>

                                {/* Control 1 */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="m3-type-label-large text-m3-on-surface-variant uppercase">Discount Threshold</p>
                                            <p className="text-[10px] font-black text-m3-on-surface-variant/60 uppercase">Auto-approval limit</p>
                                        </div>
                                        <span className="m3-type-title-large text-google-blue italic">{discountThreshold}%</span>
                                    </div>
                                    <input
                                        type="range" min="10" max="40" step="1"
                                        value={discountThreshold}
                                        onChange={(e) => setDiscountThreshold(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-m3-surface-container-high rounded-full appearance-none accent-google-blue cursor-pointer"
                                    />
                                </div>

                                {/* Control 2 */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="m3-type-label-large text-m3-on-surface-variant uppercase">Renewal Uplift</p>
                                            <p className="text-[10px] font-black text-m3-on-surface-variant/60 uppercase">Target annual increase</p>
                                        </div>
                                        <span className="m3-type-title-large text-google-blue italic">{renewalUplift}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="15" step="0.5"
                                        value={renewalUplift}
                                        onChange={(e) => setRenewalUplift(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-m3-surface-container-high rounded-full appearance-none accent-google-blue cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="p-8 rounded-[2rem] bg-google-blue text-white relative overflow-hidden group shadow-google-glow">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="h-16 w-16" />
                                </div>
                                <h4 className="m3-type-label-large text-white/50 uppercase tracking-widest mb-4">Guardrail Advisory</h4>
                                <p className="m3-type-title-large text-white leading-tight italic">
                                    "Simulation models margin leakage and predicted cycle time impact."
                                </p>
                            </div>
                        </div>

                        {/* Results Panel */}
                        <div className="lg:col-span-8 space-y-8">
                            <AnimatePresence mode="wait">
                                {isSimulating ? (
                                    <motion.div
                                        key="simulating"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="h-full bg-white rounded-[3rem] border border-google-blue/20 flex flex-col items-center justify-center p-20 shadow-google-glow"
                                    >
                                        <div className="relative mb-8">
                                            <div className="absolute inset-0 bg-google-blue/20 blur-2xl rounded-full animate-pulse" />
                                            <RefreshCcw className="h-16 w-16 text-google-blue animate-spin relative z-10" />
                                        </div>
                                        <h3 className="m3-type-headline-large text-m3-on-surface italic">Simulating...</h3>
                                        <p className="m3-type-body-large text-m3-on-surface-variant mt-2 text-center max-w-sm">
                                            Auditing 1,000 portfolio records against new logic modules.
                                        </p>
                                    </motion.div>
                                ) : showResults ? (
                                    <motion.div
                                        key="results"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="bg-white rounded-3xl p-7 border border-m3-outline-variant shadow-m3-1 hover:shadow-m3-2 transition-all group">
                                                <div className="h-12 w-12 rounded-2xl bg-google-green/10 text-google-green flex items-center justify-center mb-6 shadow-m3-1">
                                                    <TrendingUp className="h-6 w-6" />
                                                </div>
                                                <p className="m3-type-label-large text-m3-on-surface-variant uppercase">Est. ROI Impact</p>
                                                <h3 className={cn(
                                                    "m3-type-headline-large italic mt-1",
                                                    impact.revenueValue >= 0 ? "text-google-green" : "text-google-red"
                                                )}>{impact.revenue}</h3>
                                            </div>
                                            <div className="bg-white rounded-3xl p-7 border border-m3-outline-variant shadow-m3-1 hover:shadow-m3-2 transition-all group">
                                                <div className="h-12 w-12 rounded-2xl bg-google-blue/10 text-google-blue flex items-center justify-center mb-6 shadow-m3-1">
                                                    <Users className="h-6 w-6" />
                                                </div>
                                                <p className="m3-type-label-large text-m3-on-surface-variant uppercase">Ops Efficiency</p>
                                                <h3 className={cn(
                                                    "m3-type-headline-large italic mt-1",
                                                    impact.opsLoadValue <= 0 ? "text-google-green" : "text-google-yellow"
                                                )}>{impact.opsLoad}</h3>
                                            </div>
                                            <div className="bg-white rounded-3xl p-7 border border-m3-outline-variant shadow-m3-1 hover:shadow-m3-2 transition-all group">
                                                <div className="h-12 w-12 rounded-2xl bg-white border border-m3-outline-variant text-m3-on-surface-variant flex items-center justify-center mb-6 shadow-m3-1">
                                                    <AlertTriangle className="h-6 w-6" />
                                                </div>
                                                <p className="m3-type-label-large text-m3-on-surface-variant uppercase">Risk Profile</p>
                                                <h3 className={cn(
                                                    "m3-type-headline-large italic mt-1",
                                                    impact.risk === 'Low' ? "text-google-green" : impact.risk === 'Medium' ? "text-google-yellow" : "text-google-red"
                                                )}>{impact.risk}</h3>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[2.5rem] p-8 border border-m3-outline-variant shadow-m3-1">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="text-xs font-black uppercase tracking-widest text-m3-on-surface flex items-center gap-2">
                                                    <BarChart3 className="h-4 w-4 text-m3-primary" />
                                                    Simulation Details (1,000 Records)
                                                </h3>
                                                <span className="text-[10px] font-bold text-m3-on-surface-variant">Time: {impact.simulationTime}</span>
                                            </div>

                                            <div className="space-y-8">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                        <span>Rule Compliance rate</span>
                                                        <span className="text-emerald-600">{impact.passRate.toFixed(1)}% Pass</span>
                                                    </div>
                                                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${impact.passRate}%` }}
                                                            className="h-full bg-emerald-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-8">
                                                    <div className="p-6 rounded-3xl bg-white border border-m3-outline-variant shadow-m3-1">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-m3-on-surface-variant mb-2">Policy Conflict Detected</h4>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-2 rounded-full bg-google-yellow shadow-m3-1" />
                                                            <p className="text-xs font-bold text-m3-on-surface italic">Overrides with "EMEA Tiered Discount" rule</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-6 rounded-3xl bg-white border border-m3-outline-variant shadow-m3-1">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-m3-on-surface-variant mb-2">Verification Sample</h4>
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="h-3.5 w-3.5 text-google-green" />
                                                            <p className="text-xs font-bold text-m3-on-surface italic">Matches v2.4 Audit Baseline</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button className="w-full h-16 rounded-full bg-google-blue text-white m3-type-label-large uppercase tracking-widest hover:bg-[#176BEF] transition-all shadow-google-glow">
                                                    Promote to Staging Rulebook
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full bg-white rounded-[3rem] border border-m3-outline-variant shadow-m3-1 flex flex-col items-center justify-center p-20 text-center">
                                        <div className="h-20 w-20 rounded-full bg-white border border-m3-outline-variant flex items-center justify-center mb-8 shadow-m3-1">
                                            <RefreshCcw className="h-10 w-10 text-m3-outline" />
                                        </div>
                                        <h3 className="text-xl font-black text-m3-on-surface uppercase tracking-tight">Ready for Modeling</h3>
                                        <p className="text-sm font-bold text-m3-on-surface-variant mt-2 max-w-sm mx-auto leading-relaxed">
                                            Adjust policy variables on the left and run a simulation to see portfolio-wide impact before applying new business rules.
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <PilotGuide />
        </div>
    );
}
