// app/dashboard/companies/page.tsx
'use client';

import { useState } from 'react';
import { Search, Building2, TrendingUp, Users, MapPin, ExternalLink, GraduationCap, X } from 'lucide-react';
import Link from 'next/link';

// Mock colleges - replace with API call
const mockColleges = [
    { id: 'jklu', name: 'JK Lakshmipat University', shortName: 'JKLU' },
    { id: 'lnmit', name: 'LNMIIT', shortName: 'LNMIIT' },
    { id: 'mnit', name: 'MNIT Jaipur', shortName: 'MNIT' },
    { id: 'iitr', name: 'IIT Roorkee', shortName: 'IIT Roorkee' },
    { id: 'dtu', name: 'Delhi Technological University', shortName: 'DTU' },
];

// Mock data - replace with API call
const mockCompanies = [
    {
        id: 'tcs',
        name: 'Tata Consultancy Services',
        logo: 'https://logo.clearbit.com/tcs.com',
        industry: 'IT Services',
        experienceCount: 45,
        avgRating: 4.2,
        collegeExperienceCount: 12,
        visitedColleges: ['jklu', 'lnmit', 'mnit'],
        headquarters: 'Mumbai, India',
        employeeCount: '500,000+',
    },
    {
        id: 'infosys',
        name: 'Infosys',
        logo: 'https://logo.clearbit.com/infosys.com',
        industry: 'IT Services',
        experienceCount: 38,
        avgRating: 4.0,
        collegeExperienceCount: 8,
        visitedColleges: ['jklu', 'iitr', 'dtu'],
        headquarters: 'Bangalore, India',
        employeeCount: '300,000+',
    },
    {
        id: 'google',
        name: 'Google',
        logo: 'https://logo.clearbit.com/google.com',
        industry: 'Technology',
        experienceCount: 156,
        avgRating: 4.5,
        collegeExperienceCount: 0,
        visitedColleges: ['iitr', 'dtu'],
        headquarters: 'Mountain View, USA',
        employeeCount: '100,000+',
    },
    {
        id: 'amazon',
        name: 'Amazon',
        logo: 'https://logo.clearbit.com/amazon.com',
        industry: 'Technology',
        experienceCount: 142,
        avgRating: 4.3,
        collegeExperienceCount: 0,
        visitedColleges: ['lnmit', 'mnit', 'iitr'],
        headquarters: 'Seattle, USA',
        employeeCount: '1,500,000+',
    },
    {
        id: 'wipro',
        name: 'Wipro',
        logo: 'https://logo.clearbit.com/wipro.com',
        industry: 'IT Services',
        experienceCount: 52,
        avgRating: 3.9,
        collegeExperienceCount: 9,
        visitedColleges: ['jklu', 'lnmit'],
        headquarters: 'Bangalore, India',
        employeeCount: '250,000+',
    },
    {
        id: 'microsoft',
        name: 'Microsoft',
        logo: 'https://logo.clearbit.com/microsoft.com',
        industry: 'Technology',
        experienceCount: 128,
        avgRating: 4.4,
        collegeExperienceCount: 0,
        visitedColleges: ['iitr', 'dtu'],
        headquarters: 'Redmond, USA',
        employeeCount: '200,000+',
    },
];

export default function CompaniesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
    const [selectedColleges, setSelectedColleges] = useState<string[]>(['jklu']);
    const userCollege = 'jklu'; // TODO: Get from user context/auth

    // Filter companies
    const filteredCompanies = mockCompanies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
        const matchesCollege = selectedColleges.length === 0 ||
            selectedColleges.some(collegeId => company.visitedColleges.includes(collegeId));

        return matchesSearch && matchesIndustry && matchesCollege;
    });

    const collegeCompanies = filteredCompanies.filter(c => c.visitedColleges.includes(userCollege));
    const otherCompanies = filteredCompanies.filter(c => !c.visitedColleges.includes(userCollege));

    const toggleCollege = (collegeId: string) => {
        setSelectedColleges(prev => {
            if (prev.includes(collegeId)) {
                return prev.filter(id => id !== collegeId);
            } else {
                return [...prev, collegeId];
            }
        });
    };

    const clearCollegeFilters = () => {
        setSelectedColleges([]);
    };

    const resetToMyCollege = () => {
        setSelectedColleges([userCollege]);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Interview Experiences</h1>
                <p className="text-white/60">
                    Explore company placements, interview experiences, and insights from students at your college
                </p>
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
                    <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-all min-w-[180px]"
                    >
                        <option value="all">All Industries</option>
                        <option value="IT Services">IT Services</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Consulting">Consulting</option>
                    </select>

                    {/* College Filter Dropdown */}
                    <div className="relative group">
                        <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:border-primary/50 transition-all min-w-[200px] flex items-center justify-between gap-2">
                            <span className="flex items-center gap-2">
                                <GraduationCap className="w-5 h-5" />
                                {selectedColleges.length === 0 ? 'All Colleges' :
                                    selectedColleges.length === 1 ? mockColleges.find(c => c.id === selectedColleges[0])?.shortName :
                                        `${selectedColleges.length} Colleges`}
                            </span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="hidden group-hover:block absolute top-full mt-2 left-0 w-72 bg-black border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                            <div className="p-4 border-b border-white/10">
                                <p className="text-sm font-medium text-white/80 mb-3">Filter by College</p>

                                <div className="flex gap-2 mb-3">
                                    <button
                                        onClick={resetToMyCollege}
                                        className="text-xs px-3 py-1.5 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all"
                                    >
                                        My College Only
                                    </button>
                                    <button
                                        onClick={clearCollegeFilters}
                                        className="text-xs px-3 py-1.5 bg-white/5 text-white/70 rounded-lg hover:bg-white/10 transition-all"
                                    >
                                        Show All
                                    </button>
                                </div>
                            </div>

                            <div className="max-h-80 overflow-y-auto p-2">
                                {mockColleges.map((college) => {
                                    const isSelected = selectedColleges.includes(college.id);
                                    const isUserCollege = college.id === userCollege;

                                    return (
                                        <button
                                            key={college.id}
                                            onClick={() => toggleCollege(college.id)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-left"
                                        >
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                                                    ? 'bg-primary border-primary'
                                                    : 'border-white/20'
                                                }`}>
                                                {isSelected && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-white">
                                                        {college.name}
                                                    </span>
                                                    {isUserCollege && (
                                                        <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Filter Pills */}
                {(selectedColleges.length > 0 || selectedIndustry !== 'all' || searchQuery) && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-white/60">Active filters:</span>

                        {selectedColleges.map(collegeId => {
                            const college = mockColleges.find(c => c.id === collegeId);
                            const isUserCollege = collegeId === userCollege;

                            return (
                                <div
                                    key={collegeId}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isUserCollege
                                            ? 'bg-primary/20 text-primary border border-primary/30'
                                            : 'bg-white/5 text-white/80 border border-white/10'
                                        }`}
                                >
                                    <GraduationCap className="w-3.5 h-3.5" />
                                    {college?.shortName}
                                    <button
                                        onClick={() => toggleCollege(collegeId)}
                                        className="hover:bg-white/10 rounded-full p-0.5 transition-all"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            );
                        })}

                        {selectedIndustry !== 'all' && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white/80">
                                {selectedIndustry}
                                <button
                                    onClick={() => setSelectedIndustry('all')}
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
                                setSelectedColleges([userCollege]);
                            }}
                            className="text-sm text-white/60 hover:text-primary transition-all underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                <div className="text-sm text-white/60">
                    Showing <span className="text-white font-medium">{filteredCompanies.length}</span> companies
                    {selectedColleges.length > 0 && selectedColleges.length !== mockColleges.length && (
                        <span> from <span className="text-primary font-medium">{selectedColleges.length}</span> selected {selectedColleges.length === 1 ? 'college' : 'colleges'}</span>
                    )}
                </div>
            </div>

            {/* Companies at Your College */}
            {selectedColleges.includes(userCollege) && collegeCompanies.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold">Companies at Your College</h2>
                        <span className="text-sm text-white/60">({collegeCompanies.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collegeCompanies.map((company) => (
                            <CompanyCard
                                key={company.id}
                                company={company}
                                userCollege={userCollege}
                                selectedColleges={selectedColleges}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Other Companies */}
            {otherCompanies.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-white/60" />
                        <h2 className="text-xl font-bold">
                            {selectedColleges.includes(userCollege) ? 'Other Companies' : 'All Companies'}
                        </h2>
                        <span className="text-sm text-white/60">({otherCompanies.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherCompanies.map((company) => (
                            <CompanyCard
                                key={company.id}
                                company={company}
                                userCollege={userCollege}
                                selectedColleges={selectedColleges}
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
                        Try adjusting your filters or search query
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedIndustry('all');
                            setSelectedColleges([userCollege]);
                        }}
                        className="px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all"
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    );
}

// Company Card Component
function CompanyCard({
    company,
    userCollege,
    selectedColleges
}: {
    company: any;
    userCollege: string;
    selectedColleges: string[];
}) {
    const atYourCollege = company.visitedColleges.includes(userCollege);
    const relevantColleges = company.visitedColleges.filter((id: string) =>
        selectedColleges.includes(id)
    );

    return (
        <Link
            href={`/dashboard/companies/${company.id}`}
            className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/50 hover:bg-white/10 transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                            src={company.logo}
                            alt={company.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%23666" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/%3E%3C/svg%3E';
                            }}
                        />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-white group-hover:text-primary transition-colors truncate">
                            {company.name}
                        </h3>
                        <p className="text-sm text-white/60">{company.industry}</p>
                    </div>
                </div>
                {atYourCollege && (
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

                {relevantColleges.length > 0 && selectedColleges.length > 1 && (
                    <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4 text-white/40" />
                        <span className="text-white/70">
                            Visits {relevantColleges.length} of your filtered colleges
                        </span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="font-medium">{company.avgRating}</span>
                    </div>
                    <div className="text-white/60">
                        {company.experienceCount} experiences
                    </div>
                </div>
                {company.collegeExperienceCount > 0 && atYourCollege && (
                    <div className="text-sm text-primary font-medium">
                        {company.collegeExperienceCount} from your college
                    </div>
                )}
            </div>
        </Link>
    );
}
