import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Company } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface TrendAnalysisProps {
  companies: Company[];
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ companies }) => {
  
  const stats = useMemo(() => {
    const aiNative = companies.filter(c => c.analysis?.isAiNative);
    
    // Category Distribution
    const categoryCount = aiNative.reduce((acc, curr) => {
      const cat = curr.analysis?.category || 'Other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryCount)
      .map(([name, value]) => ({ name, value: Number(value) }))
      .sort((a, b) => b.value - a.value);

    // Batch Distribution (Mock logic since all data is mostly W24/S23)
    const batchCount = aiNative.reduce((acc, curr) => {
      acc[curr.batch] = (acc[curr.batch] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const batchData = Object.entries(batchCount).map(([name, value]) => ({ name, value }));

    return { categoryData, batchData, totalAi: aiNative.length, total: companies.length };
  }, [companies]);

  if (companies.length === 0) {
     return <div className="p-10 text-center text-slate-400">No data available. Please sync first.</div>;
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium uppercase mb-2">Total Companies Scanned</h3>
          <p className="text-4xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium uppercase mb-2">AI Native Companies</h3>
          <p className="text-4xl font-bold text-orange-500">{stats.totalAi}</p>
          <p className="text-xs text-slate-500 mt-1">{Math.round((stats.totalAi / stats.total) * 100)}% Penetration</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium uppercase mb-2">Top Category</h3>
          <p className="text-2xl font-bold text-blue-400">
            {stats.categoryData[0]?.name || 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Chart */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-96">
          <h3 className="text-lg font-bold text-white mb-6">AI Category Landscape</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={stats.categoryData} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                cursor={{fill: '#334155', opacity: 0.4}}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {stats.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name]?.replace('bg-', '').replace('-500', '') === 'orange' ? '#f97316' : '#3b82f6'} /> // Simplified color mapping for demo
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Batch Trend */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-96">
          <h3 className="text-lg font-bold text-white mb-6">AI Count per Batch</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={stats.batchData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.batchData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f97316' : '#8b5cf6'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;