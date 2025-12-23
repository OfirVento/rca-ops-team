"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Inbox,
    Zap,
    FileText,
    Settings,
    BrainCircuit,
    ChevronRight
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
        <div className="flex h-screen w-64 flex-col bg-slate-50 border-r border-slate-200 shadow-sm">
            {/* Header */}
            <div className="flex h-20 items-center px-6 bg-white border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-google-blue/10 border border-google-blue/20 shadow-sm transition-transform hover:scale-105">
                        <div className="grid grid-cols-2 gap-0.5 h-6 w-6 p-0.5">
                            <div className="bg-google-blue rounded-tl-[1px]" />
                            <div className="bg-google-red rounded-tr-[1px]" />
                            <div className="bg-google-yellow rounded-bl-[1px]" />
                            <div className="bg-google-green rounded-br-[1px]" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none">RCA OPS</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Control Tower</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
                <div className="px-3 mb-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Operating System</p>
                </div>
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all relative overflow-hidden",
                                isActive
                                    ? "bg-white text-google-blue shadow-sm border border-slate-200"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                            )}
                        >
                            <item.icon className={cn(
                                "h-4.5 w-4.5 transition-colors",
                                isActive ? "text-google-blue" : "text-slate-500 group-hover:text-slate-700"
                            )} />
                            <span className="flex-1">{item.name}</span>
                            {isActive && (
                                <div className="absolute left-0 top-0 h-full w-[3px] bg-google-blue" />
                            )}
                            {isActive && <ChevronRight className="h-3.5 w-3.5 text-google-blue/40" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto border-t border-slate-100 bg-white/50 p-4">
                {/* System Card - Combined Health & Specialists */}
                <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">System Status</span>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-google-green animate-pulse shadow-[0_0_8px_rgba(52,168,83,0.4)]" />
                                <span className="text-[11px] font-bold text-slate-900 tracking-tight">85% Health</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-google-blue bg-blue-50 px-2 py-1 rounded-md">SYNC ACTIVE</span>
                    </div>

                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-google-blue w-[85%] rounded-full opacity-80" />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">6 Specialists Active</span>
                        <span className="text-[9px] font-black text-google-green uppercase tracking-widest">Live</span>
                    </div>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 p-1">
                    <div className="relative shrink-0">
                        <div className="h-2 w-2 rounded-full bg-google-green absolute -top-0.5 -right-0.5 border-2 border-white" />
                        <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center text-[10px] font-black">
                            JD
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">Josh Doering</p>
                        <p className="text-[10px] text-slate-500 font-medium">Ops Strategy</p>
                    </div>
                    <Settings className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
                </div>
            </div>
        </div>
    );
}
