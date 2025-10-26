'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    feature: {
        icon: LucideIcon;
        title: string;
        description: string;
        badge: string;
    };
    index: number;
}

export default function FeatureCard({ feature, index }: FeatureCardProps) {
    const { icon: Icon, title, description, badge } = feature;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all hover:scale-105"
        >
            {/* Icon */}
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-7 h-7 text-primary" />
            </div>

            {/* Badge */}
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                {badge}
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-white/70 leading-relaxed">{description}</p>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
        </motion.div>
    );
}
