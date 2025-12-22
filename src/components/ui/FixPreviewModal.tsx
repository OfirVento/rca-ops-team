"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    CheckCircle2,
    ArrowRight,
    AlertCircle,
    Database,
    History,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Issue } from '@/context/EngineContext';

interface FixPreviewModalProps {
    issue: Issue | null;
    isOpen: boolean;
    onClose: () => void;
    onApply: () => void;
}

export function FixPreviewModal({ issue, isOpen, onClose, onApply }: FixPreviewModalProps) {
    if (!issue) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="px-8 pt-8 pb-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">Recommended Fix</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{issue.stage} Integration</span>
                                        <span className="h-1 w-1 rounded-full bg-primary" />
                                        <span className="text-[10px] font-black text-primary uppercase">Risk Mitigated: {issue.impact}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X className="h-5 w-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Analysis */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    Agent Reasoning
                                </h4>
                                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 font-semibold text-sm text-slate-600 leading-relaxed italic">
                                    "{issue.rootCause}. Applying this fix will align the contract terms with the Billing engine, preventing the downstream proration error."
                                </div>
                            </div>

                            {/* Data Diff */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Database className="h-3.5 w-3.5" />
                                    Proposed Data Alignment (Preview)
                                </h4>
                                <div className="rounded-3xl border border-slate-100 overflow-hidden text-xs">
                                    <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-100 px-6 py-3 font-bold text-slate-400 uppercase tracking-tighter">
                                        <span>Current Value</span>
                                        <span>Corrected Value</span>
                                    </div>
                                    <div className="grid grid-cols-2 px-6 py-5 gap-8 items-center">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-slate-400 uppercase">Payment Terms</span>
                                            <p className="font-bold text-rose-500 line-through">Net 60 (Manual Override)</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-slate-400 uppercase">Payment Terms</span>
                                            <p className="font-bold text-emerald-600 flex items-center gap-2">
                                                Due-on-Receipt <CheckCircle2 className="h-3 w-3" />
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 px-6 py-5 gap-8 items-center bg-slate-50/50">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-slate-400 uppercase">Automation Lock</span>
                                            <p className="font-bold text-slate-400 italic">Off</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-slate-400 uppercase">Automation Lock</span>
                                            <p className="font-bold text-primary flex items-center gap-2 font-mono">
                                                Active (Rule #4102)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Show Your Work */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <History className="h-3.5 w-3.5" />
                                    Audit Trail (Pre-Generated)
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                                        <span className="text-[11px] font-bold text-slate-500">Scan baseline telemetry from Segment B...</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                                        <span className="text-[11px] font-bold text-slate-500">Identified Net 60 override as root cause...</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        <span className="text-[11px] font-black text-slate-900">Validating fix against EMEA Rulebook v4...</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <div className="flex items-center gap-2 text-slate-400">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase tracking-tight">Affecting 19 related objects</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onApply}
                                    className="px-8 py-4 rounded-2xl bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200 group"
                                >
                                    Apply Fix Everywhere <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
