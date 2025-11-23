import Link from 'next/link';
import { Star, ThumbsUp } from 'lucide-react';
import { Experience } from '../types';

interface ExperienceCardProps {
    experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
    return (
        <Link
            href={`/dashboard/experiences/${experience.id}`}
            className="block bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{experience.reviewTitle}</h3>
                        {experience.isCollege && (
                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
                                Your College
                            </span>
                        )}
                    </div>
                    <p className="text-white/60 text-sm mb-3">
                        {experience.user.name} • {experience.user.branch} • Batch {experience.user.graduationYear}
                    </p>
                    <p className="text-white/80 text-sm line-clamp-2">{experience.reviewSnippet}</p>
                </div>
                <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium flex-shrink-0 ${
                        experience.outcome === 'SELECTED'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                    }`}
                >
                    {experience.outcome}
                </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/70 border-t border-white/10 pt-4">
                <div>Role: <span className="text-white font-medium">{experience.role}</span></div>
                <div>Difficulty: <span className="text-yellow-400">{experience.overallDifficulty}</span></div>
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {experience.overallRating}
                </div>
                {experience.salaryOffered && (
                    <div>Salary: <span className="text-primary">₹{experience.salaryOffered} LPA</span></div>
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
