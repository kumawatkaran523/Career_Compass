'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StepCardProps {
    step: {
        number: string;
        title: string;
        description: string;
        icon: LucideIcon;
    };
    index: number;
    isLast: boolean;
}

export default function StepCard({ step, index, isLast }: StepCardProps) {
    const { number, title, description, icon: Icon } = step;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative text-center"
        >
            {/* Connector Line */}
            {!isLast && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-white/10" />
            )}

            {/* Number Badge */}
            <div className="relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full mb-6 border border-primary/30">
                <span className="text-5xl font-bold text-primary">{number}</span>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <Icon className="w-8 h-8 text-primary" />
                </div>
            </div>

            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-white/70 leading-relaxed">{description}</p>
        </motion.div>
    );
}
