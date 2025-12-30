import React from 'react';
import { Company } from '../types';
import CompanyCard from './CompanyCard';

interface LandscapeViewProps {
  companies: Company[];
}

const LandscapeView: React.FC<LandscapeViewProps> = ({ companies }) => {
  // Group companies by category
  const grouped = companies.reduce((acc, company) => {
    const category = company.analysis?.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(company);
    return acc;
  }, {} as Record<string, Company[]>);

  // If no analysis yet, dump everything in "Uncategorized"
  const categories = Object.keys(grouped).sort();

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <p className="text-lg mb-2">No companies data found.</p>
        <p className="text-sm">Click "Sync YC Data" to start the AI analysis.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-x-auto overflow-y-hidden pb-4">
      <div className="flex gap-6 h-full min-w-max px-6">
        {categories.map((category) => (
          <div key={category} className="w-80 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-slate-900 z-10 py-2 border-b border-slate-800">
              <h2 className="font-bold text-slate-200">{category}</h2>
              <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">
                {grouped[category].length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide pb-20">
              {grouped[category].map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandscapeView;