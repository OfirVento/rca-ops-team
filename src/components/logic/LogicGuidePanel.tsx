"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GuideItem {
    headline: string;
    why: string;
    cta: string;
    onClick: () => void;
}

interface LogicGuidePanelProps {
    items: GuideItem[];
    className?: string;
}

export const LogicGuidePanel = ({ items, className }: LogicGuidePanelProps) => {
    return (
        <section className={cn("m3-card-elevated p-8 relative overflow-hidden bg-white shadow-m3-1", className)}>
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-m3-lg bg-m3-primary flex items-center justify-center shadow-m3-1">
                        <Sparkles className="h-6 w-6 text-m3-on-primary" />
                    </div>
                    <div>
                        <h2 className="m3-type-label-large font-bold uppercase tracking-[0.2em] text-m3-primary mb-0.5">Logic Guide Agent</h2>
                        <p className="m3-type-title-large text-m3-on-surface font-black">Daily Strategic Briefing</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center justify-between p-6 m3-card-elevated group cursor-pointer m3-state-layer overflow-hidden"
                            onClick={item.onClick}
                        >
                            <div className="flex flex-col gap-1 relative z-10">
                                <h3 className="m3-type-label-large font-black text-m3-on-surface uppercase tracking-tight">
                                    {item.headline}
                                </h3>
                                <p className="m3-type-label-large font-bold text-m3-on-surface-variant">
                                    <span className="text-[10px] uppercase tracking-widest text-m3-primary mr-3 font-black">Why:</span>
                                    {item.why}
                                </p>
                            </div>
                            <button className="flex items-center gap-2 m3-type-label-large font-black uppercase tracking-widest text-m3-on-primary-container bg-m3-primary-container group-hover:bg-m3-primary group-hover:text-m3-on-primary transition-all px-5 py-2.5 rounded-full shadow-m3-1 relative z-10">
                                {item.cta} <ChevronRight className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
