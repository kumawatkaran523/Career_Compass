// app/login/page.tsx
'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { Rocket, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            <div className="absolute top-6 left-6 z-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 justify-center mb-4">
                        <Rocket className="w-8 h-8 text-primary" />
                        <span className="text-2xl font-bold">
                            Career<span className="text-primary">Compass</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-white/70">Sign in to continue your learning journey</p>
                </div>

                <div className="flex justify-center">
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: 'w-full',
                                card: 'bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl',
                                headerTitle: 'text-white',
                                headerSubtitle: 'text-white/70',
                                socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
                                formButtonPrimary: 'bg-primary hover:bg-primary-600',
                                footerActionLink: 'text-primary hover:text-primary-400',
                                formFieldLabel: 'text-white',
                                formFieldInput: 'bg-white/10 border-white/20 text-white',
                                identityPreviewText: 'text-white',
                                identityPreviewEditButton: 'text-primary',
                            },
                        }}
                    />
                </div>

                <p className="text-center mt-6 text-white/70">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-primary hover:text-primary-400 font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
