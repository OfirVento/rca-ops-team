"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { LifecycleStage } from '@/context/EngineContext';
import { ArrowRight, Info } from 'lucide-react';

interface UsageMapProps {
    data: Array<{
        stage: LifecycleStage;
        now: number;
        trending: number;
        legacy: number;
    }>;
    onCellClick: (stage: LifecycleStage, column: 'NOW' | 'TRENDING' | 'LEGACY') => void;
}

export const UsageMap = ({ data, onCellClick }: UsageMapProps) => {
    return (
        <div className="m3-card-elevated overflow-hidden bg-white shadow-m3-1">
            <div className="p-6 border-b border-m3-outline-variant flex items-center justify-between">
                <div>
                    <h3 className="m3-type-label-large font-bold uppercase tracking-[0.2em] text-m3-on-surface-variant mb-1">90-Day Usage Map</h3>
                    <p className="m3-type-headline-large text-m3-primary font-black tracking-tight uppercase leading-none">Observability Matrix</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-m3-1" />
                        <span className="m3-type-label-large font-bold text-m3-on-surface-variant">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-m3-primary shadow-m3-1" />
                        <span className="m3-type-label-large font-bold text-m3-on-surface-variant">Trending</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500 shadow-m3-1" />
                        <span className="m3-type-label-large font-bold text-m3-on-surface-variant">Legacy</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 bg-white">
                <div className="p-4 border-r border-m3-outline-variant border-b border-m3-outline-variant bg-white" />
                <div className="p-4 border-r border-m3-outline-variant border-b border-m3-outline-variant flex flex-col items-center justify-center bg-white">
                    <span className="m3-type-label-large font-black uppercase tracking-widest text-m3-on-surface-variant">NOW</span>
                    <span className="text-[8px] font-black text-m3-primary uppercase">Active (Prod)</span>
                </div>
                <div className="p-4 border-r border-m3-outline-variant border-b border-m3-outline-variant flex flex-col items-center justify-center bg-white">
                    <span className="m3-type-label-large font-black uppercase tracking-widest text-m3-on-surface-variant">TRENDING</span>
                    <span className="text-[8px] font-black text-m3-primary uppercase">Violations ↑</span>
                </div>
                <div className="p-4 border-b border-m3-outline-variant flex flex-col items-center justify-center bg-white">
                    <span className="m3-type-label-large font-black uppercase tracking-widest text-m3-on-surface-variant">LEGACY</span>
                    <span className="text-[8px] font-black text-m3-primary uppercase">Awaiting Retire</span>
                </div>

                {data.map((row) => (
                    <React.Fragment key={row.stage}>
                        <div className="p-5 border-r border-m3-outline-variant border-b border-m3-outline-variant m3-type-label-large font-black text-m3-on-surface tracking-tight uppercase flex items-center justify-between group bg-m3-surface m3-state-layer overflow-hidden cursor-default">
                            {row.stage}
                            <ArrowRight className="h-4 w-4 text-m3-outline group-hover:text-m3-primary transition-all opacity-0 group-hover:opacity-100" />
                        </div>
                        <div
                            className="p-3 border-r border-m3-outline-variant border-b border-m3-outline-variant bg-m3-surface hover:bg-emerald-50/50 transition-all cursor-pointer group flex items-center justify-center m3-state-layer overflow-hidden"
                            onClick={() => onCellClick(row.stage, 'NOW')}
                        >
                            <div className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-950 m3-type-label-large font-black uppercase tracking-tight shadow-m3-1 group-hover:bg-emerald-200 transition-colors relative z-10">
                                {row.now} Active
                            </div>
                        </div>
                        <div
                            className="p-3 border-r border-m3-outline-variant border-b border-m3-outline-variant bg-m3-surface hover:bg-m3-primary-container/30 transition-all cursor-pointer group flex items-center justify-center m3-state-layer overflow-hidden"
                            onClick={() => onCellClick(row.stage, 'TRENDING')}
                        >
                            <div className="px-4 py-1.5 rounded-full bg-m3-primary-container text-m3-on-primary-container m3-type-label-large font-black uppercase tracking-tight shadow-m3-1 group-hover:bg-m3-primary group-hover:text-m3-on-primary transition-colors relative z-10">
                                {row.trending} Rising
                            </div>
                        </div>
                        <div
                            className="p-3 border-b border-m3-outline-variant bg-m3-surface hover:bg-amber-100/50 transition-all cursor-pointer group flex items-center justify-center m3-state-layer overflow-hidden"
                            onClick={() => onCellClick(row.stage, 'LEGACY')}
                        >
                            <div className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-950 m3-type-label-large font-black uppercase tracking-tight shadow-m3-1 group-hover:bg-amber-200 transition-colors relative z-10">
                                {row.legacy} Legacy
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>

            <div className="p-4 bg-white border-t border-m3-outline-variant flex items-center gap-3">
                <Info className="h-4 w-4 text-google-blue" />
                <p className="m3-type-label-large text-m3-on-surface-variant font-medium">
                    <span className="text-google-blue uppercase tracking-widest mr-2 font-black">Agent Tip:</span>
                    Drill into specific performance clusters by clicking any cell in the matrix.
                </p>
            </div>
        </div>
    );
};
