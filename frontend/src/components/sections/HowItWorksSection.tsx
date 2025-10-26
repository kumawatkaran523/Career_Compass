'use client';

import { motion } from 'framer-motion';
import { Rocket, Brain, TrendingUp } from 'lucide-react';
import StepCard from '@/components/ui/StepCard';

export default function HowItWorksSection() {
    const steps = [
        {
            number: '01',
            title: 'Upload Your Resume',
            description: 'Simply upload your resume and our NLP engine will analyze your skills and experience',
            icon: Rocket,
        },
        {
            number: '02',
            title: 'Get AI Recommendations',
            description: 'Receive personalized career paths and skill gap analysis based on your profile',
            icon: Brain,
        },
        {
            number: '03',
            title: 'Start Learning',
            description: 'Access curated courses, take assessments, and track your progress in real-time',
            icon: TrendingUp,
        },
    ];

    return (
        <section id="how-it-works" className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        How It <span className="text-primary">Works</span>
                    </h2>
                    <p className="text-xl text-white/70">Three simple steps to transform your career</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <StepCard key={idx} step={step} index={idx} isLast={idx === steps.length - 1} />
                    ))}
                </div>
            </div>
        </section>
    );
}

