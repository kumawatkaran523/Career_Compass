'use client';

import { useState } from 'react';
import ExperienceCard from './ExperienceCard';
import { mockExperiences } from '../data/mockData';

interface ExperiencesTabProps {
    companyId: string;
}

export default function ExperiencesTab({ companyId }: ExperiencesTabProps) {
    const [filterScope, setFilterScope] = useState<'college' | 'global'>('college');

    return (
        <div className="space-y-6">
            {/* Filter Toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setFilterScope('college')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        filterScope === 'college'
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                >
                    Your College ({mockExperiences.filter(e => e.isCollege).length})
                </button>
                <button
                    onClick={() => setFilterScope('global')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        filterScope === 'global'
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                >
                    All Colleges (234)
                </button>
            </div>

            {/* Experience Cards */}
            <div className="space-y-4">
                {mockExperiences.map((exp) => (
                    <ExperienceCard key={exp.id} experience={exp} />
                ))}
            </div>

            {/* Load More */}
            <div className="text-center">
                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-all">
                    Load More Experiences
                </button>
            </div>
        </div>
    );
}
