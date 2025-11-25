// app/dashboard/companies/[companyId]/components/ExperiencesTab.tsx
'use client';

import { useState, useEffect } from 'react';
import ExperienceCard from './ExperienceCard';

interface Experience {
    id: string;
    role: string;
    interviewType: string;
    interviewDate: string;
    outcome: string;
    overallDifficulty: string;
    overallRating: number;
    reviewTitle: string;
    reviewText: string;
    user: {
        firstName: string;
        lastName: string;
        graduationYear: number;
        college: {
            name: string;
        };
    };
    college: {
        name: string;
    };
    upvotes: number;
    downvotes: number;
    isAnonymous: boolean;
}

interface ExperiencesTabProps {
    companyId: string;
}

export default function ExperiencesTab({ companyId }: ExperiencesTabProps) {
    const [filterScope, setFilterScope] = useState<'college' | 'global'>('college');
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/experiences/company/${companyId}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch experiences');
                }

                const data = await response.json();
                setExperiences(data.data || []);
            } catch (error) {
                console.error('Error fetching experiences:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, [companyId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setFilterScope('college')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${filterScope === 'college'
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                >
                    Your College ({experiences.length})
                </button>
                <button
                    onClick={() => setFilterScope('global')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${filterScope === 'global'
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                >
                    All Colleges ({experiences.length})
                </button>
            </div>

            {/* Experience Cards */}
            {experiences.length > 0 ? (
                <div className="space-y-4">
                    {experiences.map((exp) => (
                        <ExperienceCard key={exp.id} experience={exp} />
                    ))}
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                    <p className="text-white/60">No experiences yet. Be the first to share!</p>
                </div>
            )}

            {/* Load More */}
            {experiences.length > 0 && (
                <div className="text-center">
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-all">
                        Load More Experiences
                    </button>
                </div>
            )}
        </div>
    );
}
