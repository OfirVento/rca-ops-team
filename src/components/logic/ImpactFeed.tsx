"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    FileUp,
    FilePlus,
    FileMinus,
    RotateCcw,
    ChevronRight,
    Target,
    Clock,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeedItem {
    id: string;
    type: 'Deployed' | 'Proposed' | 'Deprecated' | 'Rolled back';
    title: string;
    impactTags: string[];
    why: string;
    date: string;
}

interface ImpactFeedProps {
    items: FeedItem[];
    onViewRuleSet: (id: string) => void;
}

export const ImpactFeed = ({ items, onViewRuleSet }: ImpactFeedProps) => {
    const typeConfigs = {
        'Deployed': { icon: FileUp, container: 'bg-emerald-100 text-emerald-950 shadow-m3-1', iconColor: 'text-emerald-700' },
        'Proposed': { icon: FilePlus, container: 'bg-m3-primary-container text-m3-on-primary-container shadow-m3-1', iconColor: 'text-m3-primary' },
        'Deprecated': { icon: FileMinus, container: 'bg-m3-surface-variant text-m3-on-surface-variant shadow-m3-1', iconColor: 'text-m3-outline' },
        'Rolled back': { icon: RotateCcw, container: 'bg-m3-error-container text-m3-on-error-container shadow-m3-1', iconColor: 'text-m3-error' },
    };

    const getImpactIcon = (tag: string) => {
        if (tag === 'Revenue') return <Zap className="h-3 w-3" />;
        if (tag === 'Cycle Time') return <Clock className="h-3 w-3" />;
        if (tag === 'Compliance') return <Shield className="h-3 w-3" />;
        return <Target className="h-3 w-3" />;
    };

    return (
        <div className="m3-card-elevated p-6 flex flex-col h-full bg-white shadow-m3-1">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="m3-type-label-large font-bold uppercase tracking-[0.2em] text-m3-on-surface-variant mb-1">Change & Impact Feed</h3>
                    <p className="m3-type-headline-large text-m3-primary font-black tracking-tight uppercase leading-none">Last 30 Days</p>
                </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pr-1">
                {items.map((item, idx) => {
                    const config = typeConfigs[item.type];
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-5 m3-card-elevated bg-white border border-m3-outline-variant hover:shadow-m3-2 transition-all group cursor-pointer m3-state-layer overflow-hidden"
                            onClick={() => onViewRuleSet(item.id)}
                        >
                            <div className="flex items-start gap-4 relative z-10">
                                <div className={cn("h-10 w-10 rounded-m3-md flex items-center justify-center shrink-0", config.container)}>
                                    <Icon className={cn("h-5 w-5", config.iconColor)} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={cn("m3-type-label-large font-black uppercase tracking-widest px-2 py-0.5 rounded-full", config.container)}>
                                                {item.type}
                                            </span>
                                            <h4 className="m3-type-label-large font-black text-m3-on-surface uppercase tracking-tight">
                                                {item.title}
                                            </h4>
                                        </div>
                                        <span className="m3-type-label-large font-bold text-m3-on-surface-variant uppercase tracking-tighter shrink-0">{item.date}</span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        {item.impactTags.map(tag => (
                                            <span key={tag} className="flex items-center gap-2 px-2 py-1 bg-m3-surface border border-m3-outline-variant rounded-m3-sm m3-type-label-large font-bold text-m3-on-surface-variant uppercase tracking-tight shadow-m3-1">
                                                {getImpactIcon(tag)} {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="m3-type-label-large font-bold text-m3-on-surface-variant leading-snug mb-3">
                                        <span className="text-[10px] font-black uppercase text-m3-primary mr-2">Agent Why:</span>
                                        {item.why}
                                    </p>

                                    <button
                                        className="m3-type-label-large font-black uppercase tracking-widest text-m3-primary flex items-center gap-2 hover:gap-3 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        Inspect Logic <ChevronRight className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
