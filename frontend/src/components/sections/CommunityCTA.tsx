'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function CommunityCTA() {
    return (
        <section id="community" className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/30 rounded-3xl p-12 text-center overflow-hidden"
                >
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/30 border border-primary/20 rounded-full mb-6">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Join Our Community</span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                        Connect & <span className="text-primary">Learn Together</span>
                    </h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Join thousands of learners in our vibrant community. Get instant help, share knowledge, and
                        grow together.
                    </p>

                    {/* Social Icons */}
                    <div className="flex justify-center gap-4 mb-8">
                        {['Email', 'LinkedIn', 'Instagram'].map((platform) => (
                            <button
                                key={platform}
                                className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                aria-label={platform}
                            >
                                <Users className="w-5 h-5" />
                            </button>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-600 text-white font-medium rounded-lg transition-all hover:scale-105">
                            <Users className="w-5 h-5" />
                            Join Discord
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:bg-white/5 font-medium rounded-lg transition-all">
                            Join WhatsApp
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
