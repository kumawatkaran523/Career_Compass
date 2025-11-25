// app/dashboard/companies/[companyId]/components/QuestionCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ExternalLink, Award } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface Question {
    id: string;
    questionText: string;
    questionType: string;
    difficulty: string;
    round: string;
    topic: string;
    questionLink?: string;
    upvotes: number;
    askedCount: number;
}

interface QuestionCardProps {
    question: Question;
    userDbId?: string; // Pass this from parent
}

export default function QuestionCard({ question, userDbId }: QuestionCardProps) {
    const { user } = useUser();
    const [upvotes, setUpvotes] = useState(question.upvotes);
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [loading, setLoading] = useState(false);

    const difficultyColors = {
        HARD: 'bg-red-500/20 text-red-400 border-red-500/30',
        MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        EASY: 'bg-green-500/20 text-green-400 border-green-500/30',
    };

    const typeColors = {
        CODING: 'bg-blue-500/20 text-blue-400',
        TECHNICAL: 'bg-purple-500/20 text-purple-400',
        BEHAVIORAL: 'bg-pink-500/20 text-pink-400',
        SYSTEM_DESIGN: 'bg-orange-500/20 text-orange-400',
    };

    // Check if user already upvoted
    useEffect(() => {
        if (!userDbId) return;

        const checkVoteStatus = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${question.id}/vote-status?userId=${userDbId}`
                );

                if (response.ok) {
                    const data = await response.json();
                    setIsUpvoted(data.data?.hasUpvoted || false);
                }
            } catch (error) {
                console.error('Error checking vote status:', error);
            }
        };

        checkVoteStatus();
    }, [question.id, userDbId]);

    const handleUpvote = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!user || !userDbId || loading) return;

        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${question.id}/upvote`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: userDbId }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to upvote');
            }

            const data = await response.json();

            // Toggle upvote state based on backend response
            if (data.message === "Upvote removed") {
                setUpvotes(prev => prev - 1);
                setIsUpvoted(false);
            } else {
                setUpvotes(prev => prev + 1);
                setIsUpvoted(true);
            }
        } catch (error) {
            console.error('Error upvoting:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-primary/50 hover:bg-white/[0.07] transition-all group">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Question Text */}
                    <div className="flex items-start gap-3 mb-3">
                        <p className="font-medium text-white leading-relaxed flex-1">
                            {question.questionText}
                        </p>
                        {question.questionLink && (
                            <a
                                href={question.questionLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary transition-all"
                                title="View on external platform"
                            >
                                <span>Visit Problem</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${difficultyColors[question.difficulty as keyof typeof difficultyColors]}`}>
                            {question.difficulty}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${typeColors[question.questionType as keyof typeof typeColors]}`}>
                            {question.questionType.replace('_', ' ')}
                        </span>
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-white/60">
                            {question.round.replace('_', ' ')}
                        </span>
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-white/60">
                            {question.topic}
                        </span>
                        {/* <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-lg text-xs text-primary">
                            <Award className="w-3.5 h-3.5" />
                            <span>Asked {question.askedCount}x</span>
                        </div> */}
                    </div>
                </div>

                {/* Upvote Button */}
                <button
                    onClick={handleUpvote}
                    disabled={loading || !userDbId}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-all group cursor-pointer ${isUpvoted
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                        } disabled:opacity-50 `}
                >
                    <ThumbsUp className={`w-4 h-4 transition-transform ${isUpvoted ? 'fill-primary' : ''} ${!loading && 'group-hover:scale-110'}`} />
                    <span className="font-medium">{upvotes}</span>
                </button>
            </div>
        </div>
    );
}
