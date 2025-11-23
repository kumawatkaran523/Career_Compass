// app/dashboard/companies/[companyId]/components/CompanyHeader.tsx
import Link from 'next/link';
import { MapPin, Users, Globe, ArrowRight, ExternalLink } from 'lucide-react';
import { Company } from '../types';

interface CompanyHeaderProps {
    company: Company;
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-start gap-6">
                {/* Company Logo */}
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                        src={company.logo}
                        alt={company.name}
                        className="w-full h-full object-contain p-2"
                    />
                </div>

                {/* Company Info - Compact */}
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">{company.name}</h1>
                            <p className="text-white/60 text-sm">{company.industry}</p>
                        </div>
                        <Link
                            href={`/dashboard/companies/${company.id}/add-experience`}
                            className="px-5 py-2.5 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2 text-sm"
                        >
                            Share Experience
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Meta Info - Inline */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-white/40" />
                            {company.headquarters}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-white/40" />
                            {company.employeeCount}
                        </div>
                        <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-primary hover:underline"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            Visit Website
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    {/* About - Inline, Truncated */}
                    <p className="text-white/60 text-sm mt-3 line-clamp-2 leading-relaxed">
                        {company.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
