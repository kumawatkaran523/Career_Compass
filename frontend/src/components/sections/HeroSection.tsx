'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ArrowRight, Target, Zap } from 'lucide-react';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
            {/* Animated Background */}
            <AnimatedBackground />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid lg:grid-cols-2 gap-12 items-center"
                >
                    {/* Left Content */}
                    <motion.div variants={fadeInUp}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">AI-Powered Career Guidance</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Because <span className="text-primary">College</span> Won't Teach You{' '}
                            <span className="text-primary">This!</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl text-white/70 mb-8 leading-relaxed">
                            Get personalized career roadmaps, skill assessments, and upskilling recommendations
                            powered by advanced NLP and AI technology.
                        </p>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {['Resume Analysis', 'AI Roadmaps', 'Smart Assessments'].map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    <span className="text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/signup"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-600 text-white font-medium rounded-lg transition-all hover:scale-105 active:scale-95"
                            >
                                Start Your Journey
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/demo"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:bg-white/5 font-medium rounded-lg transition-all"
                            >
                                Watch Demo
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Content - Dashboard Preview */}
                    <motion.div
                        variants={fadeInUp}
                        className="relative"
                    >
                        <DashboardPreview />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

// Dashboard Preview Component
function DashboardPreview() {
    const skills = [
        { skill: 'React & Next.js', progress: 75, color: 'bg-primary' },
        { skill: 'Node.js & APIs', progress: 60, color: 'bg-primary-400' },
        { skill: 'Database Design', progress: 85, color: 'bg-primary-300' },
    ];

    return (
        <>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-white/60">Your Career Path</p>
                            <p className="font-semibold">Full-Stack Developer</p>
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
                        85% Match
                    </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4 mb-6">
                    {skills.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ delay: 0.5 + idx * 0.2, duration: 0.8 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white/80">{item.skill}</span>
                                <span className="text-sm text-white/60">{item.progress}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.progress}%` }}
                                    transition={{ delay: 0.8 + idx * 0.2, duration: 1 }}
                                    className={`h-full ${item.color} rounded-full`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    {[
                        { value: '12', label: 'Skills Mastered' },
                        { value: '8', label: 'Courses Completed' },
                        { value: '95%', label: 'Profile Score' },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <p className="text-2xl font-bold text-primary">{stat.value}</p>
                            <p className="text-xs text-white/60">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Element */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-primary/30"
            >
                <Zap className="w-10 h-10 text-primary" />
            </motion.div>
        </>
    );
}
