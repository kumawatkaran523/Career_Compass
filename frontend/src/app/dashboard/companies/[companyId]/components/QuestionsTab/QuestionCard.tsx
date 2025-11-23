import { ThumbsUp, Globe } from 'lucide-react';
import { Question } from '../../types';

interface QuestionCardProps {
    question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{question.questionText}</h4>
                        {question.link && (
                            <a
                                href={question.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary-600 transition-colors"
                                title="View question on external platform"
                            >
                                <Globe className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/60">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                            question.difficulty === 'HARD' ? 'bg-red-500/20 text-red-400' :
                            question.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                        }`}>
                            {question.difficulty}
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 rounded text-xs">{question.questionType}</span>
                        <span>{question.round}</span>
                        <span>{question.topic}</span>
                        <span>Asked {question.askedCount}x at your college</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-white/60 text-sm">
                    <ThumbsUp className="w-4 h-4" />
                    {question.upvotes}
                </div>
            </div>
        </div>
    );
}
