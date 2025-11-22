import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import QuestionItem from "./QuestionItem";
import { Company, Question } from "../types";

interface Props {
  company: Company | null;
  round: string;
}

export default function QuestionList({ company, round }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!company) {
      setQuestions([]);
      return;
    }
    setLoading(true);
    fetch(`/api/questions?companyId=${company.id}&round=${encodeURIComponent(round)}`)
      .then((r) => r.json())
      .then((data) => setQuestions(data))
      .finally(() => setLoading(false));
  }, [company, round]);

  if (!company) {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-white/40" />
        </div>
        <p className="text-white/60 text-lg">Select a company to view questions</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <p className="text-white/60 text-lg">No questions found for this round</p>
        <p className="text-white/40 text-sm mt-2">Be the first to contribute!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/10">
      {questions.map((q) => (
        <QuestionItem key={q.id} question={q} />
      ))}
    </div>
  );
}
