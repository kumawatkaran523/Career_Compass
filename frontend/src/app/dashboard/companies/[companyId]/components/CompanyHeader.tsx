// components/CompanyHeader.tsx
'use client';

import Link from 'next/link';
import { Building2, MapPin, Users, Globe, Plus } from 'lucide-react';

interface Company {
    id: string;
    name: string;
    logo: string | null;
    website: string | null;
    industry: string;
    description: string | null;
    headquarters: string | null;
    employeeCount: string | null;
}

interface CompanyHeaderProps {
    company: Company;
    companyId: string;
}

export default function CompanyHeader({ company, companyId }: CompanyHeaderProps) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="flex items-start gap-6 flex-1 min-w-0">
                    {/* Company Logo */}
                    <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        {company.logo ? (
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="w-full h-full object-contain p-3"
                            />
                        ) : (
                            <Building2 className="w-12 h-12 text-gray-400" />
                        )}
                    </div>

                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                        <div className="flex items-center gap-4 text-white/60 mb-4 flex-wrap">
                            {company.headquarters && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{company.headquarters}</span>
                                </div>
                            )}
                            {company.employeeCount && (
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>{company.employeeCount}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                <span>{company.industry}</span>
                            </div>
                            {company.website && (
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-primary transition-colors"
                                >
                                    <Globe className="w-4 h-4" />
                                    <span>Website</span>
                                </a>
                            )}
                        </div>
                        {company.description && (
                            <p className="text-white/70 line-clamp-2">{company.description}</p>
                        )}
                    </div>
                </div>

                {/* Add Experience Button */}
                <Link
                    href={`/dashboard/companies/${companyId}/add-experience`}
                    className="px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2 whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    Add Experience
                </Link>
            </div>
        </div>
    );
}
