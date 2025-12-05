'use client';

import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';

export default function Header() {
    const { isSignedIn, isLoaded } = useUser();

    return (
        <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-white/10 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Rocket className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold text-white">
                        Career<span className="text-primary">Compass</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-white/70 hover:text-white transition-colors font-medium">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-white/70 hover:text-white transition-colors font-medium">
                        How It Works
                    </Link>
                    <Link href="#community" className="text-white/70 hover:text-white transition-colors font-medium">
                        Community
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {!isLoaded ? (
                        <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
                    ) : isSignedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="hidden md:block px-4 py-2 text-white/70 hover:text-white transition-colors font-medium"
                            >
                                Dashboard
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden sm:block text-white/70 hover:text-white transition-colors font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="px-6 py-2.5 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-primary/50"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
