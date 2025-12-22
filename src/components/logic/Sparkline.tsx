"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SparklineProps {
    data: number[];
    color?: string;
    className?: string;
    height?: number;
}

export const Sparkline = ({ data, color = "#4f46e5", className, height = 30 }: SparklineProps) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 100 ${height}`} className={cn("w-full h-auto overflow-visible", className)} preserveAspectRatio="none">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
};
