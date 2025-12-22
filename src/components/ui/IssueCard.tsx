"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowRight,
    MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Issue } from '@/context/EngineContext';

interface IssueCardProps {
    issue: Issue;
    className?: string;
    onPreviewFix?: () => void;
}

export function IssueCard({ issue, className, onPreviewFix }: IssueCardProps) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={cn(
                "m3-card-elevated bg-white shadow-m3-1 p-6 m3-state-layer overflow-hidden cursor-default",
                className
            )}
        >
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-12 w-12 rounded-m3-md flex items-center justify-center shadow-m3-1",
                        issue.severity === 'Critical' ? "bg-google-red text-white" :
                            issue.severity === 'High' ? "bg-google-blue text-white" : "bg-google-yellow text-black"
                    )}>
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="m3-type-title-large text-m3-on-surface leading-tight">{issue.title}</h4>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className="m3-type-label-large text-m3-on-surface-variant font-bold uppercase tracking-widest">{issue.stage}</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-m3-outline-variant" />
                            <span className="m3-type-label-large text-google-blue font-black uppercase tracking-widest">Agent: {issue.owner}</span>
                        </div>
                    </div>
                </div>
                <div className={cn(
                    "px-4 py-1.5 rounded-full m3-type-label-large font-black uppercase tracking-widest shadow-m3-1",
                    issue.status === 'FixProposed' ? "bg-m3-primary-container text-m3-on-primary-container" : "bg-m3-surface-variant text-m3-on-surface-variant"
                )}>
                    {issue.status === 'FixProposed' ? 'Fix Ready' : issue.status}
                </div>
            </div>

            <p className="m3-type-label-large font-bold text-m3-on-surface-variant leading-relaxed mb-6 relative z-10 italic">
                "{issue.description}"
            </p>

            <div className="bg-google-blue/[0.03] p-5 mb-6 relative z-10 border border-google-blue/10 rounded-m3-lg group/insight">
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-google-blue shadow-google-glow" />
                    <span className="m3-type-label-large text-google-blue uppercase tracking-widest">Root Cause Identified</span>
                </div>
                <p className="m3-type-body-large text-m3-on-surface leading-snug font-bold">
                    {issue.rootCause}
                </p>
            </div>

            <div className="flex items-center justify-between pt-2 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="flex flex-col">
                        <span className="m3-type-label-large font-bold text-m3-on-surface-variant uppercase tracking-widest">ARR Risk</span>
                        <span className="m3-type-label-large font-black text-m3-on-surface">{issue.impact}</span>
                    </div>
                    <div className="h-8 w-[1px] bg-m3-outline-variant" />
                    <div className="flex flex-col">
                        <span className="m3-type-label-large font-bold text-m3-on-surface-variant uppercase tracking-widest">Records</span>
                        <span className="m3-type-label-large font-black text-m3-on-surface">19 affected</span>
                    </div>
                </div>

                <button
                    onClick={onPreviewFix}
                    className="h-12 px-6 rounded-full bg-google-blue text-white m3-type-label-large font-black uppercase tracking-widest hover:bg-[#176BEF] transition-all flex items-center gap-3 shadow-m3-1"
                >
                    Preview Fix <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
}
