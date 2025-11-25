// AddQuestionModal.tsx
'use client';

import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface AddQuestionModalProps {
    companyId: string;
    collegeId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddQuestionModal({ companyId, collegeId, onClose, onSuccess }: AddQuestionModalProps) {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        questionText: '',
        questionType: '',
        difficulty: '',
        round: '',
        topic: '',
        questionLink: '',
        sampleAnswer: '', // Add this
        approach: '', // Add this
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.questionText.trim()) newErrors.questionText = 'Question is required';
        if (!formData.questionType) newErrors.questionType = 'Question type is required';
        if (!formData.difficulty) newErrors.difficulty = 'Difficulty is required';
        if (!formData.round) newErrors.round = 'Round is required';
        if (!formData.topic.trim()) newErrors.topic = 'Topic is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        companyId,
                        collegeId: collegeId || null,
                        questionText: formData.questionText,
                        questionType: formData.questionType,
                        difficulty: formData.difficulty,
                        round: formData.round,
                        topic: formData.topic,
                        questionLink: formData.questionLink || null,
                        sampleAnswer: formData.sampleAnswer || null,
                        approach: formData.approach || null,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create question');
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error creating question:', error);
            setErrors({ submit: error.message || 'Failed to create question' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            Add Interview Question
                        </h3>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center group disabled:opacity-50"
                        >
                            <X className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {/* Error Message */}
                    {errors.submit && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <p className="text-sm text-red-400">{errors.submit}</p>
                        </div>
                    )}

                    {/* Question Text */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                            Question <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={formData.questionText}
                            onChange={(e) => handleChange('questionText', e.target.value)}
                            rows={4}
                            disabled={loading}
                            className={`w-full px-4 py-3 bg-white/5 border ${errors.questionText ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none text-white placeholder:text-white/40 disabled:opacity-50`}
                            placeholder="Enter the interview question you were asked..."
                        />
                        {errors.questionText && (
                            <p className="mt-1 text-sm text-red-400">{errors.questionText}</p>
                        )}
                    </div>

                    {/* Question Type & Round (2 columns) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Question Type <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={formData.questionType}
                                onChange={(e) => handleChange('questionType', e.target.value)}
                                disabled={loading}
                                className={`w-full px-4 py-3 bg-white/5 border ${errors.questionType ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-white appearance-none cursor-pointer disabled:opacity-50`}
                            >
                                <option value="" className="bg-[#0a0a0a]">Select type</option>
                                <option value="CODING" className="bg-[#0a0a0a]">Coding</option>
                                <option value="TECHNICAL" className="bg-[#0a0a0a]">Technical</option>
                                <option value="BEHAVIORAL" className="bg-[#0a0a0a]">Behavioral</option>
                                <option value="SYSTEM_DESIGN" className="bg-[#0a0a0a]">System Design</option>
                            </select>
                            {errors.questionType && (
                                <p className="mt-1 text-sm text-red-400">{errors.questionType}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Interview Round <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={formData.round}
                                onChange={(e) => handleChange('round', e.target.value)}
                                disabled={loading}
                                className={`w-full px-4 py-3 bg-white/5 border ${errors.round ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-white appearance-none cursor-pointer disabled:opacity-50`}
                            >
                                <option value="" className="bg-[#0a0a0a]">Select round</option>
                                <option value="ROUND_1" className="bg-[#0a0a0a]">Round 1</option>
                                <option value="ROUND_2" className="bg-[#0a0a0a]">Round 2</option>
                                <option value="ROUND_3" className="bg-[#0a0a0a]">Round 3</option>
                                <option value="ROUND_4" className="bg-[#0a0a0a]">Round 4</option>
                                <option value="ROUND_5" className="bg-[#0a0a0a]">Round 5</option>
                                <option value="ROUND_6" className="bg-[#0a0a0a]">Round 6</option>
                            </select>
                            {errors.round && (
                                <p className="mt-1 text-sm text-red-400">{errors.round}</p>
                            )}
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                            Difficulty <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'EASY', label: 'Easy', color: 'green' },
                                { value: 'MEDIUM', label: 'Medium', color: 'yellow' },
                                { value: 'HARD', label: 'Hard', color: 'red' }
                            ].map((diff) => (
                                <button
                                    key={diff.value}
                                    type="button"
                                    onClick={() => handleChange('difficulty', diff.value)}
                                    disabled={loading}
                                    className={`px-4 py-3 rounded-xl font-medium transition-all border disabled:opacity-50 ${formData.difficulty === diff.value
                                            ? `bg-${diff.color}-500/20 text-${diff.color}-400 border-${diff.color}-500/50 shadow-lg shadow-${diff.color}-500/20`
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/10'
                                        }`}
                                >
                                    {diff.label}
                                </button>
                            ))}
                        </div>
                        {errors.difficulty && (
                            <p className="mt-1 text-sm text-red-400">{errors.difficulty}</p>
                        )}
                    </div>

                    {/* Topic */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                            Topic/Category <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.topic}
                            onChange={(e) => handleChange('topic', e.target.value)}
                            disabled={loading}
                            className={`w-full px-4 py-3 bg-white/5 border ${errors.topic ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-white placeholder:text-white/40 disabled:opacity-50`}
                            placeholder="e.g., Data Structures, Algorithms, System Design"
                        />
                        {errors.topic && (
                            <p className="mt-1 text-sm text-red-400">{errors.topic}</p>
                        )}
                    </div>

                    {/* Link */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                            Question Link <span className="text-white/40 text-xs font-normal">(optional)</span>
                        </label>
                        <input
                            type="url"
                            value={formData.questionLink}
                            onChange={(e) => handleChange('questionLink', e.target.value)}
                            disabled={loading}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-white placeholder:text-white/40 disabled:opacity-50"
                            placeholder="https://leetcode.com/problems/..."
                        />
                        <p className="text-xs text-white/40 mt-1.5">
                            Add a link to LeetCode, HackerRank, or any other platform
                        </p>
                    </div>

                    {/* Sample Answer / Explanation */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                            Your Answer / Explanation <span className="text-white/40 text-xs font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={formData.sampleAnswer}
                            onChange={(e) => handleChange('sampleAnswer', e.target.value)}
                            rows={4}
                            disabled={loading}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none text-white placeholder:text-white/40 disabled:opacity-50"
                            placeholder="How did you answer this question? Share your approach or solution..."
                        />
                    </div>

                    {/* Approach / Tips */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                            Approach / Tips <span className="text-white/40 text-xs font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={formData.approach}
                            onChange={(e) => handleChange('approach', e.target.value)}
                            rows={3}
                            disabled={loading}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none text-white placeholder:text-white/40 disabled:opacity-50"
                            placeholder="Any tips or strategies for answering this question?"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-all border border-white/10 text-white disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl font-medium transition-all shadow-lg shadow-primary/30 flex items-center gap-2 text-white disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Add Question
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
