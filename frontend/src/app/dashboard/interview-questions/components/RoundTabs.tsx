const ROUNDS = [
  { id: "DSA", label: "DSA" },
  { id: "Technical", label: "Technical" },
  { id: "HR", label: "HR" },
  { id: "Group Discussion", label: "GD" },
];

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function RoundTabs({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-white/80 font-medium text-sm mb-2">Round</label>
      <div className="flex flex-wrap gap-2">
        {ROUNDS.map((round) => (
          <button
            key={round.id}
            onClick={() => onChange(round.id)}
            className={`px-5 py-2 rounded-lg font-medium transition-all ${
              value === round.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {round.label}
          </button>
        ))}
      </div>
    </div>
  );
}
