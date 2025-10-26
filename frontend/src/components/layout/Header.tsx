'use client';

import Link from 'next/link';
import { Rocket, Sparkles } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';

export default function Header() {
    const { isSignedIn, user, isLoaded } = useUser();

    return (
        <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-white/10 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Rocket className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">
                        Career<span className="text-primary">Compass</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-white/70 hover:text-white transition-colors">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-white/70 hover:text-white transition-colors">
                        How It Works
                    </Link>
                    <Link href="#community" className="text-white/70 hover:text-white transition-colors">
                        Community
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {!isLoaded ? (
                        // Loading state
                        <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
                    ) : isSignedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="hidden md:block text-white/70 hover:text-white transition-colors"
                            >
                                Dashboard
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </>
                    ) : (
                        <>
                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <Sparkles className="w-5 h-5" />
                            </button>
                            <Link
                                href="/login"
                                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-all"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
