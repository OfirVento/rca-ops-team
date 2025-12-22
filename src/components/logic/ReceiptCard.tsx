"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ChevronRight,
    ArrowRight,
    Database,
    Activity,
    Hash,
    ExternalLink,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngine, EvaluationLog } from '@/context/EngineContext';

interface ReceiptCardProps {
    logId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const ReceiptCard = ({ logId, isOpen, onClose }: ReceiptCardProps) => {
    const { evalLogs, ruleSets, rules } = useEngine();
    const log = evalLogs.find(l => l.id === logId);

    if (!log) return null;

    const ruleSet = ruleSets.find(rs => rs.id === log.ruleSetId);
    const rule = rules.find(r => r.id === log.ruleId);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[80]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 m-auto w-[520px] h-fit max-h-[90vh] bg-m3-surface rounded-m3-xl shadow-m3-3 z-[90] overflow-hidden flex flex-col border border-m3-outline-variant"
                    >
                        {/* Header */}
                        <div className="p-8 bg-google-blue text-white relative shadow-m3-1">
                            <button onClick={onClose} className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 m3-state-layer flex items-center justify-center transition-colors">
                                <X className="h-5 w-5 text-white/70" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-white text-google-blue m3-type-label-large font-black uppercase tracking-widest shadow-m3-1">Logic Receipt</span>
                                <span className="m3-type-label-large font-bold text-white/80 uppercase tracking-widest">{log.versionId} · VERIFIED</span>
                            </div>

                            <h2 className="m3-type-headline-large font-black tracking-tight uppercase leading-none italic">
                                {rule?.name || 'Rule Execution'}
                            </h2>
                            <p className="m3-type-label-large font-bold text-m3-on-primary/70 uppercase tracking-widest mt-2">
                                Record: <span className="text-white underline decoration-white/40 decoration-2 underline-offset-4 cursor-pointer">{log.recordName}</span>
                            </p>
                        </div>

                        <div className="p-8 overflow-y-auto no-scrollbar bg-m3-surface">
                            <div className="space-y-8">
                                {/* 1) Inputs */}
                                <div>
                                    <h3 className="m3-type-label-large font-black uppercase tracking-widest text-m3-on-surface-variant flex items-center gap-3 mb-5 px-1">
                                        <Database className="h-4 w-4" /> Execution Snapshot
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(log.inputs).map(([k, v]) => (
                                            <div key={k} className="p-4 m3-card-elevated bg-white border border-m3-outline-variant shadow-m3-1">
                                                <p className="m3-type-label-large font-bold text-google-blue uppercase tracking-widest mb-1 opacity-70">{k}</p>
                                                <p className="m3-type-body-large font-black text-m3-on-surface truncate tracking-tight">{v}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2) Decision */}
                                <div>
                                    <h3 className="m3-type-label-large font-black uppercase tracking-widest text-m3-on-surface-variant flex items-center gap-3 mb-5 px-1">
                                        <Activity className="h-4 w-4" /> Logic Decision
                                    </h3>
                                    <div className="p-6 bg-google-blue text-white border border-google-blue rounded-m3-lg relative overflow-hidden shadow-m3-2">
                                        <div className="absolute top-0 right-0 p-6 opacity-10">
                                            <Zap className="h-16 w-16 text-white" />
                                        </div>
                                        <p className="m3-type-headline-large font-black text-white uppercase italic tracking-tight mb-3">"{log.reason}"</p>
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full m3-type-label-large font-black uppercase tracking-widest shadow-m3-1",
                                                log.outcome === 'Pass' ? "bg-google-green text-white" : "bg-google-yellow text-white"
                                            )}>
                                                Outcome: {log.outcome}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 3) Outputs */}
                                <div>
                                    <h3 className="m3-type-label-large font-black uppercase tracking-widest text-m3-on-surface-variant flex items-center gap-3 mb-5 px-1">
                                        <ArrowRight className="h-4 w-4" /> System Overrides
                                    </h3>
                                    <div className="space-y-3">
                                        {Object.entries(log.outputs).map(([k, v]) => (
                                            <div key={k} className="flex items-center justify-between p-5 m3-card-elevated bg-white border border-m3-outline-variant shadow-m3-1">
                                                <span className="m3-type-label-large font-bold text-m3-on-surface-variant uppercase tracking-widest">{k}</span>
                                                <span className="m3-type-label-large font-black text-google-blue italic uppercase tracking-tight">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 pt-0 flex gap-4 bg-m3-surface">
                            {log.issueId && (
                                <button className="flex-1 py-4 bg-google-blue text-white rounded-full m3-type-label-large font-black uppercase tracking-widest hover:bg-[#176BEF] transition-all flex items-center justify-center gap-3 shadow-m3-2 m3-state-layer overflow-hidden">
                                    Linked Issue <ChevronRight className="h-4 w-4" />
                                </button>
                            )}
                            <button className="px-6 py-4 bg-m3-surface border border-m3-outline-variant rounded-full m3-type-label-large font-black uppercase tracking-widest text-m3-on-surface hover:bg-m3-surface-variant transition-all flex items-center gap-3 shadow-m3-1 m3-state-layer overflow-hidden">
                                <ExternalLink className="h-4 w-4 text-google-blue" /> View Source
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
