import Link from 'next/link';
import { Rocket, Users } from 'lucide-react';

export default function Footer() {
    const footerLinks = {
        product: [
            { label: 'Features', href: '#features' },
            { label: 'Roadmaps', href: '#roadmaps' },
            { label: 'Assessments', href: '#assessments' },
        ],
        company: [
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Privacy Policy', href: '/privacy' },
        ],
    };

    return (
        <footer className="border-t border-white/10 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Rocket className="w-6 h-6 text-primary" />
                            <span className="text-xl font-bold">
                                Career<span className="text-primary">Compass</span>
                            </span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Empowering the next generation of developers with AI-powered learning experiences and a
                            supportive global community.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4">Contact Us</h4>
                        <p className="text-sm text-white/60 mb-2">Email</p>
                        <a
                            href="mailto:hello@careercompass.ai"
                            className="text-primary hover:underline text-sm"
                        >
                            hello@careercompass.ai
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-white/60">
                        © 2025 CareerCompass. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex gap-4">
                        {['LinkedIn', 'Instagram', 'Discord'].map((platform) => (
                            <button
                                key={platform}
                                className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all"
                                aria-label={platform}
                            >
                                <Users className="w-5 h-5" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
