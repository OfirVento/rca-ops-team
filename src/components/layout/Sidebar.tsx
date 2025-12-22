"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Inbox,
    Zap,
    FileText,
    Settings,
    BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Control Tower', href: '/', icon: LayoutDashboard },
    { name: 'Issues Inbox', href: '/work-queue', icon: Inbox },
    { name: 'Optimization Lab', href: '/lab', icon: Zap },
    { name: 'Logic Control', href: '/rules', icon: FileText },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-[280px] flex-col bg-white text-m3-on-surface border-r border-m3-outline-variant">
            {/* Header */}
            <div className="flex h-20 items-center px-6">
                <div className="flex items-center gap-3">
                    <div className="grid grid-cols-2 gap-0.5 h-10 w-10 shrink-0 p-1 bg-white shadow-m3-1 rounded-m3-md border border-m3-outline-variant">
                        <div className="bg-google-blue rounded-tl-[2px]" />
                        <div className="bg-google-red rounded-tr-[2px]" />
                        <div className="bg-google-yellow rounded-bl-[2px]" />
                        <div className="bg-google-green rounded-br-[2px]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="m3-type-label-large font-black text-m3-on-surface uppercase tracking-tight">RCA OPS</span>
                    </div>
                </div>
            </div>

            {/* Navigation Drawer Content */}
            <nav className="flex-1 space-y-1 px-3 py-6">
                <div className="px-4 mb-4">
                    <p className="m3-type-label-large text-m3-on-surface-variant uppercase tracking-widest font-bold">Main Menu</p>
                </div>
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-full px-5 py-3.5 m3-type-label-large transition-all duration-300 m3-state-layer overflow-hidden",
                                isActive
                                    ? "bg-google-blue text-white shadow-google-glow scale-[1.02]"
                                    : "text-m3-on-surface hover:bg-m3-surface-container-high"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                                isActive ? "text-white" : "text-m3-on-surface-variant group-hover:text-google-blue"
                            )} />
                            <span className="font-semibold uppercase tracking-tight">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* System State Tonal Container */}
            <div className="px-4 mb-8">
                <div className="m3-card-elevated bg-white p-6 text-m3-on-surface space-y-4 shadow-m3-1 hover:shadow-m3-2 group transition-all">
                    <div className="flex items-center justify-between">
                        <span className="m3-type-label-large text-google-blue uppercase tracking-widest font-black">System State</span>
                        <div className="h-2 w-2 rounded-full bg-google-green animate-pulse shadow-google-glow" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                            <span>CPU LOAD</span>
                            <span>1.2%</span>
                        </div>
                        <div className="h-1.5 w-full bg-m3-on-secondary-container/10 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: ['12%', '15%', '13%'] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="h-full bg-m3-secondary"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-m3-outline-variant">
                <div className="rounded-full bg-m3-surface-variant p-2 group cursor-pointer hover:shadow-m3-1 transition-all flex items-center gap-3">
                    <div className="relative shrink-0">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 border-2 border-m3-surface-variant animate-pulse" />
                        <div className="h-10 w-10 rounded-full bg-m3-primary text-m3-on-primary flex items-center justify-center text-xs font-black">
                            JD
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="m3-type-label-large font-black text-m3-on-surface truncate">Josh Doering</p>
                        <p className="text-[10px] text-m3-on-surface-variant font-bold uppercase tracking-tight">Ops Strategy</p>
                    </div>
                    <Settings className="h-4 w-4 text-m3-on-surface-variant group-hover:rotate-90 transition-transform mr-2" />
                </div>
            </div>
        </div>
    );
}
