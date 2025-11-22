import { useState } from "react";
import { X } from "lucide-react";
import { Company } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  company: Company | null;
  round: string;
}

export default function AddQuestionModal({ open, onClose, company, round }: Props) {
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !company) return;
    setLoading(true);
    fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        companyId: company.id,
        round,
        difficulty,
      }),
    })
      .then(() => {
        setText("");
        setTags("");
        onClose();
      })
      .finally(() => setLoading(false));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Add Interview Question</h2>
          <button type="button" onClick={onClose} className="text-white/60 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Company</label>
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white">
              {company?.name || "Not selected"}
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Round</label>
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white">
              {round}
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Question</label>
            <textarea
              required
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the interview question..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Arrays, DP, System Design (comma-separated)"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Difficulty</label>
            <div className="flex gap-2">
              {(["Easy", "Medium", "Hard"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                    difficulty === level
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="flex-1 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-600 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
