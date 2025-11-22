"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ListChecks, Plus } from "lucide-react";
import CompanySelector from "./components/CompanySelector";
import RoundTabs from "./components/RoundTabs";
import QuestionList from "./components/QuestionList";
import AddQuestionModal from "./components/AddQuestionModal";
import { Company } from "./types";

export default function InterviewQuestionsPage() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRound, setSelectedRound] = useState("DSA");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();

  return (
    <div className="min-h-screen">
      {/* Header - Using your exact gradient pattern */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <ListChecks className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Interview Questions</h1>
            <p className="text-white/60 text-sm">
              Real questions from {selectedCompany ? selectedCompany.name : "top companies"} • Curated by students
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          {/* Company Selector */}
          <div className="flex-1 w-full lg:w-auto lg:min-w-[280px]">
            <CompanySelector value={selectedCompany} onChange={setSelectedCompany} />
          </div>

          {/* Round Tabs */}
          <div className="flex-1">
            <RoundTabs value={selectedRound} onChange={setSelectedRound} />
          </div>

          {/* Add Question Button - Using exact primary colors */}
          <div className="w-full lg:w-auto">
            {user ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full lg:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/20"
              >
                <Plus className="w-5 h-5" />
                Add Question
              </button>
            ) : (
              <div className="text-white/40 text-sm text-center lg:text-right">
                Login to contribute
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <QuestionList company={selectedCompany} round={selectedRound} />
      </div>

      {/* Add Question Modal */}
      <AddQuestionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={selectedCompany}
        round={selectedRound}
      />
    </div>
  );
}
