"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    CheckCircle2,
    FileWarning,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthTileProps {
    label: string;
    value: string | number;
    icon: any;
    container: string;
    iconColor: string;
    idx: number;
    onClick?: () => void;
}

const HealthTile = ({ label, value, icon: Icon, container, iconColor, idx, onClick }: HealthTileProps) => (
    <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
        onClick={onClick}
        className="m3-card-elevated p-5 flex items-center gap-4 hover:shadow-m3-2 transition-all group flex-1 m3-state-layer overflow-hidden bg-white shadow-m3-1"
    >
        <div className={cn("h-12 w-12 rounded-m3-md flex items-center justify-center shrink-0 relative z-10", container)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        <div className="text-left relative z-10">
            <p className="m3-type-label-large font-black uppercase tracking-[0.2em] text-m3-on-surface-variant group-hover:text-m3-primary transition-colors">{label}</p>
            <p className="m3-type-headline-large font-black tracking-tighter text-m3-on-surface group-hover:scale-110 group-hover:origin-left transition-transform mt-1">{value}</p>
        </div>
    </motion.button>
);

interface LogicHealthStripProps {
    stats: {
        rulesInProd: number;
        testsPassing: string;
        pendingApprovals: number;
        driftAlerts: number;
    };
    onTileClick: (label: string) => void;
}

export const LogicHealthStrip = ({ stats, onTileClick }: LogicHealthStripProps) => {
    return (
        <div className="flex gap-4 w-full">
            <HealthTile
                label="Rules in Prod"
                value={stats.rulesInProd}
                icon={Activity}
                container="bg-google-green/10 shadow-m3-1"
                iconColor="text-google-green"
                idx={0}
                onClick={() => onTileClick('ACTIVE')}
            />
            <HealthTile
                label="Tests Passing"
                value={stats.testsPassing}
                icon={CheckCircle2}
                container="bg-google-blue/10 shadow-m3-1"
                iconColor="text-google-blue"
                idx={1}
                onClick={() => onTileClick('TESTS')}
            />
            <HealthTile
                label="Pending Approvals"
                value={stats.pendingApprovals}
                icon={FileWarning}
                container="bg-google-yellow/10 shadow-m3-1"
                iconColor="text-google-yellow"
                idx={2}
                onClick={() => onTileClick('PROPOSED')}
            />
            <HealthTile
                label="Drift Alerts"
                value={stats.driftAlerts}
                icon={AlertCircle}
                container="bg-google-red/10 shadow-m3-1"
                iconColor="text-google-red"
                idx={3}
                onClick={() => onTileClick('TRENDING')}
            />
        </div>
    );
};
