import { useState } from "react";
import { ChevronDown, ChevronUp, ThumbsUp, Tag } from "lucide-react";
import { Question } from "../types";

interface Props {
  question: Question;
}

export default function QuestionItem({ question }: Props) {
  const [expanded, setExpanded] = useState(false);

  const difficultyColor = {
    Easy: "text-green-400 bg-green-400/10",
    Medium: "text-yellow-400 bg-yellow-400/10",
    Hard: "text-red-400 bg-red-400/10",
  };

  return (
    <div className="p-6 hover:bg-white/5 transition">
      <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1">
          <p className="text-white font-medium text-lg mb-2">{question.text}</p>
          <div className="flex flex-wrap items-center gap-2">
            {question.difficulty && (
              <span className={`text-xs px-2 py-1 rounded-md font-medium ${difficultyColor[question.difficulty]}`}>
                {question.difficulty}
              </span>
            )}
            {question.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-md bg-blue-400/10 text-blue-400 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button className="text-white/60 hover:text-white transition">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">
              Contributed by <span className="text-white font-medium">{question.contributor || "Anonymous"}</span>
            </span>
            <button className="flex items-center gap-2 text-white/60 hover:text-primary transition">
              <ThumbsUp className="w-4 h-4" />
              {question.upvotes || 0}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
