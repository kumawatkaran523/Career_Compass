// app/dashboard/companies/[companyId]/components/QuestionsTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import AddQuestionModal from './AddQuestionModal';
import QuestionCard from './QuestionCard';

interface QuestionsTabProps {
    companyId: string;
}

export default function QuestionsTab({ companyId }: QuestionsTabProps) {
    const { user } = useUser();
    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
    const [selectedType, setSelectedType] = useState('ALL');
    const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
    const [selectedRound, setSelectedRound] = useState('ALL');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userDbId, setUserDbId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const fetchUserDbId = async () => {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/clerk/${user.id}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setUserDbId(data.data?.id);
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            };
            fetchUserDbId();
        }
    }, [user]);
    const fetchQuestions = async () => {
        try {
            const params = new URLSearchParams();
            if (selectedType !== 'ALL') params.append('questionType', selectedType);
            if (selectedDifficulty !== 'ALL') params.append('difficulty', selectedDifficulty);
            if (selectedRound !== 'ALL') params.append('round', selectedRound);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/company/${companyId}?${params.toString()}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }

            const data = await response.json();
            setQuestions(data.data || []);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [companyId, selectedType, selectedDifficulty, selectedRound]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-1">Interview Questions</h3>
                    <p className="text-white/60 text-sm">Questions asked at your college</p>
                </div>
                <button
                    onClick={() => setShowAddQuestionModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl font-medium transition-all shadow-lg shadow-primary/30 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Question
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-white/60" />
                    <span className="text-sm font-medium text-white/60">Filters</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                    >
                        <option value="ALL" className="bg-[#0a0a0a]">All Types</option>
                        <option value="CODING" className="bg-[#0a0a0a]">Coding</option>
                        <option value="TECHNICAL" className="bg-[#0a0a0a]">Technical</option>
                        <option value="BEHAVIORAL" className="bg-[#0a0a0a]">Behavioral</option>
                        <option value="SYSTEM_DESIGN" className="bg-[#0a0a0a]">System Design</option>
                    </select>

                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                    >
                        <option value="ALL" className="bg-[#0a0a0a]">All Difficulties</option>
                        <option value="EASY" className="bg-[#0a0a0a]">Easy</option>
                        <option value="MEDIUM" className="bg-[#0a0a0a]">Medium</option>
                        <option value="HARD" className="bg-[#0a0a0a]">Hard</option>
                    </select>

                    <select
                        value={selectedRound}
                        onChange={(e) => setSelectedRound(e.target.value)}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                    >
                        <option value="ALL" className="bg-[#0a0a0a]">All Rounds</option>
                        <option value="ROUND_1" className="bg-[#0a0a0a]">Round 1</option>
                        <option value="ROUND_2" className="bg-[#0a0a0a]">Round 2</option>
                        <option value="ROUND_3" className="bg-[#0a0a0a]">Round 3</option>
                        <option value="ROUND_4" className="bg-[#0a0a0a]">Round 4</option>
                    </select>
                </div>
            </div>

            {/* Questions List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : questions.length > 0 ? (
                <div className="space-y-3">
                        {questions.map((q: any) => (
                            <QuestionCard key={q.id} question={q} userDbId={userDbId || undefined} />
                        ))}
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                    <p className="text-white/60">No questions yet. Be the first to add one!</p>
                </div>
            )}

            {/* Modal */}
            {showAddQuestionModal && (
                <AddQuestionModal
                    companyId={companyId}
                    collegeId={user?.publicMetadata?.collegeId as string | undefined}
                    onClose={() => setShowAddQuestionModal(false)}
                    onSuccess={() => {
                        fetchQuestions(); // Refresh the list
                    }}
                />
            )}
        </div>
    );
}
