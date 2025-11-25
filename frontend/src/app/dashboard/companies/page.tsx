'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Building2, Users, MapPin, GraduationCap, X, Loader2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface College {
    id: string;
    name: string;
    location: string;
}

interface Company {
    id: string;
    name: string;
    logo?: string;
    industry: string;
    headquarters: string;
    employeeCount: string;
    description?: string;
    _count?: {
        experiences: number;
        popularQuestions: number;
    };
    experiences?: Array<{
        collegeId: string;
    }>;
}

export default function CompaniesPage() {
    const { user } = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
    const [selectedCollege, setSelectedCollege] = useState<string>('all');
    const [industryOpen, setIndustryOpen] = useState(false);
    const [collegeOpen, setCollegeOpen] = useState(false);
    const industryDropdownRef = useRef<HTMLDivElement>(null);
    const collegeDropdownRef = useRef<HTMLDivElement>(null);

    const [colleges, setColleges] = useState<College[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [userCollege, setUserCollege] = useState<string>('');

    // Fetch colleges and companies on mount
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch user profile to get their college
    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, [user]);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/clerk/${user?.id}`
            );
            if (response.ok) {
                const data = await response.json();
                setUserCollege(data.data?.collegeId || '');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [collegesRes, companiesRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colleges`),
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companies`),
            ]);

            if (collegesRes.ok) {
                const collegesData = await collegesRes.json();
                setColleges(collegesData.data || []);
            }

            if (companiesRes.ok) {
                const companiesData = await companiesRes.json();
                setCompanies(companiesData.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Click-outside detection for dropdowns
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (industryDropdownRef.current && !industryDropdownRef.current.contains(event.target as Node)) {
                setIndustryOpen(false);
            }
            if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(event.target as Node)) {
                setCollegeOpen(false);
            }
        }

        if (industryOpen || collegeOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [industryOpen, collegeOpen]);

    // Filter companies
    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
        const matchesCollege = selectedCollege === 'all' ||
            (selectedCollege === 'your-college' && company.experiences?.some(exp => exp.collegeId === userCollege)) ||
            (selectedCollege !== 'your-college' && company.experiences?.some(exp => exp.collegeId === selectedCollege));

        return matchesSearch && matchesIndustry && matchesCollege;
    });

    // Separate companies by college
    const collegeCompanies = filteredCompanies.filter(company =>
        company.experiences?.some(exp => exp.collegeId === userCollege)
    );

    const otherCompanies = filteredCompanies.filter(company =>
        !company.experiences?.some(exp => exp.collegeId === userCollege)
    );

    // Get unique industries from companies
    const industries = [
        { id: 'all', label: 'All Industries' },
        ...Array.from(new Set(companies.map(c => c.industry)))
            .filter(Boolean)
            .map(industry => ({ id: industry, label: industry }))
    ];

    // College filter options
    const collegeOptions = [
        { id: 'all', label: 'All Colleges' },
        { id: 'your-college', label: 'Your College' },
        // ...colleges.map(college => ({ id: college.id, label: college.name }))
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Placement Insights</h1>
                        <p className="text-white/60">
                            Explore companies, interview experiences, and salary trends
                        </p>
                    </div>

                    <Link
                        href="/dashboard/companies/add-company"
                        className="px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2 whitespace-nowrap"
                    >
                        <Building2 className="w-5 h-5" />
                        Add Company
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>

                    {/* Industry Filter */}
                    <div className="relative" ref={industryDropdownRef}>
                        <button
                            onClick={() => setIndustryOpen(!industryOpen)}
                            className="px-4 py-3 min-w-[180px] bg-[#0a0a0a] border border-white/10 rounded-xl text-white flex items-center justify-between focus:outline-none focus:ring-0 transition-all hover:border-primary/50"
                        >
                            <span className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-white/60" />
                                {selectedIndustry === 'all' ? 'All Industries' : selectedIndustry}
                            </span>
                            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {industryOpen && (
                            <div className="absolute top-full left-0 w-full mt-2 z-50 bg-[#0e0e0e] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                                {industries.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setSelectedIndustry(item.id);
                                            setIndustryOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-white hover:bg-[#1a1a1a] transition-colors"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* College Filter */}
                    <div className="relative" ref={collegeDropdownRef}>
                        <button
                            onClick={() => setCollegeOpen(!collegeOpen)}
                            className="px-4 py-3 min-w-[180px] bg-[#0a0a0a] border border-white/10 rounded-xl text-white flex items-center justify-between focus:outline-none focus:ring-0 transition-all hover:border-primary/50"
                        >
                            <span className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-white/60" />
                                {selectedCollege === 'all'
                                    ? 'All Colleges'
                                    : selectedCollege === 'your-college'
                                        ? 'Your College'
                                        : colleges.find(c => c.id === selectedCollege)?.name || 'Select College'}
                            </span>
                            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {collegeOpen && (
                            <div className="absolute top-full left-0 w-full mt-2 z-50 bg-[#0e0e0e] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                                {collegeOptions.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setSelectedCollege(item.id);
                                            setCollegeOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-white hover:bg-[#1a1a1a] transition-colors"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Filter Pills */}
                {(selectedIndustry !== 'all' || selectedCollege !== 'all' || searchQuery) && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-white/60">Active filters:</span>

                        {selectedIndustry !== 'all' && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white/80">
                                <Briefcase className="w-3.5 h-3.5" />
                                {selectedIndustry}
                                <button
                                    onClick={() => setSelectedIndustry('all')}
                                    className="hover:bg-white/10 rounded-full p-0.5 transition-all"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        {selectedCollege !== 'all' && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white/80">
                                <GraduationCap className="w-3.5 h-3.5" />
                                {selectedCollege === 'your-college'
                                    ? 'Your College'
                                    : colleges.find(c => c.id === selectedCollege)?.name}
                                <button
                                    onClick={() => setSelectedCollege('all')}
                                    className="hover:bg-white/10 rounded-full p-0.5 transition-all"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        {searchQuery && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white/80">
                                Search: "{searchQuery}"
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="hover:bg-white/10 rounded-full p-0.5 transition-all"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedIndustry('all');
                                setSelectedCollege('all');
                            }}
                            className="text-sm text-white/60 hover:text-primary transition-all underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                <div className="text-sm text-white/60">
                    Showing <span className="text-white font-medium">{filteredCompanies.length}</span> companies
                </div>
            </div>

            {/* Companies at Your College */}
            {collegeCompanies.length > 0 && userCollege && selectedCollege === 'all' && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold">Companies at Your College</h2>
                        <span className="text-sm text-white/60">({collegeCompanies.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collegeCompanies.map((company) => (
                            <CompanyCard key={company.id} company={company} isAtYourCollege={true} />
                        ))}
                    </div>
                </div>
            )}

            {/* Other Companies / All Companies */}
            {((selectedCollege === 'all' && otherCompanies.length > 0) || (selectedCollege !== 'all' && filteredCompanies.length > 0)) && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-white/60" />
                        <h2 className="text-xl font-bold">
                            {selectedCollege === 'all' && collegeCompanies.length > 0 ? 'Other Companies' : 'All Companies'}
                        </h2>
                        <span className="text-sm text-white/60">
                            ({selectedCollege === 'all' ? otherCompanies.length : filteredCompanies.length})
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(selectedCollege === 'all' ? otherCompanies : filteredCompanies).map((company) => (
                            <CompanyCard
                                key={company.id}
                                company={company}
                                isAtYourCollege={company.experiences?.some(exp => exp.collegeId === userCollege) || false}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredCompanies.length === 0 && (
                <div className="text-center py-16">
                    <Building2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No companies found</h3>
                    <p className="text-white/60 mb-6">
                        {companies.length === 0
                            ? 'No companies added yet. Be the first to add one!'
                            : 'Try adjusting your filters or search query'}
                    </p>
                    {companies.length === 0 ? (
                        <Link
                            href="/dashboard/companies/add-company"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all"
                        >
                            <Building2 className="w-5 h-5" />
                            Add First Company
                        </Link>
                    ) : (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedIndustry('all');
                                setSelectedCollege('all');
                            }}
                            className="px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// Company Card Component (same as before)
function CompanyCard({ company, isAtYourCollege }: { company: Company; isAtYourCollege: boolean }) {
    return (
        <Link
            href={`/dashboard/companies/${company.id}`}
            className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/50 hover:bg-white/10 transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {company.logo ? (
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%23666" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/%3E%3C/svg%3E';
                                }}
                            />
                        ) : (
                            <Building2 className="w-6 h-6 text-white/40" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white group-hover:text-primary transition-colors truncate">
                            {company.name}
                        </h3>
                        <p className="text-sm text-white/60">{company.industry}</p>
                    </div>
                </div>
                {isAtYourCollege && (
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-md flex items-center gap-1 flex-shrink-0">
                        <GraduationCap className="w-3 h-3" />
                        Your College
                    </span>
                )}
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-white/40" />
                    <span className="text-white/70">{company.headquarters}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-white/40" />
                    <span className="text-white/70">{company.employeeCount} employees</span>
                </div>
            </div>

            {company.description && (
                <p className="text-sm text-white/60 line-clamp-2 mb-4">
                    {company.description}
                </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="text-sm text-white/60">
                    {company._count?.experiences || 0} experiences
                </div>
            </div>
        </Link>
    );
}
