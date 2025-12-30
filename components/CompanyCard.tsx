import React from 'react';
import { Company } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const isAiNative = company.analysis?.isAiNative;
  const category = company.analysis?.category || 'Uncategorized';
  const colorClass = CATEGORY_COLORS[category] || 'bg-slate-500';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-orange-500/50 transition-colors group relative overflow-hidden">
      {/* Top Banner Stripe */}
      <div className={`absolute top-0 left-0 w-1 h-full ${isAiNative ? colorClass : 'bg-slate-600'}`}></div>

      <div className="pl-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
               {company.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-slate-100 leading-tight">{company.name}</h3>
              <span className="text-xs text-slate-400 font-mono">{company.batch}</span>
            </div>
          </div>
          {isAiNative && (
            <span className="text-[10px] uppercase tracking-wider font-bold text-orange-400 bg-orange-900/30 px-2 py-0.5 rounded-full">
              AI Native
            </span>
          )}
        </div>

        {company.analysis ? (
          <>
            <p className="text-sm text-slate-300 mb-3 line-clamp-3">
              {company.analysis.summary}
            </p>
            <div className="flex flex-wrap gap-1 mt-auto">
              <span className={`text-[10px] px-2 py-0.5 rounded text-white ${colorClass} bg-opacity-80`}>
                {company.analysis.subCategory}
              </span>
              {company.analysis.tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400 italic">
            {company.rawDescription.substring(0, 100)}...
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;