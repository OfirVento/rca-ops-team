"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ShoppingCart,
    Layers,
    ShieldCheck,
    PackageCheck,
    Database,
    CreditCard,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngine, LifecycleStage } from '@/context/EngineContext';

const stagesConfig: { name: LifecycleStage; icon: any }[] = [
    { name: 'Catalog', icon: ShoppingCart },
    { name: 'CPQ', icon: Layers },
    { name: 'Contracts', icon: ShieldCheck },
    { name: 'Orders', icon: PackageCheck },
    { name: 'Assets', icon: Database },
    { name: 'Billing', icon: CreditCard },
];

interface LifecycleStepperProps {
    onStageClick?: (stageName: string) => void;
    selectedStage?: LifecycleStage | null;
}

export function LifecycleStepper({ onStageClick, selectedStage }: LifecycleStepperProps) {
    const { stages } = useEngine();

    const handleClick = (e: React.MouseEvent, stageName: string) => {
        if (onStageClick) {
            e.preventDefault();
            onStageClick(stageName);
        }
    };

    return (
        <div className="w-full py-10 px-4">
            <div className="max-w-6xl mx-auto relative">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-m3-outline-variant -translate-y-1/2" />

                <div className="relative flex justify-between">
                    {stagesConfig.map((config, idx) => {
                        const stageData = stages.find(s => s.name === config.name);
                        const Icon = config.icon;
                        const isSelected = selectedStage === config.name;

                        const content = (
                            <>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={cn(
                                        "h-14 w-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 z-10 group-hover:shadow-google-glow group-hover:-translate-y-1",
                                        isSelected
                                            ? "bg-google-blue border-google-blue text-white shadow-google-glow scale-110"
                                            : stageData?.status === 'Healthy' || stageData?.status === 'Stable'
                                                ? "bg-white border-google-green/10 text-google-green shadow-m3-1"
                                                : stageData?.status === 'Critical'
                                                    ? "bg-white border-google-red/20 text-google-red shadow-m3-1"
                                                    : "bg-white border-google-yellow/20 text-google-yellow shadow-m3-1"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />

                                    {/* Status Indicator Dot */}
                                    {!isSelected && (
                                        <div className={cn(
                                            "absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center shadow-m3-1",
                                            stageData?.status === 'Healthy' || stageData?.status === 'Stable'
                                                ? "bg-google-green"
                                                : stageData?.status === 'Critical'
                                                    ? "bg-google-red"
                                                    : "bg-google-yellow"
                                        )}>
                                            {stageData?.status === 'Healthy' && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                                        </div>
                                    )}
                                </motion.div>

                                <div className="mt-4 text-center">
                                    <p className={cn(
                                        "m3-type-label-large group-hover:text-google-blue",
                                        isSelected ? "text-google-blue font-black" : "text-m3-on-surface-variant"
                                    )}>
                                        {config.name}
                                    </p>
                                    <p className={cn(
                                        "text-[10px] font-black uppercase tracking-widest mt-1",
                                        isSelected
                                            ? "text-google-blue"
                                            : stageData?.status === 'Healthy' || stageData?.status === 'Stable'
                                                ? "text-google-green"
                                                : stageData?.status === 'Critical'
                                                    ? "text-google-red"
                                                    : "text-google-yellow"
                                    )}>
                                        {stageData?.health}% Health
                                    </p>
                                </div>
                            </>
                        );

                        if (onStageClick) {
                            return (
                                <button
                                    key={config.name}
                                    onClick={(e) => handleClick(e, config.name)}
                                    className="flex flex-col items-center group cursor-pointer"
                                >
                                    {content}
                                </button>
                            );
                        }

                        return (
                            <Link key={config.name} href={`/stage/${config.name}`} className="flex flex-col items-center group">
                                {content}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
