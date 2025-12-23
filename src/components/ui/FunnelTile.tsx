"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StageData } from '@/context/EngineContext';

interface FunnelTileProps {
    stage: StageData;
    metrics: { label: string; value: number }[];
    idx: number;
}

export function FunnelTile({ stage, metrics, idx }: FunnelTileProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl p-6 flex flex-col group h-full overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-google-blue/20 transition-all relative"
        >
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2.5">
                    <div className={cn(
                        "h-2 w-2 rounded-full",
                        stage.status === 'Healthy' || stage.status === 'Stable'
                            ? "bg-google-green shadow-[0_0_8px_rgba(52,168,83,0.4)]"
                            : stage.status === 'Critical'
                                ? "bg-google-red animate-pulse shadow-[0_0_8px_rgba(234,67,53,0.4)]"
                                : "bg-google-yellow animate-pulse shadow-[0_0_8px_rgba(251,188,4,0.4)]"
                    )} />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">{stage.name}</h3>
                </div>
            </div>

            <div className="flex-1 space-y-2.5 relative z-10">
                {metrics.map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between group/item">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{metric.label}</span>
                        <span className="text-sm font-black text-slate-900 tracking-tight">{metric.value}</span>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Health Index</p>
                    <p className={cn(
                        "text-3xl font-black italic tracking-tighter leading-none",
                        stage.status === 'Healthy' || stage.status === 'Stable'
                            ? "text-google-green"
                            : stage.status === 'Critical'
                                ? "text-google-red"
                                : "text-google-yellow"
                    )}>{stage.health}%</p>
                </div>

                <Link
                    href={`/stage/${stage.name}`}
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 group-hover:bg-google-blue group-hover:text-white group-hover:border-google-blue transition-all shadow-sm shadow-slate-100 group-hover:scale-110"
                >
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        </motion.div>
    );
}
