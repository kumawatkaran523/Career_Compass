import Link from 'next/link';
import { MapPin, Users, Globe, ArrowRight } from 'lucide-react';
import { Company } from '../types';

interface CompanyHeaderProps {
    company: Company;
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                        src={company.logo}
                        alt={company.name}
                        className="w-full h-full object-contain p-2"
                    />
                </div>

                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                    <p className="text-white/60 mb-4">{company.industry}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-white/70">
                            <MapPin className="w-4 h-4" />
                            {company.headquarters}
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                            <Users className="w-4 h-4" />
                            {company.employeeCount}
                        </div>
                        <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                        >
                            <Globe className="w-4 h-4" />
                            Visit Website
                        </a>
                    </div>
                </div>

                <Link
                    href={`/dashboard/companies/${company.id}/add-experience`}
                    className="px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                    Share Experience
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
