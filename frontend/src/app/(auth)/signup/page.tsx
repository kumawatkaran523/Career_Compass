'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { Rocket, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
    const benefits = [
        'AI-powered career roadmaps',
        'Resume skill analysis',
        'Personalized course recommendations',
        'Interactive skill assessments',
        'Real-time progress tracking',
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            {/* Back to Home - fixed top-left */}
            <div className="absolute top-6 left-6 z-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
                

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Benefits */}
                    <div className="hidden lg:block">
                        <Link href="/" className="inline-flex items-center gap-2 mb-8">
                            <Rocket className="w-8 h-8 text-primary" />
                            <span className="text-2xl font-bold">
                                Career<span className="text-primary">Compass</span>
                            </span>
                        </Link>

                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Start Your Career Journey <span className="text-primary">Today</span>
                        </h1>

                        <p className="text-xl text-white/70 mb-8">
                            Join thousands of learners transforming their careers with AI-powered guidance
                        </p>

                        {/* Benefits List */}
                        <div className="space-y-4">
                            {benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-white/90">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/10">
                            <div>
                                <p className="text-3xl font-bold text-primary">10k+</p>
                                <p className="text-sm text-white/60">Active Users</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">500+</p>
                                <p className="text-sm text-white/60">Career Paths</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">95%</p>
                                <p className="text-sm text-white/60">Success Rate</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Sign Up Form */}
                    <div>
                        <div className="text-center lg:text-left mb-8 lg:hidden">
                            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
                            <p className="text-white/70">Get started with personalized career guidance</p>
                        </div>

                        <div className="hidden lg:block text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
                            <p className="text-white/70">Get started in less than 2 minutes</p>
                        </div>

                        {/* Clerk Sign Up Component */}
                        <div className="flex justify-center">
                            <SignUp
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

                        {/* Login Link */}
                        <p className="text-center mt-6 text-white/70">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary hover:text-primary-400 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
