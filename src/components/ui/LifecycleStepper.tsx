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

export function LifecycleStepper() {
    const { stages } = useEngine();

    return (
        <div className="w-full py-10 px-4">
            <div className="max-w-6xl mx-auto relative">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-m3-outline-variant -translate-y-1/2" />

                <div className="relative flex justify-between">
                    {stagesConfig.map((config, idx) => {
                        const stageData = stages.find(s => s.name === config.name);
                        const Icon = config.icon;

                        return (
                            <Link key={config.name} href={`/stage/${config.name}`} className="flex flex-col items-center group">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={cn(
                                        "h-14 w-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 z-10 group-hover:shadow-google-glow group-hover:-translate-y-1",
                                        stageData?.status === 'Healthy' || stageData?.status === 'Stable'
                                            ? "bg-white border-google-green/10 text-google-green shadow-m3-1"
                                            : "bg-white border-google-yellow/20 text-google-yellow shadow-m3-1"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />

                                    {/* Status Indicator Dot */}
                                    <div className={cn(
                                        "absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center shadow-m3-1",
                                        stageData?.status === 'Healthy' || stageData?.status === 'Stable'
                                            ? "bg-google-green"
                                            : "bg-google-yellow"
                                    )}>
                                        {stageData?.status === 'Healthy' && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                                    </div>
                                </motion.div>

                                <div className="mt-4 text-center">
                                    <p className="m3-type-label-large text-m3-on-surface-variant group-hover:text-google-blue">
                                        {config.name}
                                    </p>
                                    <p className={cn(
                                        "text-[10px] font-black uppercase tracking-widest mt-1",
                                        stageData?.status === 'Healthy' || stageData?.status === 'Stable'
                                            ? "text-google-green"
                                            : "text-google-yellow"
                                    )}>
                                        {stageData?.health}% Health
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
