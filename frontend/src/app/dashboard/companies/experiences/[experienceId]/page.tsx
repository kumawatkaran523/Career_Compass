// app/dashboard/experiences/[experienceId]/page.tsx
'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Building2,
    Calendar,
    Briefcase,
    TrendingUp,
    ThumbsUp,
    ThumbsDown,
    Star,
    MapPin,
    Clock,
    User
} from 'lucide-react';
import Link from 'next/link';

interface Round {
    roundNumber: number;
    name: string;
    difficulty: string;
    duration: string;
    description: string;
}

interface Experience {
    id: string;
    role: string;
    interviewType: string;
    interviewDate: string;
    outcome: string;
    rounds: Round[];
    salaryOffered: number | null;
    joiningBonus: number | null;
    otherBenefits: string | null;
    overallDifficulty: string;
    overallRating: number;
    reviewTitle: string;
    reviewText: string;
    applicationProcess: string | null;
    preparationTips: string | null;
    interviewerBehavior: string | null;
    isAnonymous: boolean;
    upvotes: number;
    downvotes: number;
    createdAt: string;
    company: {
        id: string;
        name: string;
        logo: string | null;
        industry: string;
    };
    college: {
        name: string;
    };
    user: {
        firstName: string;
        lastName: string;
        graduationYear: number;
    };
}

export default function ExperienceDetailPage({ params }: { params: Promise<{ experienceId: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [experience, setExperience] = useState<Experience | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/experiences/${resolvedParams.experienceId}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch experience');
                }

                const data = await response.json();
                setExperience(data.data);
            } catch (error) {
                console.error('Error fetching experience:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, [resolvedParams.experienceId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!experience) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Experience not found</h2>
                    <p className="text-white/60">The experience you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    const outcomeColors = {
        SELECTED: 'bg-green-500/20 text-green-400 border-green-500/30',
        REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
        WAITING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };

    const difficultyColors = {
        EASY: 'text-green-400',
        MEDIUM: 'text-yellow-400',
        HARD: 'text-red-400',
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <Link
                href={`/dashboard/companies/${experience.company.id}?tab=experiences`} // ← Add ?tab=experiences
                className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to {experience.company.name}
            </Link>

            {/* Company & Role Info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    {/* Company Logo */}
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        {experience.company.logo ? (
                            <img
                                src={experience.company.logo}
                                alt={experience.company.name}
                                className="w-full h-full object-contain p-2"
                            />
                        ) : (
                            <Building2 className="w-8 h-8 text-gray-400" />
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">{experience.reviewTitle}</h1>
                                <p className="text-lg text-white/80 mb-2">{experience.role}</p>
                                <Link
                                    href={`/dashboard/companies/${experience.company.id}`}
                                    className="text-primary hover:underline"
                                >
                                    {experience.company.name}
                                </Link>
                            </div>

                            <div className={`px-4 py-2 rounded-lg font-medium border ${outcomeColors[experience.outcome as keyof typeof outcomeColors]}`}>
                                {experience.outcome}
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 mt-4 text-sm text-white/60">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(experience.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{experience.college.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                <span>{experience.interviewType.replace('_', ' ')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Author & Stats */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium">
                                {experience.isAnonymous
                                    ? 'Anonymous'
                                    : `${experience.user.firstName} ${experience.user.lastName}`
                                }
                            </p>
                            <p className="text-sm text-white/60">
                                Class of {experience.user.graduationYear}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="flex items-center gap-1 mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-5 h-5 ${star <= experience.overallRating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-white/20'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-white/60">Rating</p>
                        </div>

                        <div className="text-center">
                            <p className={`text-lg font-bold ${difficultyColors[experience.overallDifficulty as keyof typeof difficultyColors]}`}>
                                {experience.overallDifficulty}
                            </p>
                            <p className="text-xs text-white/60">Difficulty</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{experience.upvotes}</span>
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                                <ThumbsDown className="w-4 h-4" />
                                <span>{experience.downvotes}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Review */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Experience Review</h2>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{experience.reviewText}</p>
            </div>

            {/* Interview Rounds */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Interview Rounds</h2>
                <div className="space-y-4">
                    {experience.rounds.map((round: Round, index: number) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold">Round {round.roundNumber}: {round.name}</h3>
                                <div className="flex items-center gap-3 text-sm">
                                    {round.duration && (
                                        <div className="flex items-center gap-1 text-white/60">
                                            <Clock className="w-4 h-4" />
                                            <span>{round.duration}</span>
                                        </div>
                                    )}
                                    <span className={`font-medium ${difficultyColors[round.difficulty as keyof typeof difficultyColors]}`}>
                                        {round.difficulty}
                                    </span>
                                </div>
                            </div>
                            {round.description && (
                                <p className="text-white/70">{round.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Compensation */}
            {(experience.salaryOffered || experience.joiningBonus || experience.otherBenefits) && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Compensation Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {experience.salaryOffered && (
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-white/60 text-sm mb-1">Salary Offered</p>
                                <p className="text-2xl font-bold text-primary">₹{experience.salaryOffered} LPA</p>
                            </div>
                        )}
                        {experience.joiningBonus && (
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-white/60 text-sm mb-1">Joining Bonus</p>
                                <p className="text-2xl font-bold text-primary">₹{experience.joiningBonus} LPA</p>
                            </div>
                        )}
                    </div>
                    {experience.otherBenefits && (
                        <div className="mt-4">
                            <p className="text-white/60 text-sm mb-2">Other Benefits</p>
                            <p className="text-white/80">{experience.otherBenefits}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experience.applicationProcess && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="font-bold mb-3">Application Process</h3>
                        <p className="text-white/70">{experience.applicationProcess}</p>
                    </div>
                )}

                {experience.preparationTips && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="font-bold mb-3">Preparation Tips</h3>
                        <p className="text-white/70">{experience.preparationTips}</p>
                    </div>
                )}

                {experience.interviewerBehavior && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="font-bold mb-3">Interviewer Behavior</h3>
                        <p className="text-white/70">{experience.interviewerBehavior}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
