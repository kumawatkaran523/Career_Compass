'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Rocket,
    LayoutDashboard,
    Code2,
    Upload,
    TrendingUp,
    ClipboardCheck,
    User,
    Settings,
    ListChecks,
    LogOut
} from 'lucide-react';
import { useClerk } from '@clerk/nextjs';

export default function Sidebar() {
    const pathname = usePathname();
    const { signOut } = useClerk();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Problems', href: '/dashboard/problems', icon: Code2 },
        { name: 'Resume Analysis', href: '/dashboard/resume-analyze', icon: Upload },
        { name: 'Career Paths', href: '/dashboard/careerPaths', icon: TrendingUp },
        { name: 'Interview Questions', href: '/dashboard/interview-questions', icon: ListChecks },
        { name: 'Assessments', href: '/dashboard/assessments', icon: ClipboardCheck },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
    ];

    return (
        <aside className="w-64 bg-white/5 border-r border-white/10 flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="h-16 px-6 border-b border-white/10 flex items-center">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">
                        Career<span className="text-primary">Compass</span>
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                                }
              `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/10 space-y-1">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all"
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </Link>

                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-red-400 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
