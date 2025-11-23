'use client';

import { useState } from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';

interface AddQuestionModalProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export default function AddQuestionModal({ onClose, onSubmit }: AddQuestionModalProps) {
    const [formData, setFormData] = useState({
        questionText: '',
        questionType: '',
        difficulty: '',
        round: '',
        topic: '',
        link: '',
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a0a] backdrop-blur-sm z-10">
                    <h3 className="text-2xl font-bold text-white">Add Interview Question</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center"
                    >
                        <XCircle className="w-5 h-5 text-white/70" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Question Text */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                            Question <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={formData.questionText}
                            onChange={(e) => handleChange('questionText', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-white placeholder:text-white/40"
                            placeholder="Enter the interview question you were asked..."
                            required
                        />
                    </div>

                    {/* Question Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                            Question Type <span className="text-red-400">*</span>
                        </label>
                        <CustomDropdown
                            options={['Coding', 'Technical', 'Behavioral', 'System Design']}
                            value={formData.questionType}
                            onChange={(val) => handleChange('questionType', val)}
                            placeholder="Select type"
                        />
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                            Difficulty <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {['EASY', 'MEDIUM', 'HARD'].map((diff) => (
                                <button
                                    key={diff}
                                    type="button"
                                    onClick={() => handleChange('difficulty', diff)}
                                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                                        formData.difficulty === diff
                                            ? diff === 'EASY'
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/50'
                                                : diff === 'MEDIUM'
                                                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/50'
                                                : 'bg-red-500/10 text-red-400 border border-red-500/50'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                                    }`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Round */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                            Interview Round <span className="text-red-400">*</span>
                        </label>
                        <CustomDropdown
                            options={['Round 1 - Online Test', 'Round 2 - Technical', 'Round 3 - HR', 'Round 4 - Managerial']}
                            value={formData.round}
                            onChange={(val) => handleChange('round', val)}
                            placeholder="Select round"
                        />
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
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-white placeholder:text-white/40"
                            placeholder="e.g., Data Structures, Algorithms, System Design, etc."
                            required
                        />
                    </div>

                    {/* Link */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                            Question Link <span className="text-white/40 text-xs">(optional)</span>
                        </label>
                        <input
                            type="url"
                            value={formData.link}
                            onChange={(e) => handleChange('link', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-white placeholder:text-white/40"
                            placeholder="https://leetcode.com/problems/..."
                        />
                        <p className="text-xs text-white/40 mt-1">
                            Add a link to LeetCode, HackerRank, or any other platform
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-all border border-white/10 text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2 text-white"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Add Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
