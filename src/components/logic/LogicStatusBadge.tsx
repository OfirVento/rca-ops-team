"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { RuleStatus } from '@/context/EngineContext';

interface LogicStatusBadgeProps {
    status: RuleStatus;
    className?: string;
}

export const LogicStatusBadge = ({ status, className }: LogicStatusBadgeProps) => {
    const styles = {
        ACTIVE: "bg-emerald-100 text-emerald-950 border-emerald-500/20 shadow-m3-1",
        PROPOSED: "bg-m3-primary-container text-m3-on-primary-container border-m3-primary/20 shadow-m3-1",
        LEGACY: "bg-amber-100 text-amber-950 border-amber-500/20 shadow-m3-1",
        DORMANT: "bg-m3-surface-variant text-m3-on-surface-variant border-m3-outline-variant shadow-m3-1",
        DEPRECATED: "bg-m3-outline-variant text-m3-on-surface-variant/70 border-m3-outline shadow-m3-1",
    };

    return (
        <span className={cn(
            "px-2.5 py-1 rounded-full m3-type-label-large font-black uppercase tracking-[0.1em] border transition-all",
            styles[status],
            className
        )}>
            {status}
        </span>
    );
};
