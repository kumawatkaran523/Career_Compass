'use client';

import { useState } from 'react';
import { GraduationCap, MessageCircle } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';
import AddQuestionModal from './AddQuestionModal';
import QuestionCard from './QuestionCard';
import { mockQuestions } from '../../data/mockData';

interface QuestionsTabProps {
    companyId: string;
}

export default function QuestionsTab({ companyId }: QuestionsTabProps) {
    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
    const [selectedType, setSelectedType] = useState('All Types');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All Difficulties');
    const [selectedRound, setSelectedRound] = useState('All Rounds');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Questions from Your College
                </h3>
                <button
                    onClick={() => setShowAddQuestionModal(true)}
                    className="px-6 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                    <MessageCircle className="w-5 h-5" />
                    Add Question
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 flex-wrap">
                <CustomDropdown
                    options={['All Types', 'Coding', 'Technical', 'Behavioral', 'System Design']}
                    value={selectedType}
                    onChange={setSelectedType}
                    placeholder="All Types"
                />
                <CustomDropdown
                    options={['All Difficulties', 'Easy', 'Medium', 'Hard']}
                    value={selectedDifficulty}
                    onChange={setSelectedDifficulty}
                    placeholder="All Difficulties"
                />
                <CustomDropdown
                    options={['All Rounds', 'Round 1', 'Round 2', 'Round 3']}
                    value={selectedRound}
                    onChange={setSelectedRound}
                    placeholder="All Rounds"
                />
            </div>

            {/* Questions List */}
            <div className="space-y-3">
                {mockQuestions.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                ))}
            </div>

            {/* Modal */}
            {showAddQuestionModal && (
                <AddQuestionModal
                    onClose={() => setShowAddQuestionModal(false)}
                    onSubmit={(data) => {
                        console.log('Question submitted:', data);
                        setShowAddQuestionModal(false);
                    }}
                />
            )}
        </div>
    );
}
