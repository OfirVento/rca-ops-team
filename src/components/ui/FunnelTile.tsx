"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Activity } from 'lucide-react';
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
            className="m3-card-elevated p-6 flex flex-col group h-full m3-state-layer overflow-hidden cursor-default bg-white shadow-m3-1 hover:shadow-google-glow transition-all"
        >
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-2.5 w-2.5 rounded-full shadow-google-glow",
                        stage.status === 'Healthy' || stage.status === 'Stable' ? "bg-google-green" : "bg-google-yellow animate-pulse"
                    )} />
                    <h3 className="m3-type-label-large text-m3-on-surface-variant uppercase tracking-widest">{stage.name}</h3>
                </div>
                <Link href={`/stage/${stage.name}`} className="m3-type-label-large text-google-blue hover:underline transition-all flex items-center gap-1 cursor-pointer">
                    Details <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="flex-1 space-y-4 relative z-10">
                {metrics.map((metric, i) => (
                    <div key={metric.label} className="flex items-center justify-between">
                        <span className="m3-type-label-large font-bold text-m3-on-surface-variant uppercase tracking-tight">{metric.label}</span>
                        <span className="m3-type-label-large font-black text-m3-on-surface">{metric.value}</span>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-m3-outline-variant flex items-center justify-between relative z-10">
                <div className="space-y-1">
                    <p className="m3-type-label-large text-m3-on-surface-variant uppercase">Health Index</p>
                    <p className={cn(
                        "m3-type-title-large italic",
                        stage.health > 90 ? "text-google-green" : stage.health > 80 ? "text-google-blue" : "text-google-yellow"
                    )}>{stage.health}%</p>
                </div>
                <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-google-blue/10 group-hover:bg-google-blue transition-all shadow-m3-1">
                    <Activity className={cn(
                        "h-5 w-5",
                        stage.health > 80 ? "text-google-blue group-hover:text-white" : "text-google-yellow group-hover:text-white"
                    )} />
                </div>
            </div>
        </motion.div>
    );
}
