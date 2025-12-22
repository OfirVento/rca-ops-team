"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface UsageChipsProps {
    d7: number | string;
    d30: number | string;
    d90: number | string;
    className?: string;
}

export const UsageChips = ({ d7, d30, d90, className }: UsageChipsProps) => {
    const format = (val: number | string) => {
        if (typeof val === 'number') {
            if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
            return val.toString();
        }
        return val;
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="flex flex-col">
                <span className="m3-type-label-large font-black text-m3-primary uppercase leading-none mb-0.5 scale-75 origin-left tracking-widest">7d</span>
                <span className="m3-type-label-large font-bold text-m3-on-surface leading-none">{format(d7)}</span>
            </div>
            <div className="h-4 w-[1px] bg-m3-outline-variant" />
            <div className="flex flex-col">
                <span className="m3-type-label-large font-black text-m3-primary uppercase leading-none mb-0.5 scale-75 origin-left tracking-widest">30d</span>
                <span className="m3-type-label-large font-bold text-m3-on-surface leading-none">{format(d30)}</span>
            </div>
            <div className="h-4 w-[1px] bg-m3-outline-variant" />
            <div className="flex flex-col">
                <span className="m3-type-label-large font-black text-m3-primary uppercase leading-none mb-0.5 scale-75 origin-left tracking-widest">90d</span>
                <span className="m3-type-label-large font-bold text-m3-on-surface leading-none">{format(d90)}</span>
            </div>
        </div>
    );
};
