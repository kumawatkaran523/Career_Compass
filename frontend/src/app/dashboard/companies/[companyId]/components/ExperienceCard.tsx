// app/dashboard/companies/[companyId]/components/ExperienceCard.tsx
import Link from 'next/link';
import { Star, ThumbsUp } from 'lucide-react';

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
    salaryOffered?: number | null;
}

interface ExperienceCardProps {
    experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
    const outcomeColors = {
        SELECTED: 'bg-green-500/20 text-green-400 border-green-500/30',
        REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
        WAITING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };

    return (
        <Link
            href={`/dashboard/companies/experiences/${experience.id}`}
            className="block bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{experience.reviewTitle}</h3>
                    </div>
                    <p className="text-white/60 text-sm mb-3">
                        {experience.isAnonymous
                            ? 'Anonymous'
                            : `${experience.user.firstName} ${experience.user.lastName}`
                        } • {experience.college.name} • Class of {experience.user.graduationYear}
                    </p>
                    <p className="text-white/80 text-sm line-clamp-2">
                        {experience.reviewText.substring(0, 150)}...
                    </p>
                </div>
                <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium flex-shrink-0 border ${outcomeColors[experience.outcome as keyof typeof outcomeColors]
                        }`}
                >
                    {experience.outcome}
                </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/70 border-t border-white/10 pt-4 flex-wrap">
                <div>
                    Role: <span className="text-white font-medium">{experience.role}</span>
                </div>
                <div>
                    Difficulty: <span className="text-yellow-400">{experience.overallDifficulty}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {experience.overallRating}
                </div>
                {experience.salaryOffered && (
                    <div>
                        Salary: <span className="text-primary">₹{experience.salaryOffered} LPA</span>
                    </div>
                )}
                <div className="ml-auto flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {experience.upvotes}
                    </div>
                </div>
            </div>
        </Link>
    );
}
