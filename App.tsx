import React, { useState, useCallback } from 'react';
import { Company } from './types';
import { MOCK_RAW_DATA } from './constants';
import { analyzeCompaniesBatch } from './services/geminiService';
import Button from './components/Button';
import LandscapeView from './components/LandscapeView';
import TrendAnalysis from './components/TrendAnalysis';

enum ViewMode {
  LANDSCAPE = 'landscape',
  TRENDS = 'trends'
}

const App: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LANDSCAPE);
  const [error, setError] = useState<string | null>(null);

  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    setError(null);
    
    try {
      // 1. Simulate scraping delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 2. Prepare raw data (In a real app, this comes from the scraper)
      const rawData = MOCK_RAW_DATA;

      // 3. Call Gemini API
      const analysisResults = await analyzeCompaniesBatch(rawData);

      // 4. Merge results
      const mergedCompanies: Company[] = rawData.map(raw => ({
        ...raw,
        status: 'analyzed',
        analysis: analysisResults[raw.id] || undefined
      }));

      setCompanies(mergedCompanies);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("Failed to analyze companies. Check your API key.");
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center font-bold text-lg">Y</div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">AI Radar</h1>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">v1.0</span>
        </div>

        <div className="flex items-center gap-4">
           {/* Navigation Tabs */}
          <div className="flex bg-slate-800 rounded-lg p-1 mr-4">
            <button 
              onClick={() => setViewMode(ViewMode.LANDSCAPE)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === ViewMode.LANDSCAPE ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Landscape
            </button>
            <button 
              onClick={() => setViewMode(ViewMode.TRENDS)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === ViewMode.TRENDS ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Trends
            </button>
          </div>

          <div className="text-right mr-4 hidden md:block">
            <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Status</p>
            <p className="text-xs text-emerald-400 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Ready to sync'}
            </p>
          </div>
          
          <Button onClick={handleSync} isLoading={isSyncing}>
            {isSyncing ? 'Analyzing...' : 'Sync YC Data'}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-900/80 border border-red-500 text-red-200 px-4 py-2 rounded-lg z-50 text-sm">
            {error}
          </div>
        )}

        {companies.length === 0 && !isSyncing && !error && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10">
              <div className="max-w-md text-center p-8">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                   <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Build Your AI Landscape</h2>
                <p className="text-slate-400 mb-8">
                  Click the sync button to scrape the latest batch data and use Gemini to auto-classify companies into the radar.
                </p>
                <Button onClick={handleSync} className="w-full py-3 text-lg">
                  Start Analysis
                </Button>
              </div>
           </div>
        )}

        <div className="h-full pt-6">
          {viewMode === ViewMode.LANDSCAPE ? (
             <LandscapeView companies={companies} />
          ) : (
            <div className="h-full overflow-y-auto">
              <TrendAnalysis companies={companies} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;