"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    DollarSign,
    Clock,
    ShieldAlert,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngine } from '@/context/EngineContext';

interface KPIProps {
    label: string;
    value: string;
    delta?: string;
    isNegative?: boolean;
    icon: any;
    trend: 'up' | 'down' | 'neutral';
    color?: string;
}

function KPICard({ label, value, delta, isNegative, icon: Icon, trend, color }: KPIProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="flex-1 m3-card-elevated bg-white p-6 m3-state-layer overflow-hidden cursor-default hover:shadow-google-glow group transition-all"
        >
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={cn("h-12 w-12 rounded-m3-lg flex items-center justify-center shadow-m3-1", color || "bg-m3-secondary-container text-m3-on-secondary-container")}>
                    <Icon className="h-6 w-6" />
                </div>
                {delta && (
                    <div className={cn(
                        "flex items-center gap-1 px-3 py-1 rounded-full m3-type-label-large shadow-m3-1",
                        trend === 'up' ? (isNegative ? "bg-google-red text-white" : "bg-google-green text-white") :
                            (isNegative ? "bg-google-green text-white" : "bg-google-red text-white")
                    )}>
                        {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {delta}
                    </div>
                )}
            </div>

            <div className="space-y-1 relative z-10">
                <p className="m3-type-label-large text-m3-on-surface-variant uppercase tracking-widest">{label}</p>
                <h3 className="m3-type-headline-large text-m3-on-surface italic">{value}</h3>
            </div>
        </motion.div>
    );
}

export function KPIStrip() {
    const { kpiMetrics } = useEngine();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            <KPICard
                label="Attention Needed"
                value={`${kpiMetrics.itemsNeedingAttention} Open`}
                delta="+4"
                isNegative={true}
                icon={AlertCircle}
                trend="up"
                color="bg-google-red/10 text-google-red"
            />
            <KPICard
                label="Revenue At Risk"
                value={kpiMetrics.revenueAtRisk}
                delta="-12%"
                isNegative={true}
                icon={DollarSign}
                trend="down"
                color="bg-google-green/10 text-google-green"
            />
            <KPICard
                label="Cycle Time Hotspots"
                value={kpiMetrics.cycleTimeHotspots}
                delta="-0.3d"
                icon={Clock}
                trend="down"
                color="bg-google-blue/10 text-google-blue"
            />
            <KPICard
                label="Billing / Collection Risk"
                value={kpiMetrics.billingRisk}
                delta="+2.1k"
                isNegative={true}
                icon={ShieldAlert}
                trend="up"
                color="bg-google-yellow/10 text-google-yellow"
            />
        </div>
    );
}
