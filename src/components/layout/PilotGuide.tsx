"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    BrainCircuit,
    Target,
    Zap,
    Send,
    ChevronRight,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngine } from '@/context/EngineContext';

export function PilotGuide() {
    const { agents, topInsights } = useEngine();
    const [activeTab, setActiveTab] = React.useState<'Insights' | 'Agents'>('Insights');

    return (
        <div className="w-[320px] h-full flex flex-col bg-m3-surface border-l border-m3-outline-variant relative overflow-hidden">
            {/* Header */}
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-m3-primary-container flex items-center justify-center text-m3-on-primary-container">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="m3-type-title-large text-m3-on-surface italic">Pilot Guide</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="h-2 w-2 rounded-full bg-google-green animate-pulse shadow-google-glow" />
                            <span className="m3-type-label-large text-google-green uppercase tracking-widest">Active Scan</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Segmented Control (Tabs) */}
            <div className="px-6 pb-4">
                <div className="flex bg-white rounded-full p-1 border border-m3-outline-variant shadow-m3-1">
                    {['Insights', 'Agents'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "flex-1 py-2 rounded-full m3-type-label-large font-bold uppercase tracking-widest transition-all m3-state-layer overflow-hidden",
                                activeTab === tab
                                    ? "bg-google-blue text-white shadow-m3-1"
                                    : "text-m3-on-surface-variant hover:text-m3-on-surface"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32 no-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === 'Insights' ? (
                        <motion.div
                            key="insights"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Proactive Insight */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-m3-primary" />
                                    <span className="m3-type-label-large font-bold uppercase tracking-widest text-m3-on-surface-variant">Priority Insight</span>
                                </div>
                                {topInsights.map((insight, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={cn(
                                            "p-6 rounded-m3-xl group relative overflow-hidden transition-all",
                                            i === 0
                                                ? "bg-google-blue text-white shadow-google-glow scale-[1.02]"
                                                : "m3-card-elevated bg-white shadow-m3-1 hover:shadow-m3-2"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity",
                                            i === 0 ? "text-white" : "text-google-blue"
                                        )}>
                                            <Zap className="h-16 w-16" />
                                        </div>
                                        <p className={cn(
                                            "m3-type-title-large relative z-10 mb-4 leading-tight italic",
                                            i === 0 ? "text-white" : "text-m3-on-surface"
                                        )}>
                                            "{insight}"
                                        </p>
                                        <button className={cn(
                                            "flex items-center gap-2 m3-type-label-large uppercase tracking-widest transition-all group-hover:gap-3",
                                            i === 0 ? "text-white/80 hover:text-white" : "text-google-blue hover:text-google-blue/80"
                                        )}>
                                            {i === 0 ? "Execute Strategy" : "Inspect Cause"} <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            {/* System Status */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-m3-on-surface-variant" />
                                    <span className="m3-type-label-large font-bold uppercase tracking-widest text-m3-on-surface-variant">Cohesion Monitor</span>
                                </div>
                                <div className="m3-card-elevated bg-white p-6 shadow-m3-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="m3-type-label-large text-google-green uppercase">Cohesion 98.2%</span>
                                    </div>
                                    <div className="h-2 w-full bg-m3-on-surface-variant/10 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: '98.2%' }}
                                            className="h-full bg-google-green rounded-full shadow-google-glow"
                                        />
                                    </div>
                                    <p className="mt-4 m3-type-label-large text-m3-on-surface-variant font-medium">
                                        All specialists are synchronized with latest Catalog metadata.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="agents"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            {agents.map((agent) => (
                                <div key={agent.id} className="m3-card-elevated bg-white p-5 hover:shadow-m3-2 transition-all m3-state-layer overflow-hidden cursor-default shadow-m3-1">
                                    <div className="flex items-center justify-between mb-3 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-m3-primary" />
                                            <span className="m3-type-label-large font-black text-m3-on-surface uppercase tracking-tight leading-none">{agent.name}</span>
                                        </div>
                                        <span className={cn(
                                            "m3-type-label-large font-black uppercase px-2 py-0.5 rounded-full",
                                            agent.status === 'Idle'
                                                ? "bg-m3-outline-variant text-m3-on-surface-variant"
                                                : "bg-google-blue/10 text-google-blue"
                                        )}>
                                            {agent.status}
                                        </span>
                                    </div>
                                    <p className="m3-type-label-large font-bold text-m3-on-surface-variant italic leading-relaxed relative z-10">
                                        "{agent.reasoning}"
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* M3 Search Bar Style Command Pilot */}
            <div className="absolute bottom-10 left-6 right-6 z-20">
                <div className="bg-white rounded-full p-2.5 border border-m3-outline-variant shadow-m3-3 flex items-center gap-2 group transition-all hover:shadow-google-glow hover:-translate-y-1">
                    <div className="h-11 w-11 rounded-full bg-google-blue flex items-center justify-center text-white shrink-0 shadow-m3-1">
                        <BrainCircuit className="h-5 w-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Command Pilot..."
                        className="bg-transparent text-m3-on-surface m3-type-label-large focus:outline-none flex-1 px-2 placeholder:text-m3-on-surface-variant/40"
                    />
                    <button className="h-11 px-6 rounded-full bg-google-blue text-white m3-type-label-large uppercase tracking-widest hover:bg-[#176BEF] shadow-m3-1 transition-all">
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
