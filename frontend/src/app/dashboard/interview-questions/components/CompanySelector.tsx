import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { Company } from "../types";

interface Props {
  value: Company | null;
  onChange: (val: Company | null) => void;
}

export default function CompanySelector({ value, onChange }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then(setCompanies)
      .catch(() => {});
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-white/80 font-medium text-sm mb-2">Company</label>
      <div className="relative">
        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder="Search companies..."
          value={value?.name || searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (!e.target.value) onChange(null);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
        />
      </div>
      
      {isOpen && filteredCompanies.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          {filteredCompanies.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onChange(c);
                setSearchTerm("");
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-white/10 text-white transition flex items-center gap-3"
            >
              <Building2 className="w-4 h-4 text-white/60" />
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
