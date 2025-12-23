"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    Target,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngine } from '@/context/EngineContext';

interface KPIProps {
    label: string;
    value: string;
    delta: string;
    status: 'Green' | 'Yellow' | 'Red';
    icon: any;
}

function KPICard({ label, value, delta, status, icon: Icon }: KPIProps) {
    const isPositive = delta.startsWith('+');

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="flex-1 rounded-2xl p-6 relative overflow-hidden group bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md"
        >
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{label}</p>
                    <h3 className="text-3xl font-black text-slate-950 tracking-tight italic leading-none">{value}</h3>
                </div>
                <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center border transition-all",
                    status === "Green" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                        status === "Yellow" ? "bg-amber-50 border-amber-100 text-amber-600" :
                            "bg-rose-50 border-rose-100 text-rose-600"
                )}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 relative z-10">
                <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                    status === "Green" ? "bg-emerald-100/50 text-emerald-700" :
                        status === "Yellow" ? "bg-amber-100/50 text-amber-700" :
                            "bg-rose-100/50 text-rose-700"
                )}>
                    {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {delta}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">vs. last 7d</span>
            </div>
        </motion.div>
    );
}

export function KPIStrip() {
    const { kpiMetrics } = useEngine();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard
                label="Attention Needed"
                value={`${kpiMetrics.itemsNeedingAttention} Open`}
                delta="+4"
                status="Red"
                icon={AlertCircle}
            />
            <KPICard
                label="Net Revenue Efficiency"
                value={kpiMetrics.netRevenueEfficiency}
                delta="+2.4%"
                status="Green"
                icon={TrendingUp}
            />
            <KPICard
                label="Revenue At Risk"
                value={kpiMetrics.revenueAtRisk}
                delta="-12%"
                status="Yellow"
                icon={Target}
            />
        </div>
    );
}
